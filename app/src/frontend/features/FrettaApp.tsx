"use client";
import { useEffect, useRef, useState } from "react";
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
  Proposal,
  ProposalOffer,
  Store,
} from "@/contracts";
import { api, resetDemo } from "../api/client";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { SuccessDialog } from "../components/SuccessDialog";
import { ProposalFormDialog } from "../components/ProposalFormDialog";
import { EmptyState } from "../components/EmptyState";
import { RequestWizard } from "./RequestWizard";
import { AddressBookView } from "./addresses/AddressBookView";
import { createRequest as buildRequest } from "./addresses/createRequest";
import { DriverHomeView } from "./driver/DriverHomeView";
import { DriverServicesView } from "./driver/DriverServicesView";
import { defaultArea, ownProposal } from "./driver/rules";
import { LoginView } from "./LoginView";
import { WelcomeView } from "./WelcomeView";
import { ProfileView } from "./ProfileView";
import { ChatView } from "./ChatView";
import { FreightDetailsView } from "./FreightDetailsView";
import { FreightListView } from "./FreightListView";
import { VehicleBookView } from "./vehicles/VehicleBookView";
import { NotificationsView } from "./notifications/NotificationsView";
import { withNotifications, unreadNotifications } from "./notifications/rules";
import { SubscriptionView } from "./subscription/SubscriptionView";
import { useDemoNavigation } from "./navigation/useDemoNavigation";
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

