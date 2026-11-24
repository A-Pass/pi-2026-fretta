"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Truck,
  Home,
  Package,
  MessageCircle,
  User,
  MapPin,
  Bell,
  X,
} from "lucide-react";
import type {
  AppNotification,
  FreightRequestDraft,
  Freight,
  OperatingArea,
  Proposal,
  ProposalOffer,
  Store,
} from "@/contracts";
import { api } from "../api/client";
import {
  createBackendClient,
  type FreightFeedItem,
} from "../api/backend";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { SuccessDialog } from "../components/SuccessDialog";
import { ProposalFormDialog } from "../components/ProposalFormDialog";
import { EmptyState } from "../components/EmptyState";
import { RequestWizard } from "./RequestWizard";
import { AddressBookView } from "./addresses/AddressBookView";
import { DriverHomeView } from "./driver/DriverHomeView";
import { DriverServicesView } from "./driver/DriverServicesView";
import {
  freightFromFeedItem,
  isFreightFeedItem,
  ownProposal,
} from "./driver/rules";
import { LoginView } from "./LoginView";
import { WelcomeView } from "./WelcomeView";
import { ProfileView } from "./ProfileView";
import { ChatView } from "./ChatView";
import { FreightDetailsView } from "./FreightDetailsView";
import { FreightListView } from "./FreightListView";
import { VehicleBookView } from "./vehicles/VehicleBookView";
import { NotificationsView } from "./notifications/NotificationsView";
import {
  isUnreadChat,
  withNotifications,
  unreadNotifications,
} from "./notifications/rules";
import { SubscriptionView } from "./subscription/SubscriptionView";
import { useNavigation } from "./navigation/useNavigation";
import { routeUrl } from "./navigation/routes";
import { reviseOffer } from "./freights/negotiation";
import { scheduleLabel } from "../lib/dates";
import { DriverOnboardingView } from "./onboarding/DriverOnboardingView";
import { DriverRegistrationStatusView } from "./onboarding/DriverRegistrationStatusView";
import { driverCanPropose, submitDriverRegistration } from "./onboarding/rules";
import { ProviderProfileView } from "./providers/ProviderProfileView";
import { CompanyProfileView } from "./providers/CompanyProfileView";
import {
  providerId as proposalProviderId,
  publicProvider,
} from "./providers/rules";
import { InstallApp } from "../components/InstallApp";
import { authClient } from "../auth/client";

const opportunityCache = new Map<string, FreightFeedItem>();
const opportunityStorageKey = "fretta-selected-opportunity";
const primaryTabs = ["inicio", "fretes", "chat", "perfil"] as const;