export function FrettaApp() {
  const navigation = useDemoNavigation();
  const {
    role,
    tab,
    selected,
    chatId,
    providerId,
    entered,
    ready,
    loginRequested,
    setRole,
    setSelected,
    setChatId,
  } = navigation;
  const [store, setStore] = useState<Store | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [loadError, setLoadError] = useState("");
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [updatingDriver, setUpdatingDriver] = useState(false);
  const [modal, setModal] = useState(""),
    [success, setSuccess] = useState<"proposal" | "request" | null>(null);
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("TODOS");
  const latest = useRef<Store | null>(null),
    saving = useRef(false),
    main = useRef<HTMLElement>(null);
  const name = store?.profile?.name || "Cleiton",
    profilePhoto = store?.profile?.photo || "",
    subscription = store?.subscriptionActive ?? true;
  useEffect(() => {
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
    const sync = (e: StorageEvent) => {
      if (e.key === "fretta-demo-v1" && !saving.current) void load();
    };
    window.addEventListener("storage", sync);
    return () => {
      active = false;
      window.removeEventListener("storage", sync);
    };
  }, []);
  useEffect(() => {
    setModal("");
    setUpdatingDriver(false);
    setError("");
    if (entered && !chatId) main.current?.focus({ preventScroll: true });
  }, [role, tab, selected, chatId, providerId, entered]);
  async function save(next: Store): Promise<boolean> {
    if (saving.current) return false;
    saving.current = true;
    try {
      const enriched = withNotifications(latest.current || next, next);
      await api.save(enriched);
      latest.current = enriched;
      setStore(enriched);
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
  function nav(id: string) {
    navigation.nav(id);
    setQuery("");
    setFilter("TODOS");
  }
  const f = store?.freights.find((f) => f.id === selected);
  const proposals =
    store?.proposals.filter(
      (p) =>
        p.freightId === selected &&
        (role === "cliente" || ownProposal(p, name)),
    ) || [];
  const accepted = proposals.find(
    (p) => p.id === f?.acceptedProposalId && p.status === "ACEITA",
  );
  const own = store?.proposals.find(
    (p) => p.freightId === selected && ownProposal(p, name),
  );
  async function createRequest(draft: FreightRequestDraft) {
    if (!store) return false;
    const next = buildRequest(store, draft);
    if (!(await save(next))) return false;
    setSelected(next.freights[0].id);
    setModal("");
    setSuccess("request");
    return true;
  }
  async function propose(offer: ProposalOffer) {
    if (
      !store ||
      !f ||
      role !== "motorista" ||
      !subscription ||
      !driverCanPropose(store) ||
      f.status !== "ABERTO"
    )
      throw new Error("Não é possível enviar uma proposta agora.");
    const existing = store.proposals.find(
      (p) => p.freightId === f.id && ownProposal(p, name),
    );
    let next: Store;
    if (existing) next = reviseOffer(store, existing.id, offer);
    else {
      const p: Proposal = {
        ...offer,
        id: crypto.randomUUID(),
        freightId: f.id,
        driver: name,
        driverId: "demo-driver",
        rating: publicProvider(store, "demo-driver")?.rating || 0,
        providerName: publicProvider(store, "demo-driver")?.name || name,
        providerKind: publicProvider(store, "demo-driver")?.kind || "autonomo",
        providerLogo:
          store.driverRegistration?.personType === "pj"
            ? store.companyProfile?.logo
            : undefined,
        status: "PENDENTE",
        offers: [offer],
      };
      next = { ...store, proposals: [...store.proposals, p] };
    }
    const ok = await save(next);
    if (ok) {
      setModal("");
      setSuccess("proposal");
    }
    return ok;
  }
  async function send(text: string) {
    if (!store) return false;
    const p = store.proposals.find((p) => p.id === chatId);
    if (
      !p ||
      !text.trim() ||
      text.length > 2000 ||
      (role === "motorista" && !ownProposal(p, name))
    )
      return false;
    return save({
      ...store,
      messages: [
        ...store.messages,
        {
          id: crypto.randomUUID(),
          freightId: p.freightId,
          proposalId: p.id,
          role,
          text: text.trim(),
          createdAt: new Date().toISOString(),
        },
      ],
    });
  }
  function openNotification(n: AppNotification) {
    if (n.proposalId) setChatId(n.proposalId);
    else setSelected(n.freightId);
  }
  if (!ready)
    return (
      <main className="loading" role="status">
        Preparando seu caminho…
      </main>
    );
  if (!entered && loginRequested)
    return (
      <LoginView
        role={role}
        onBack={() => navigation.setLoginRequested(false)}
        onContinue={() => {
          navigation.login();
          if (role === "motorista" && !store?.driverRegistration)
            navigation.nav("cadastro-motorista");
        }}
      />
    );
  if (!entered)
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
            <button className="secondary" onClick={() => location.reload()}>
              Tentar novamente
            </button>
            <button className="danger" onClick={() => setRestoreOpen(true)}>
              Restaurar demonstração
            </button>
            <button className="secondary" onClick={() => navigation.logout()}>
              Voltar ao início
            </button>
          </>
        )}
        <ConfirmDialog
          open={restoreOpen}
          onClose={() => setRestoreOpen(false)}
          title="Restaurar demonstração?"
          description="Os dados locais deste navegador serão apagados e substituídos pelos exemplos iniciais."
          confirmLabel="Restaurar demonstração"
          cancelLabel="Manter meus dados"
          onConfirm={async () => {
            resetDemo();
            return true;
          }}
        />
      </main>
    );
  if (
    role === "motorista" &&
    (tab === "cadastro-motorista" ||
      (!driverCanPropose(store) && tab === "inicio"))
  ) {
    if (!store.driverRegistration || updatingDriver)
      return (
        <DriverOnboardingView
          store={store}
          onClient={() => setRole("cliente")}
          onLogout={navigation.logout}
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
      );
    return (
      <DriverRegistrationStatusView
        store={store}
        save={save}
        onUpdate={() => setUpdatingDriver(true)}
        onHome={() => nav("inicio")}
        onProfile={() => nav("editar-perfil")}
        onVehicles={() => nav("veiculos")}
        onServices={() => nav("fretes")}
        onConversations={() => nav("chat")}
        onClient={() => setRole("cliente")}
        onLogout={navigation.logout}
      />
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
          <button
            onClick={() =>
              setRole(role === "cliente" ? "motorista" : "cliente")
            }
          >
            Alternar perfil
          </button>
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
              {(store.operatingArea || defaultArea).label}
            </button>
          )}
          <div>
            <span className="demo">DEMONSTRAÇÃO</span>
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
              preview={role === "motorista" && providerId === "demo-driver"}
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
          ) : selected && !f ? (
            <EmptyState title="Solicitação não encontrada">
              Ela pode ter sido removida da demonstração.
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
              subscription={subscription}
              canPropose={driverCanPropose(store)}
              onRegistration={() => nav("cadastro-motorista")}
              setModal={setModal}
              setSelected={setSelected}
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
              onPreview={() => navigation.openProvider("demo-driver")}
            />
          ) : tab === "veiculos" && role === "motorista" ? (
            <VehicleBookView
              vehicles={store.vehicles || []}
              onSave={(vehicles) => save({ ...store, vehicles })}
              onBack={() => nav("perfil")}
            />
          ) : tab === "assinatura" && role === "motorista" ? (
            <SubscriptionView
              active={subscription}
              onChange={(subscriptionActive) =>
                save({ ...store, subscriptionActive })
              }
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
                    profile,
                    ...(photoChanged
                      ? {
                          driverRegistration: {
                            ...store.driverRegistration!,
                            status: "EM_ANALISE",
                            reviewedAt: undefined,
                            feedback: undefined,
                          },
                        }
                      : {}),
                  });
                  if (ok)
                    setNotice(
                      photoChanged
                        ? "Foto atualizada. Seu cadastro voltou para análise de demonstração."
                        : "Perfil atualizado.",
                    );
                  return ok;
                }}
                onAddresses={() => nav("enderecos")}
                onVehicles={() => nav("veiculos")}
                onPublicProfile={() => navigation.openProvider("demo-driver")}
                onCompany={() => nav("empresa")}
                onSubscription={() => nav("assinatura")}
                role={role}
                subscription={subscription}
                setEntered={() => {
                  navigation.logout();
                  setModal("");
                }}
              />
              <button
                className="secondary mobile-switch-profile"
                onClick={() =>
                  setRole(role === "cliente" ? "motorista" : "cliente")
                }
              >
                Alternar para perfil de{" "}
                {role === "cliente" ? "motorista" : "cliente"}
              </button>
            </>
          ) : tab === "notificacoes" ? (
            <NotificationsView
              store={store}
              role={role}
              save={save}
              onOpen={openNotification}
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
              subscription={subscription}
              onManageVehicles={() => nav("veiculos")}
              onProvider={navigation.openProvider}
              onFreight={setSelected}
            />
          ) : role === "motorista" && tab === "inicio" ? (
            <DriverHomeView
              store={store}
              name={name}
              subscription={subscription}
              save={save}
              onSelect={setSelected}
              onProfile={() => nav("assinatura")}
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
              setSelected={setSelected}
              subscription={subscription}
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
        open={success !== null}
        title={
          success === "request" ? "Solicitação publicada!" : "Proposta enviada!"
        }
        description={
          success === "request"
            ? "Agora você pode acompanhar as propostas recebidas."
            : "Acompanhe a resposta em Meus serviços ou continue a conversa pelo chat."
        }
        onClose={() => setSuccess(null)}
      />
    </div>
  );
}