export function FrettaApp() {
  const navigation = useNavigation();
  const {
    role,
    tab,
    selected,
    chatId,
    providerId,
    ready,
    loginRequested,
    setRole,
    setSelected,
    setChatId,
  } = navigation;
  const [store, setStore] = useState<Store | null>(null),
    [selectedOpportunity, setSelectedOpportunity] = useState<Freight | null>(
      null,
    ),
    [resolvedOpportunityId, setResolvedOpportunityId] = useState<string | null>(
      null,
    ),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [loadError, setLoadError] = useState("");
  const [googleSignInPending, setGoogleSignInPending] = useState(false);
  const [googleSignInError, setGoogleSignInError] = useState("");
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [updatingDriver, setUpdatingDriver] = useState(false);
  const [modal, setModal] = useState(""),
    [success, setSuccess] = useState<"proposal" | "request" | null>(null);
  const [publishedRequestId, setPublishedRequestId] = useState<string | null>(
    null,
  );
  const [acceptanceNotice, setAcceptanceNotice] =
    useState<AppNotification | null>(null);
  const seenAcceptances = useRef(new Set<string>());
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("TODOS");
  const canSwitchProfile =
    store?.roles?.cliente === true && store.roles.motorista === true;
  const onlyAvailableRole =
    store?.roles?.cliente && !store.roles.motorista
      ? "cliente"
      : store?.roles?.motorista && !store.roles.cliente
        ? "motorista"
        : null;
  const roleRedirectPending =
    onlyAvailableRole !== null && role !== onlyAvailableRole;
  const latest = useRef<Store | null>(null),
    saving = useRef(false),
    main = useRef<HTMLElement>(null);
  const registrationPage = useRef<HTMLDivElement>(null);
  const screenDepth = navigation.providerConversationId
    ? 2
    : selected || chatId || !primaryTabs.some((item) => item === tab)
      ? 1
      : 0;
  const screenKey = routeUrl(navigation);
  const previousScreen = useRef({ key: screenKey, tab, depth: screenDepth });
  const hasStore = store !== null;
  useLayoutEffect(() => {
    const previous = previousScreen.current;
    previousScreen.current = { key: screenKey, tab, depth: screenDepth };
    if (
      !hasStore ||
      previous.key === screenKey ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const currentIndex = primaryTabs.findIndex((item) => item === tab);
    const previousIndex = primaryTabs.findIndex(
      (item) => item === previous.tab,
    );
    const backward =
      screenDepth !== previous.depth
        ? screenDepth < previous.depth
        : screenDepth === 0 && currentIndex < previousIndex;
    const transform =
      tab === "notificacoes"
        ? "translateY(16px)"
        : `translateX(${backward ? -44 : 44}px)`;
    const surface =
      main.current?.querySelector<HTMLElement>(".conversation-screen") ??
      registrationPage.current?.querySelector<HTMLElement>(
        ".onboarding-main",
      ) ??
      main.current;
    const animation = surface?.animate(
      [
        { transform, opacity: 0.55 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 240, easing: "cubic-bezier(.2, .7, .2, 1)" },
    );
    return () => animation?.cancel();
  }, [tab, screenKey, screenDepth, hasStore]);
  const name = store?.profile?.name || "",
    profilePhoto = store?.profile?.photo || "";
  useEffect(() => {
    if (role !== "motorista" || !selected) {
      setResolvedOpportunityId(selected);
      return;
    }
    if (selectedOpportunity?.id === selected) {
      setResolvedOpportunityId(selected);
      return;
    }
    if (!hasStore) return;
    if (latest.current?.freights.some((freight) => freight.id === selected)) {
      setResolvedOpportunityId(selected);
      return;
    }

    let cached = opportunityCache.get(selected);
    if (!cached) {
      try {
        const stored = sessionStorage.getItem(opportunityStorageKey);
        const item: unknown = stored ? JSON.parse(stored) : null;
        if (isFreightFeedItem(item) && item.id === selected) cached = item;
      } catch {
        cached = undefined;
      }
    }
    if (cached) {
      setSelectedOpportunity(freightFromFeedItem(cached));
      setResolvedOpportunityId(selected);
      return;
    }
    const controller = new AbortController();
    void createBackendClient()
      .freight(selected, controller.signal)
      .then((freight) => {
        if (!controller.signal.aborted && isFreightFeedItem(freight))
          setSelectedOpportunity({
            ...freightFromFeedItem(freight),
            photos: freight.photos ?? [],
          });
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setResolvedOpportunityId(selected);
      });
    return () => controller.abort();
  }, [role, selected, selectedOpportunity?.id, hasStore]);
  useEffect(() => {
    let active = true;
    void authClient
      .getSession()
      .then(({ data }) => {
        if (active) setAuthenticated(Boolean(data));
      })
      .catch(() => {
        if (active) setAuthenticated(false);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!authenticated) return;
    let active = true;
    const load = () =>
      api
        .load()
        .then((s) => {
          if (active) {
            latest.current = s;
            setStore(s);
            setLoadError("");
          }
        })
        .catch((e) => {
          if (active) {
            if (!latest.current) setLoadError(e.message);
            else setError(e.message);
          }
        });
    void load();
    return () => {
      active = false;
    };
  }, [authenticated]);
  useEffect(() => {
    if (!authenticated) return;
    let active = true;
    let pending = false;
    const refresh = async () => {
      const current = latest.current;
      if (!current || saving.current || pending || document.hidden) return;
      pending = true;
      try {
        const snapshot = await api.load();
        if (active && !saving.current && latest.current === current) {
          const updated = {
            ...current,
            freights: snapshot.freights,
            proposals: snapshot.proposals,
            messages: snapshot.messages,
            notifications: snapshot.notifications,
          };
          latest.current = updated;
          setStore(updated);
        }
      } catch {
        // The next refresh can recover without interrupting the current screen.
      } finally {
        pending = false;
      }
    };
    window.addEventListener("focus", refresh);
    void refresh();
    const timer = window.setInterval(
      refresh,
      tab === "chat" || selected ? 5000 : 12000,
    );
    return () => {
      active = false;
      window.removeEventListener("focus", refresh);
      window.clearInterval(timer);
    };
  }, [authenticated, selected, tab]);
  useEffect(() => {
    if (!chatId || !store || document.hidden) return;
    const notifications = store.notifications || [];
    if (!notifications.some((item) => isUnreadChat(item, role, chatId))) return;
    void save(
      {
        ...store,
        notifications: notifications.map((item) =>
          isUnreadChat(item, role, chatId) ? { ...item, read: true } : item,
        ),
      },
      false,
    );
  }, [chatId, role, store]);
  useEffect(() => {
    if (role !== "motorista" || !store?.profile || acceptanceNotice) return;
    const profileId = store.profile.id;
    const notice = store.notifications?.find((item) => {
      if (
        item.read ||
        item.role !== "motorista" ||
        !item.id.startsWith("accepted:") ||
        !item.proposalId
      )
        return false;
      const key = `fretta:acceptance:${profileId}:${item.id}`;
      if (seenAcceptances.current.has(key)) return false;
      try {
        return localStorage.getItem(key) !== "seen";
      } catch {
        return true;
      }
    });
    if (notice?.proposalId === chatId && notice) {
      const key = `fretta:acceptance:${profileId}:${notice.id}`;
      seenAcceptances.current.add(key);
      try {
        localStorage.setItem(key, "seen");
      } catch {}
    } else if (notice) {
      setAcceptanceNotice(notice);
    }
  }, [role, chatId, store, acceptanceNotice]);
  useEffect(() => {
    if (onlyAvailableRole && role !== onlyAvailableRole)
      setRole(onlyAvailableRole, true);
  }, [onlyAvailableRole, role, setRole]);
  useEffect(() => {
    setModal("");
    setUpdatingDriver(false);
    setError("");
    if (authenticated && !chatId) main.current?.focus({ preventScroll: true });
  }, [role, tab, selected, chatId, providerId, authenticated]);
  async function save(
    next: Store,
    deriveNotifications = true,
  ): Promise<boolean> {
    if (saving.current) return false;
    saving.current = true;
    try {
      const enriched = deriveNotifications
        ? withNotifications(latest.current || next, next)
        : next;
      const persisted = await api.save(enriched);
      latest.current = persisted;
      setStore(persisted);
      setError("");
      return true;
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível salvar. Tente novamente.",
      );
      return false;
    } finally {
      saving.current = false;
    }
  }
  async function saveOperatingArea(area: OperatingArea): Promise<boolean> {
    if (saving.current || !latest.current) return false;
    saving.current = true;
    try {
      const savedArea = await createBackendClient().saveOperatingArea(area);
      const current = latest.current;
      if (!current) return false;
      const updated = { ...current, operatingArea: savedArea };
      latest.current = updated;
      setStore(updated);
      setError("");
      return true;
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Não foi possível salvar. Tente novamente.",
      );
      return false;
    } finally {
      saving.current = false;
    }
  }
  function nav(id: string) {
    navigation.nav(id);
    setQuery("");
    setFilter("TODOS");
  }
  const f =
    store?.freights.find((f) => f.id === selected) ||
    (role === "motorista" && selectedOpportunity?.id === selected
      ? selectedOpportunity
      : undefined);
  const proposals =
    store?.proposals.filter(
      (p) =>
        p.freightId === selected &&
        (role === "cliente" || ownProposal(p, store?.profile?.id || "")),
    ) || [];
  const accepted = proposals.find(
    (p) => p.id === f?.acceptedProposalId && p.status === "ACEITA",
  );
  const own = store?.proposals.find(
    (p) =>
      p.freightId === selected && ownProposal(p, store?.profile?.id || ""),
  );
  async function createRequest(draft: FreightRequestDraft) {
    if (!store) return false;
    try {
      const backend = createBackendClient();
      const uploads = await Promise.all(
        draft.photos.map(async (image, index) => {
          const blob = await (await fetch(image)).blob();
          return backend.upload(
            new File([blob], `foto-${index}`, { type: blob.type }),
            "freight",
          );
        }),
      );
      const created = await backend.createFreight({
        title: draft.title,
        description: draft.description,
        vehicle: draft.vehicle,
        schedule: draft.schedule,
        pickup: draft.pickup,
        delivery: draft.delivery,
        photoIds: uploads.map((upload) => upload.id),
        savePickup: draft.savePickup,
        saveDelivery: draft.saveDelivery,
      });
      const freight: Freight = {
        ...created,
        vehicle: draft.vehicle,
        reviews: {},
      };
      const next: Store = {
        ...store,
        freights: [freight, ...store.freights.filter((item) => item.id !== freight.id)],
        freightAddresses: {
          ...store.freightAddresses,
          [freight.id]: {
            pickup: structuredClone(draft.pickup),
            delivery: structuredClone(draft.delivery),
          },
        },
      };
      latest.current = next;
      setStore(next);
      setPublishedRequestId(freight.id);
      setModal("");
      setSuccess("request");
      return true;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível publicar a solicitação.",
      );
      throw error instanceof Error
        ? error
        : new Error("Não foi possível publicar a solicitação.");
    }
  }
  async function propose(offer: ProposalOffer) {
    if (
      !store ||
      !f ||
      role !== "motorista" ||
      !driverCanPropose(store) ||
      f.status !== "ABERTO"
    )
      throw new Error("Não é possível enviar uma proposta agora.");
    const existing = store.proposals.find(
      (p) => p.freightId === f.id && ownProposal(p, store.profile?.id || ""),
    );
    let next: Store;
    if (existing) next = reviseOffer(store, existing.id, offer);
    else {
      if (!f.updatedAt)
        throw new Error("Atualize a solicitação antes de enviar uma proposta.");
      const p = await createBackendClient().propose(f.id, {
        priceCents: offer.priceCents,
        vehicleId: offer.vehicleId || "",
        availableAt: offer.availableAt,
        message: offer.message,
        expectedUpdatedAt: f.updatedAt,
      });
      next = { ...store, proposals: [...store.proposals, p] };
    }
    if (!existing) {
      const enriched = withNotifications(latest.current || next, next);
      latest.current = enriched;
      setStore(enriched);
      setModal("");
      setSuccess("proposal");
      return true;
    }
    const ok = await save(next);
    if (ok) {
      setModal("");
      setSuccess("proposal");
    }
    return ok;
  }
  async function send(text: string) {
    const current = latest.current;
    if (!current) return false;
    const p = current.proposals.find((p) => p.id === chatId);
    if (
      !p ||
      !text.trim() ||
      text.length > 2000 ||
      (role === "motorista" && !ownProposal(p, current.profile?.id || ""))
    )
      return false;
    return save(
      {
        ...current,
        messages: [
          ...current.messages,
          {
            id: crypto.randomUUID(),
            freightId: p.freightId,
            proposalId: p.id,
            role,
            text: text.trim(),
            createdAt: new Date().toISOString(),
          },
        ],
      },
      false,
    );
  }
  async function completeChatFreight(freightId: string, score: number) {
    if (saving.current) return false;
    saving.current = true;
    try {
      await createBackendClient().completeFreight(freightId, score);
      const snapshot = await api.load();
      latest.current = snapshot;
      setStore(snapshot);
      return true;
    } finally {
      saving.current = false;
    }
  }
  function openNotification(n: AppNotification) {
    if (n.proposalId) setChatId(n.proposalId);
    else setSelected(n.freightId);
  }
  async function signInWithGoogle() {
    setGoogleSignInError("");
    setGoogleSignInPending(true);
    try {
      const { error: signInError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `/auth/complete?perfil=${role}`,
        additionalParams: { prompt: "select_account" },
      });
      if (signInError) {
        setGoogleSignInError(
          "Não foi possível iniciar o login Google. Confira a configuração do servidor e tente novamente.",
        );
      }
    } catch {
      setGoogleSignInError(
        "Não foi possível iniciar o login Google. Confira a configuração do servidor e tente novamente.",
      );
    } finally {
      setGoogleSignInPending(false);
    }
  }
  async function signOut() {
    try {
      const { error: signOutError } = await authClient.signOut();
      if (signOutError) {
        setError("Não foi possível encerrar a sessão. Tente novamente.");
        return;
      }
      setAuthenticated(false);
      navigation.logout();
    } catch {
      setError("Não foi possível encerrar a sessão. Tente novamente.");
    }
  }
  if (!ready || authenticated === null)
    return (
      <main className="loading" role="status">
        Preparando seu caminho…
      </main>
    );
  if (!authenticated && loginRequested)
    return (
      <LoginView
        role={role}
        onBack={() => navigation.setLoginRequested(false)}
        onGoogleSignIn={() => void signInWithGoogle()}
        googleSignInPending={googleSignInPending}
        googleSignInError={googleSignInError}
      />
    );
  if (!authenticated)
    return (
      <WelcomeView
        role={role}
        setRole={setRole}
        onEnter={() => navigation.setLoginRequested(true)}
      />
    );
  if (!store)
    return (
      <main className="loading">
        <Truck />
        <h1>
          {loadError ? "Não foi possível carregar" : "Preparando seu caminho…"}
        </h1>
        {loadError && (
          <>
            <p role="alert">{loadError}</p>
            {error && <p role="alert">{error}</p>}
            <button className="secondary" onClick={() => location.reload()}>
              Tentar novamente
            </button>
            <button className="secondary" onClick={() => void signOut()}>
              Encerrar sessão
            </button>
          </>
        )}
      </main>
    );
  if (roleRedirectPending)
    return (
      <main className="loading" role="status">
        Carregando seu perfil…
      </main>
    );
  if (role === "motorista" && tab === "cadastro-motorista") {
    return (
      <div className="registration-route" ref={registrationPage}>
        {!store.driverRegistration || updatingDriver ? (
          <DriverOnboardingView
            store={store}
            onBack={() => nav("perfil")}
            onClient={
              store.roles?.cliente ? () => setRole("cliente") : undefined
            }
            onLogout={() => void signOut()}
            onServices={() => nav("fretes")}
            onSubmit={async (draft) => {
              const ok = await save(submitDriverRegistration(store, draft));
              if (ok) {
                setUpdatingDriver(false);
                nav("cadastro-motorista");
              }
              return ok;
            }}
          />
        ) : (
          <DriverRegistrationStatusView
            store={store}
            save={save}
            onBack={() => nav("perfil")}
            onUpdate={() => setUpdatingDriver(true)}
            onHome={() => nav("inicio")}
            onProfile={() => nav("editar-perfil")}
            onVehicles={() => nav("veiculos")}
            onServices={() => nav("fretes")}
            onConversations={() => nav("chat")}
            onClient={
              store.roles?.cliente ? () => setRole("cliente") : undefined
            }
            onLogout={() => void signOut()}
          />
        )}
      </div>
    );
  }
  const list = store.freights.filter(
    (x) =>
      `${x.title} ${x.origin} ${x.destination}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === "TODOS" || x.status === filter),
  );
  const unread = unreadNotifications(store, role).length;
  const unreadChat = (store.notifications || []).some((item) =>
    isUnreadChat(item, role),
  );
  const acceptance =
    role === "motorista" && !success && !modal ? acceptanceNotice : null;
  function dismissSuccess(openChat: boolean) {
    if (acceptance && store?.profile) {
      const key = `fretta:acceptance:${store.profile.id}:${acceptance.id}`;
      seenAcceptances.current.add(key);
      try {
        localStorage.setItem(key, "seen");
      } catch {}
      setAcceptanceNotice(null);
      if (openChat && acceptance.proposalId) setChatId(acceptance.proposalId);
    }
    if (openChat && success === "request" && publishedRequestId)
      setSelected(publishedRequestId);
    setSuccess(null);
    setPublishedRequestId(null);
  }
  return (
    <div className="shell">
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      <aside>
        <button className="brand" onClick={() => nav("inicio")}>
          <Truck /> FRETTA<span>•</span>
        </button>
        <p className="sidebar-label">SEU PRÓXIMO CAMINHO</p>
        <nav aria-label="Navegação principal">
          {[
            ["inicio", "Início", Home],
            [
              "fretes",
              role === "cliente" ? "Meus fretes" : "Meus serviços",
              Package,
            ],
            ["chat", "Conversas", MessageCircle],
            ["perfil", "Meu perfil", User],
          ].map(([id, label, Icon]) => {
            const I = Icon as typeof Home;
            const active =
              tab === id ||
              (id === "perfil" &&
                [
                  "editar-perfil",
                  "enderecos",
                  "veiculos",
                  "assinatura",
                  "empresa",
                ].includes(tab));
            return (
              <button
                className={active ? "active" : ""}
                aria-current={active ? "page" : undefined}
                key={String(id)}
                onClick={() => nav(String(id))}
              >
                <I size={20} />
                <span>{String(label)}</span>
                {id === "chat" && unreadChat && (
                  <span className="nav-chat-unread" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </nav>
        <div className="aside-bottom">
          {profilePhoto ? (
            <img
              className="avatar"
              src={profilePhoto}
              alt={`Foto de ${name}`}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span className="avatar">{name.slice(0, 2).toUpperCase()}</span>
          )}
          <b>{name}</b>
          <small>
            {role === "cliente" ? "Perfil de cliente" : "Perfil de motorista"}
          </small>
          {canSwitchProfile && (
            <button
              onClick={() =>
                setRole(role === "cliente" ? "motorista" : "cliente")
              }
            >
              Alternar perfil
            </button>
          )}
        </div>
      </aside>
      <div className="content">
        <header>
          {role === "cliente" ? (
            <span className="header-brand">FRETTA</span>
          ) : (
            <button
              className="header-location"
              onClick={() => nav("inicio")}
              aria-label="Configurar área de operação"
            >
              <MapPin size={16} />
              {store.operatingArea?.label || "Definir área de operação"}
            </button>
          )}
          <div>
            <button
              className="notification-bell"
              aria-label={`Notificações${unread ? `, ${unread} ${unread === 1 ? "não lida" : "não lidas"}` : ""}`}
              onClick={() => nav("notificacoes")}
            >
              <Bell size={20} />
              {unread > 0 && (
                <span className="notification-count" aria-hidden="true">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>
          </div>
        </header>
        <main ref={main} id="main-content" tabIndex={-1}>
          {role === "motorista" && !driverCanPropose(store) && (
            <section
              className="driver-registration-banner"
              aria-label="Pendência de cadastro"
            >
              <div>
                <b>Seu cadastro de motorista precisa de atenção</b>
                <p>
                  Conclua o cadastro e acompanhe a análise para enviar novas
                  propostas. Seus serviços e conversas continuam disponíveis.
                </p>
              </div>
              <button
                className="secondary"
                onClick={() => nav("cadastro-motorista")}
              >
                Ver cadastro
              </button>
            </section>
          )}
          {error && (
            <div className="alert" role="alert">
              {error}
              <button onClick={() => setError("")} aria-label="Fechar erro">
                <X size={16} />
              </button>
            </div>
          )}
          {notice && (
            <div className="notice" role="status">
              {notice}
              <button onClick={() => setNotice("")} aria-label="Fechar aviso">
                <X size={16} />
              </button>
            </div>
          )}
          {providerId ? (
            <ProviderProfileView
              key={providerId}
              provider={publicProvider(store, providerId)}
              preview={role === "motorista" && providerId === store.profile?.id}
              onBack={() => navigation.back("fretes")}
              onConversation={
                role === "cliente" &&
                store.proposals.some(
                  (p) => proposalProviderId(p) === providerId,
                )
                  ? () =>
                      setChatId(
                        (store.proposals.find(
                          (p) =>
                            p.id === navigation.providerConversationId &&
                            proposalProviderId(p) === providerId,
                        ) ||
                          store.proposals.find(
                            (p) => proposalProviderId(p) === providerId,
                          ))!.id,
                      )
                  : undefined
              }
            />
          ) : selected &&
            !f &&
            role === "motorista" &&
            resolvedOpportunityId !== selected ? (
            <p className="muted" role="status">
              Carregando oportunidade…
            </p>
          ) : selected && !f ? (
            <EmptyState title="Solicitação não encontrada">
              Ela não está mais disponível.
              <button className="primary" onClick={() => nav("fretes")}>
                Ver meus fretes
              </button>
            </EmptyState>
          ) : f ? (
            <FreightDetailsView
              key={`${f.id}:${role}`}
              f={f}
              role={role}
              name={name}
              store={store}
              proposals={proposals}
              accepted={accepted}
              canPropose={driverCanPropose(store)}
              onRegistration={() => nav("cadastro-motorista")}
              setModal={setModal}
              setSelected={(id) => {
                if (!id) setSelectedOpportunity(null);
                setSelected(id);
              }}
              onChat={setChatId}
              onProvider={navigation.openProvider}
              save={save}
              schedule={(f) => scheduleLabel(f.schedule)}
            />
          ) : tab === "enderecos" ? (
            <AddressBookView
              addresses={store.addresses || []}
              onSave={(addresses) => save({ ...store, addresses })}
              onBack={() => nav("perfil")}
            />
          ) : tab === "empresa" &&
            role === "motorista" &&
            store.driverRegistration?.personType === "pj" ? (
            <CompanyProfileView
              store={store}
              save={save}
              onBack={() => nav("perfil")}
              onPreview={() => navigation.openProvider(store.profile?.id || "")}
            />
          ) : tab === "veiculos" && role === "motorista" ? (
            <VehicleBookView
              vehicles={store.vehicles || []}
              onSave={(vehicles) => save({ ...store, vehicles })}
              onBack={() => nav("perfil")}
            />
          ) : tab === "assinatura" && role === "motorista" ? (
            <SubscriptionView
              onBack={() => nav("perfil")}
            />
          ) : [
              "perfil",
              "editar-perfil",
              "veiculos",
              "assinatura",
              "empresa",
            ].includes(tab) ? (
            <>
              <ProfileView
                key={tab}
                name={name}
                photo={profilePhoto}
                photoRequired={!!store.driverRegistration}
                registration={store.driverRegistration}
                onRegistration={() => nav("cadastro-motorista")}
                editing={tab === "editar-perfil"}
                onEdit={() =>
                  nav(tab === "editar-perfil" ? "perfil" : "editar-perfil")
                }
                onSaveProfile={async (profile) => {
                  if (store.driverRegistration && !profile.photo)
                    throw new Error(
                      "A foto é obrigatória para o cadastro do motorista.",
                    );
                  const photoChanged =
                    !!store.driverRegistration &&
                    profile.photo !== profilePhoto;
                  const ok = await save({
                    ...store,
                    profile: {
                      ...store.profile,
                      ...profile,
                      id: store.profile?.id || "",
                    },
                    ...(photoChanged
                      ? {
                          driverRegistration: {
                            ...store.driverRegistration!,
                            status: "EM_ANALISE",
                            submittedAt: new Date().toISOString(),
                            reviewedAt: undefined,
                            feedback: undefined,
                          },
                        }
                      : {}),
                  });
                  if (ok)
                    setNotice(
                      photoChanged
                        ? "Foto atualizada. Seu cadastro foi enviado para revisão."
                        : "Perfil atualizado.",
                    );
                  return ok;
                }}
                onAddresses={() => nav("enderecos")}
                onVehicles={() => nav("veiculos")}
                onPublicProfile={() => navigation.openProvider(store.profile?.id || "")}
                onCompany={() => nav("empresa")}
                onSubscription={() => nav("assinatura")}
                role={role}
                setEntered={() => {
                  void signOut();
                  setModal("");
                }}
              />
              {canSwitchProfile && (
                <button
                  className="secondary mobile-switch-profile"
                  onClick={() =>
                    setRole(role === "cliente" ? "motorista" : "cliente")
                  }
                >
                  Alternar para perfil de{" "}
                  {role === "cliente" ? "motorista" : "cliente"}
                </button>
              )}
            </>
          ) : tab === "notificacoes" ? (
            <NotificationsView
              store={store}
              role={role}
              save={save}
              onOpen={openNotification}
              onBack={() => navigation.back("inicio")}
            />
          ) : tab === "chat" ? (
            <ChatView
              key={`${role}:${chatId}`}
              name={name}
              store={store}
              role={role}
              chatId={chatId}
              setChatId={setChatId}
              send={send}
              save={save}
              onManageVehicles={() => nav("veiculos")}
              onProvider={navigation.openProvider}
              onFreight={setSelected}
              onComplete={completeChatFreight}
            />
          ) : role === "motorista" && tab === "inicio" ? (
            <DriverHomeView
              store={store}
              name={name}
              saveOperatingArea={saveOperatingArea}
              onSelect={(freight) => {
                opportunityCache.clear();
                opportunityCache.set(freight.id, freight);
                try {
                  sessionStorage.setItem(
                    opportunityStorageKey,
                    JSON.stringify(freight),
                  );
                } catch {
                  // The in-memory cache still covers client-side navigation.
                }
                setSelectedOpportunity(freightFromFeedItem(freight));
                setSelected(freight.id);
              }}
              schedule={(f) => scheduleLabel(f.schedule)}
            />
          ) : role === "motorista" && tab === "fretes" ? (
            <DriverServicesView
              store={store}
              name={name}
              onSelect={setSelected}
              onExplore={() => nav("inicio")}
              schedule={(f) => scheduleLabel(f.schedule)}
            />
          ) : (
            <FreightListView
              store={store}
              role={role}
              name={name}
              tab={tab}
              list={list}
              filter={filter}
              query={query}
              setModal={setModal}
              nav={nav}
              setQuery={setQuery}
              setFilter={setFilter}
              setSelected={(id) => {
                if (!id) setSelectedOpportunity(null);
                setSelected(id);
              }}
              schedule={(f) => scheduleLabel(f.schedule)}
            />
          )}
          <InstallApp showControls={tab === "perfil" && !selected} />
        </main>
        <footer>
          FRETTA © 2026 · Conectando pessoas, movimentando histórias.
        </footer>
      </div>
      {modal === "pedido" && (
        <RequestWizard
          addresses={store.addresses || []}
          onClose={() => setModal("")}
          onSubmit={createRequest}
        />
      )}
      {modal === "proposta" && (
        <ProposalFormDialog
          proposal={own}
          vehicles={store.vehicles || []}
          onManageVehicles={() => {
            setModal("");
            nav("veiculos");
          }}
          onClose={() => setModal("")}
          onSubmit={propose}
        />
      )}
      <SuccessDialog
        open={success !== null || acceptance !== null}
        title={
          acceptance
            ? "Sua proposta foi aceita!"
            : success === "request"
              ? "Solicitação publicada!"
              : "Proposta enviada!"
        }
        description={
          acceptance
            ? `${store.freights.find((freight) => freight.id === acceptance.freightId)?.clientName || "O cliente"} aceitou sua proposta. Confira o acordo na conversa.`
            : success === "request"
            ? "Sua solicitação foi publicada. Abra os detalhes para acompanhar as propostas recebidas."
            : "Acompanhe a resposta em Meus serviços ou continue a conversa pelo chat."
        }
        actionLabel={
          acceptance
            ? "Ir para o chat"
            : success === "request"
              ? "Ver solicitação"
              : "Entendi"
        }
        onClose={() => dismissSuccess(false)}
        onAction={() => dismissSuccess(true)}
      />
    </div>
  );
}
