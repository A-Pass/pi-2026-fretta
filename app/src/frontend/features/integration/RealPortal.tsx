"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  LogOut,
  MapPin,
  Pencil,
  Bell,
  Home,
  MessageCircle,
  Package,
  Truck,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SavedAddress, Store, Vehicle, Role } from "@/contracts";
import { authClient } from "../../api/auth-client";
import {
  createIdentityClient,
  type IdentityViewer,
  type RegistrationSummary,
} from "../../api/identity";
import { ApiRequestError, createHttpTransport } from "../../api/http";
import { WelcomeView } from "../WelcomeView";
import { SuccessDialog } from "../../components/SuccessDialog";
import { AddressBookView } from "../addresses/AddressBookView";
import { LoginView } from "../LoginView";
import { VehicleBookView } from "../vehicles/VehicleBookView";
import { DriverOnboardingView } from "../onboarding/DriverOnboardingView";
import { parseRoute } from "../navigation/routes";
import { clearRequestDrafts } from "../requests/drafts";
import { RealConversations } from "./RealConversations";
import { RealNotifications } from "./RealNotifications";
import { DriverCorrectionForm } from "./DriverCorrectionForm";
import { DemoPixView } from "./DemoPixView";
import { DriverScheduledPickups } from "./DriverScheduledPickups";
import { DriverPublicId } from "./DriverPublicId";
import { RealCompanyWorkspace } from "./RealCompanyWorkspace";
import { RealFreights } from "./RealFreights";

type AcceptedProposalNotice = {
  id: string;
  conversationId: string;
  customerName: string;
  freightTitle: string;
};

const client = createIdentityClient();
const http = createHttpTransport();
export function RealPortal() {
  const router = useRouter(),
    pathname = usePathname(),
    route = parseRoute(pathname);
  const { data: session, isPending } = authClient.useSession();
  const [viewer, setViewer] = useState<IdentityViewer | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [admin, setAdmin] = useState(false),
    [vehicles, setVehicles] = useState<Vehicle[]>([]),
    [registration, setRegistration] = useState<RegistrationSummary | null>(
      null,
    ),
    [name, setName] = useState(""),
    [editingRegistration, setEditingRegistration] = useState(false);
  const [registrationOwner, setRegistrationOwner] = useState<string | null>(
    null,
  );
  const [approvalNotice, setApprovalNotice] = useState<string | null>(null);
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[] | null>(null);
  const [unreadOwner, setUnreadOwner] = useState<string | null>(null);
  const [unreadMessagesKey, setUnreadMessagesKey] = useState<string | null>(
    null,
  );
  const [notificationRevision, setNotificationRevision] = useState(0);
  const [acceptedNotice, setAcceptedNotice] = useState<
    (AcceptedProposalNotice & { owner: string }) | null
  >(null);
  const dismissedAcceptance = useRef(new Set<string>());
  const sessionUserId = session?.user.id;
  const messageKey = sessionUserId ? `${sessionUserId}:${route.role}` : null;
  const refreshNotificationSummary = useCallback(
    () => setNotificationRevision((revision) => revision + 1),
    [],
  );
  useEffect(() => {
    if (!sessionUserId) {
      setUnreadOwner(null);
      setUnreadMessagesKey(null);
      setAcceptedNotice(null);
      return;
    }
    const controller = new AbortController();
    const refresh = () =>
      void http
        .request<{
          unread: boolean;
          unreadMessages: boolean;
          accepted: AcceptedProposalNotice[];
        }>(`/notifications?summary=true&role=${route.role}`, {
          signal: controller.signal,
        })
        .then((result) => {
          if (!controller.signal.aborted) {
            setUnreadOwner(result.unread ? sessionUserId : null);
            setUnreadMessagesKey(result.unreadMessages ? messageKey : null);
            if (route.role === "motorista") {
              const pending = result.accepted?.find(({ id }) => {
                const key = `fretta:acceptance:${sessionUserId}:${id}`;
                if (dismissedAcceptance.current.has(key)) return false;
                try {
                  return localStorage.getItem(key) !== "seen";
                } catch {
                  return true;
                }
              });
              if (pending)
                setAcceptedNotice((current) =>
                  current?.owner === sessionUserId
                    ? current
                    : { ...pending, owner: sessionUserId },
                );
            }
          }
        })
        .catch(() => {});
    refresh();
    window.addEventListener("focus", refresh);
    const timer = window.setInterval(refresh, 12000);
    return () => {
      controller.abort();
      window.removeEventListener("focus", refresh);
      window.clearInterval(timer);
    };
  }, [sessionUserId, notificationRevision, pathname, route.role, messageKey]);
  function dismissAcceptance() {
    if (!acceptedNotice) return;
    const key = `fretta:acceptance:${acceptedNotice.owner}:${acceptedNotice.id}`;
    dismissedAcceptance.current.add(key);
    try {
      localStorage.setItem(key, "seen");
    } catch {}
    setAcceptedNotice(null);
    refreshNotificationSummary();
  }
  const hasUnread = !!sessionUserId && unreadOwner === sessionUserId;
  const [companySelected, setCompanySelected] = useState(false);
  const [welcomeRole, setWelcomeRole] = useState<Role>("cliente");
  const role = route.role,
    tab = route.tab;
  const hasSelectedRole =
    role === "empresa" ? !!viewer?.managesCompany : !!viewer?.roles[role];
  const driverHome =
    role === "motorista" &&
    tab === "inicio" &&
    !!viewer?.roles.motorista &&
    viewer.id === session?.user.id;
  const approvalKey =
    driverHome &&
    registrationOwner === viewer?.id &&
    registration?.status === "APROVADO"
      ? `fretta:driver-approved:${viewer.id}:${registration.analisadoEm ?? "approved"}`
      : null;
  useEffect(() => {
    if (!approvalKey) return;
    try {
      if (localStorage.getItem(approvalKey)) return;
      localStorage.setItem(approvalKey, "1");
    } catch {
      // Avoid repeating the notice on every visit if browser storage is unavailable.
      return;
    }
    setApprovalNotice(approvalKey);
  }, [approvalKey]);
  const needsCorrection = registration?.status === "AJUSTES_SOLICITADOS";
  const statusLabels: Record<string, string> = {
    NAO_ENVIADO: "Cadastro não enviado",
    EM_ANALISE: "Em análise",
    AJUSTES_SOLICITADOS: "Ajustes solicitados",
    APROVADO: "Aprovado",
  };
  useEffect(() => {
    if (!driverHome) return;
    let active = true;
    async function refresh() {
      try {
        const status = await client.registration();
        if (active) {
          setRegistrationOwner(viewer?.id ?? null);
          setRegistration(status);
        }
      } catch {}
    }
    void refresh();
    window.addEventListener("focus", refresh);
    const timer = window.setInterval(refresh, 30000);
    return () => {
      active = false;
      window.removeEventListener("focus", refresh);
      window.clearInterval(timer);
    };
  }, [driverHome, viewer?.id]);
  async function reload(showPageLoading = true) {
    if (showPageLoading) setLoading(true);
    setError("");
    try {
      const me = await client.me();
      if (role === "cliente" && !me.roles.cliente) {
        await client.activate("cliente");
        me.roles.cliente = true;
      }
      setViewer(me);
      setName(me.name);
      if (me.roles.motorista) {
        const [list, status] = await Promise.all([
          client.vehicles(),
          client.registration(),
        ]);
        setVehicles(list);
        setRegistrationOwner(me.id);
        setRegistration(status);
      }
      try {
        await createHttpTransport().request("/admin/me");
        setAdmin(true);
      } catch (e) {
        if (!(e instanceof ApiRequestError) || e.status !== 403) throw e;
        setAdmin(false);
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível carregar sua conta.",
      );
    } finally {
      if (showPageLoading) setLoading(false);
    }
  }
  useEffect(() => {
    if (session) void reload();
    else {
      setApprovalNotice(null);
      setRegistrationOwner(null);
      setRegistration(null);
      setViewer(null);
      setAdmin(false);
    }
  }, [session?.user.id, role]);
  useEffect(() => setEditingRegistration(false), [pathname]);
  useEffect(() => {
    if (
      tab !== "enderecos" ||
      !viewer?.roles.cliente ||
      viewer.id !== session?.user.id
    )
      return;
    const controller = new AbortController();
    setAddresses(null);
    void http
      .request<SavedAddress[]>("/freights/addresses", {
        signal: controller.signal,
      })
      .then((list) => {
        if (!controller.signal.aborted) setAddresses(list);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      });
    return () => controller.abort();
  }, [tab, viewer?.id, viewer?.roles.cliente, session?.user.id]);

  async function saveAddresses(next: SavedAddress[]) {
    if (!addresses) return false;
    const removed = addresses.find(
      (previous) => !next.some((a) => a.id === previous.id),
    );
    const changed = next.find((a) => {
      const previous = addresses.find((item) => item.id === a.id);
      return !previous || JSON.stringify(previous) !== JSON.stringify(a);
    });
    if (removed)
      await http.request("/freights/addresses/remove", {
        method: "POST",
        body: { id: removed.id },
      });
    else if (changed)
      await http.request("/freights/addresses/save", {
        method: "POST",
        body: {
          id: addresses.some((a) => a.id === changed.id)
            ? changed.id
            : undefined,
          address: changed,
        },
      });
    setAddresses(await http.request<SavedAddress[]>("/freights/addresses"));
    return true;
  }

  async function signOut() {
    setBusy(true);
    try {
      const result = await authClient.signOut();
      if (result.error)
        throw Error(result.error.message || "Não foi possível sair.");
      try {
        clearRequestDrafts(sessionStorage);
        sessionStorage.removeItem("fretta-demo-session");
      } catch {}
      setViewer(null);
      router.replace("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível sair.");
    } finally {
      setBusy(false);
    }
  }
  if (isPending)
    return (
      <main className="loading" role="status">
        Conferindo sua sessão…
      </main>
    );
  if (!session && pathname === "/")
    return (
      <WelcomeView
        real
        role={welcomeRole}
        setRole={(next) => {
          setCompanySelected(false);
          setWelcomeRole(next);
        }}
        companySelected={companySelected}
        onSelectCompany={() => setCompanySelected(true)}
        onEnter={() => {
          setError("");
          router.push(companySelected ? "/empresa" : `/${welcomeRole}/inicio`);
        }}
      />
    );
  if (!session)
    return (
      <LoginView
        role={role}
        onBack={() => {
          setWelcomeRole(role);
          setError("");
          router.push("/");
        }}
        onGoogleSignIn={async () => {
          setBusy(true);
          setError("");
          try {
            const result = await authClient.signIn.social({
              provider: "google",
              callbackURL: `${location.origin}/${role}/inicio`,
            });
            if (result.error)
              throw Error(
                result.error.message || "Não foi possível entrar com Google.",
              );
          } catch (e) {
            setError(
              e instanceof Error ? e.message : "Não foi possível entrar.",
            );
            setBusy(false);
          }
        }}
        googleSignInPending={busy}
        googleSignInError={error}
      />
    );
  if (viewer && viewer.id !== session.user.id)
    return <main role="status">Carregando sua conta…</main>;
  const nav = (tab: string) => router.push(`/${role}/${tab}`);
  if (
    editingRegistration &&
    viewer?.roles.motorista &&
    registration?.status === "AJUSTES_SOLICITADOS"
  ) {
    return (
      <main className="admin-main">
        <DriverCorrectionForm
          registration={registration}
          vehicles={vehicles}
          onBack={() => setEditingRegistration(false)}
          onVehicles={() => nav("veiculos")}
          onSaved={async () => {
            setEditingRegistration(false);
            await reload();
            nav("cadastro-motorista");
          }}
        />
      </main>
    );
  }
  if (editingRegistration && viewer?.roles.motorista) {
    const store: Store = {
      profile: { id: viewer.id, name: viewer.name, photo: viewer.image || "" },
      vehicles,
      freights: [],
      proposals: [],
      messages: [],
    };
    return (
      <DriverOnboardingView
        store={store}
        onClient={() => {
          setEditingRegistration(false);
          nav("perfil");
        }}
        onServices={() => setEditingRegistration(false)}
        onLogout={() => void signOut()}
        onSubmit={async (draft) => {
          let vehicleId = draft.vehicleId;
          if (!vehicleId)
            vehicleId = (await client.createVehicle(draft.vehicle)).id;
          const photo = await client.upload(draft.profilePhoto!, "FOTO_PERFIL");
          const license = await client.upload(draft.licensePhoto!, "CNH");
          await client.submit(draft, vehicleId, photo.id, license.id);
          setEditingRegistration(false);
          await reload();
          nav("cadastro-motorista");
          return true;
        }}
      />
    );
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
            { id: "inicio", label: "Início", Icon: Home },
            {
              id: "fretes",
              label: role === "cliente" ? "Meus fretes" : "Meus serviços",
              Icon: Package,
            },
            { id: "chat", label: "Conversas", Icon: MessageCircle },
            { id: "perfil", label: "Meu perfil", Icon: User },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              className={
                tab === id ||
                (id === "perfil" &&
                  [
                    "editar-perfil",
                    "enderecos",
                    "veiculos",
                    "cadastro-motorista",
                  ].includes(tab))
                  ? "active"
                  : ""
              }
              aria-label={
                id === "chat" && messageKey && unreadMessagesKey === messageKey
                  ? "Conversas, novas mensagens"
                  : undefined
              }
              aria-current={tab === id ? "page" : undefined}
              onClick={() => nav(id)}
            >
              {id === "chat" ? (
                <span className="chat-nav-icon">
                  <Icon size={20} />
                  {messageKey && unreadMessagesKey === messageKey && (
                    <span
                      className="notification-unread-dot"
                      aria-hidden="true"
                    />
                  )}
                </span>
              ) : (
                <Icon size={20} />
              )}
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="aside-bottom">
          {viewer?.image ? (
            <img className="avatar" src={viewer.image} alt="" />
          ) : (
            <span className="avatar">
              {session.user.name.slice(0, 2).toUpperCase()}
            </span>
          )}
          <b>{viewer?.name || session.user.name}</b>
          <small>
            {role === "cliente" ? "Perfil de cliente" : "Perfil de motorista"}
          </small>
          <button
            onClick={() =>
              router.push(
                role === "cliente" ? "/motorista/inicio" : "/cliente/inicio",
              )
            }
          >
            Alternar perfil
          </button>
        </div>
      </aside>
      <div className="content">
        <header>
          <span className="header-brand">FRETTA</span>
          <button
            className="notification-bell"
            aria-label={hasUnread ? "Notificações não lidas" : "Notificações"}
            onClick={() => nav("notificacoes")}
          >
            <Bell size={20} />
            {hasUnread && (
              <span className="notification-unread-dot" aria-hidden="true" />
            )}
          </button>
        </header>
        <main id="main-content" tabIndex={-1}>
          {error && (
            <p className="alert" role="alert">
              {error}
            </p>
          )}
          {loading && <p role="status">Carregando seus dados…</p>}
          {role === "cliente" &&
            !viewer?.roles.cliente &&
            !loading &&
            error && (
              <button className="secondary" onClick={() => void reload()}>
                Tentar novamente
              </button>
            )}
          <SuccessDialog
            open={approvalKey !== null && approvalNotice === approvalKey}
            title="Cadastro aprovado!"
            description="Seu cadastro de motorista foi aprovado. Você pode consultar a situação em Meu perfil."
            onClose={() => setApprovalNotice(null)}
          />
          <SuccessDialog
            open={
              role === "motorista" &&
              !!sessionUserId &&
              acceptedNotice?.owner === sessionUserId &&
              !(approvalKey !== null && approvalNotice === approvalKey)
            }
            title={`${acceptedNotice?.customerName ?? "O cliente"} aceitou sua proposta!`}
            description={
              acceptedNotice?.freightTitle
                ? `Frete: ${acceptedNotice.freightTitle}`
                : ""
            }
            actionLabel="Ir para o chat"
            onClose={dismissAcceptance}
            onAction={() => {
              if (!acceptedNotice) return;
              const conversation = acceptedNotice.conversationId;
              dismissAcceptance();
              router.push(
                `/motorista/chat/${encodeURIComponent(conversation)}`,
              );
            }}
          />
          {driverHome && viewer?.roles.motorista && (
            <DriverScheduledPickups key={viewer.id} />
          )}
          {driverHome &&
            registration &&
            registrationOwner === viewer?.id &&
            registration.status !== "APROVADO" && (
              <section
                className="driver-registration-banner"
                aria-label="Situação do cadastro"
              >
                <div>
                  <b>Cadastro do motorista</b>
                  <p>
                    <strong
                      className={
                        needsCorrection || registration.status === "EM_ANALISE"
                          ? "driver-review-pending"
                          : undefined
                      }
                    >
                      {statusLabels[registration.status] ??
                        "Situação indisponível"}
                    </strong>
                  </p>
                  {needsCorrection && (
                    <p>
                      {registration.motivoAjuste ||
                        "Seu cadastro precisa de correções antes da aprovação."}
                    </p>
                  )}
                </div>
                <button
                  className="secondary"
                  onClick={() => nav("cadastro-motorista")}
                >
                  {needsCorrection ? "Corrigir cadastro" : "Ver cadastro"}
                </button>
              </section>
            )}

          {driverHome && viewer?.companyMembership && (
            <>
              <section className="driver-registration-banner">
                <div>
                  <b>{viewer.companyMembership}</b>
                  <p>
                    Você recebe apenas os fretes atribuídos pela empresa
                    enquanto estiver vinculado.
                  </p>
                </div>
              </section>
              <RealCompanyWorkspace key={viewer.id} driverHome />
            </>
          )}
          {driverHome &&
            !viewer?.companyMembership &&
            registrationOwner === viewer?.id &&
            registration?.demoPixDisponivel &&
            !registration.assinaturaAtiva && (
              <section className="driver-registration-banner">
                <div>
                  <b>Seu cadastro foi aprovado</b>
                  <p>
                    Ative seu acesso para ver as solicitações e enviar
                    propostas.
                  </p>
                </div>
                <button className="primary" onClick={() => nav("assinatura")}>
                  Ativar acesso
                </button>
              </section>
            )}
          {role === "motorista" &&
            viewer &&
            !viewer.roles.motorista &&
            !(
              (tab === "chat" || (tab === "fretes" && route.selected)) &&
              viewer.managesCompany
            ) && (
              <section className="panel">
                <h2>Ativar perfil de motorista</h2>
                <p>Esta conta ainda não possui este perfil no servidor.</p>
                <button
                  className="primary"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      await client.activate("motorista");
                      await reload();
                      setEditingRegistration(true);
                    } catch (e) {
                      setError(
                        e instanceof Error
                          ? e.message
                          : "Não foi possível ativar.",
                      );
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Ativar perfil
                </button>
              </section>
            )}
          {role === "motorista" &&
          tab === "assinatura" &&
          registrationOwner === viewer?.id &&
          registration?.demoPixDisponivel ? (
            <DemoPixView
              onBack={() => nav("inicio")}
              onActivated={() => reload(false)}
            />
          ) : tab === "notificacoes" ? (
            <RealNotifications
              key={viewer?.id}
              role={role}
              onRead={() => setNotificationRevision((revision) => revision + 1)}
            />
          ) : tab === "chat" &&
            viewer &&
            (hasSelectedRole ||
              (role === "motorista" && viewer.managesCompany)) ? (
            <RealConversations
              key={viewer.id}
              role={role}
              conversationId={route.chatId}
              onRead={refreshNotificationSummary}
              vehicles={vehicles}
              canOffer={
                registrationOwner === viewer.id &&
                registration?.podeRealizarFretes === true
              }
            />
          ) : (tab === "fretes" || tab === "inicio") &&
            viewer &&
            (hasSelectedRole ||
              (role === "motorista" &&
                viewer.managesCompany &&
                !!route.selected)) &&
            !(driverHome && viewer.companyMembership) ? (
            <RealFreights
              key={`${viewer.id}:${role}`}
              role={role}
              tab={tab}
              name={viewer.name}
              selected={route.selected}
              vehicles={vehicles}
              canOffer={registration?.podeRealizarFretes === true}
              userId={viewer.id}
            />
          ) : tab === "veiculos" && viewer?.roles.motorista ? (
            <VehicleBookView
              vehicles={vehicles}
              onBack={() => nav("perfil")}
              onSave={async (next) => {
                try {
                  for (const previous of vehicles)
                    if (!next.some((v) => v.id === previous.id))
                      await client.deleteVehicle(previous.id);
                  for (const v of next) {
                    const previous = vehicles.find((x) => x.id === v.id);
                    if (!previous) await client.createVehicle(v);
                    else if (JSON.stringify(previous) !== JSON.stringify(v))
                      await client.updateVehicle(v);
                  }
                  await reload();
                  return true;
                } catch (e) {
                  setError(
                    e instanceof Error
                      ? e.message
                      : "Não foi possível salvar os veículos.",
                  );
                  await reload();
                  return false;
                }
              }}
            />
          ) : tab === "cadastro-motorista" && viewer?.roles.motorista ? (
            <section className="panel">
              <h1>Cadastro do motorista</h1>
              <p>
                Situação:{" "}
                {registration?.status === "EM_ANALISE" ? (
                  <strong className="driver-review-pending">Em análise</strong>
                ) : registration?.status === "APROVADO" ? (
                  <strong className="driver-review-approved">Aprovado</strong>
                ) : registration?.status === "AJUSTES_SOLICITADOS" ? (
                  "Ajustes solicitados"
                ) : registration?.status === "NAO_ENVIADO" ? (
                  "Cadastro não enviado"
                ) : (
                  "Carregando…"
                )}
              </p>
              {registration?.motivoAjuste && (
                <p className="alert">{registration.motivoAjuste}</p>
              )}
              <p>
                O envio fica em análise até a decisão de um administrador. A
                aprovação não é automática.
              </p>
              {(registration?.status === "NAO_ENVIADO" ||
                registration?.status === "AJUSTES_SOLICITADOS") && (
                <button
                  className="primary"
                  onClick={() => setEditingRegistration(true)}
                >
                  {registration?.cadastroCompleto
                    ? "Corrigir e reenviar cadastro"
                    : "Completar cadastro"}
                </button>
              )}
              <button
                className="secondary driver-status-refresh"
                disabled={loading || refreshingStatus}
                aria-busy={refreshingStatus}
                onClick={async () => {
                  setRefreshingStatus(true);
                  try {
                    await Promise.all([
                      reload(false),
                      new Promise<void>((resolve) => setTimeout(resolve, 2000)),
                    ]);
                  } finally {
                    setRefreshingStatus(false);
                  }
                }}
              >
                <span className="driver-status-spinner" aria-hidden="true" />
                <span role="status">
                  {refreshingStatus ? "Atualizando…" : "Atualizar situação"}
                </span>
              </button>
            </section>
          ) : tab === "enderecos" ? (
            viewer?.roles.cliente ? (
              addresses ? (
                <AddressBookView
                  addresses={addresses}
                  onSave={saveAddresses}
                  onBack={() => nav("perfil")}
                />
              ) : (
                <p role="status">
                  {error
                    ? "Não foi possível carregar os endereços."
                    : "Carregando endereços…"}
                </p>
              )
            ) : (
              <section className="panel">
                <h1>Meus endereços</h1>
                <p>
                  Ative o perfil de cliente para salvar endereços de retirada e
                  entrega.
                </p>
                <button
                  className="primary"
                  onClick={() => router.push("/cliente/inicio")}
                >
                  Ir para o perfil de cliente
                </button>
                <button className="secondary" onClick={() => nav("perfil")}>
                  Voltar
                </button>
              </section>
            )
          ) : tab === "editar-perfil" && viewer ? (
            <>
              <button
                className="back"
                onClick={() => nav("perfil")}
                disabled={busy}
              >
                <ArrowLeft size={18} /> Voltar ao meu perfil
              </button>
              <h1>Editar perfil</h1>
              <section className="panel profile profile-overview real-profile-layout">
                {viewer.image && !removePhoto ? (
                  <img
                    className="profile-photo"
                    alt="Sua foto de perfil"
                    src={viewer.image}
                  />
                ) : (
                  <span className="avatar large">
                    {viewer.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
                {viewer.image && (
                  <button
                    className="secondary"
                    type="button"
                    disabled={busy}
                    onClick={() => setRemovePhoto(!removePhoto)}
                  >
                    {removePhoto
                      ? "Desfazer remoção"
                      : "Remover foto do Google"}
                  </button>
                )}
                {removePhoto && (
                  <p>A foto será removida do FRETTA ao salvar.</p>
                )}
                <form
                  className="real-profile-editor"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setBusy(true);
                    setError("");
                    try {
                      await client.rename(name, removePhoto ? true : undefined);
                      await reload();
                      setRemovePhoto(false);
                      nav("perfil");
                    } catch (e) {
                      setError(
                        e instanceof Error
                          ? e.message
                          : "Não foi possível salvar o perfil.",
                      );
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  <label>
                    Nome de exibição
                    <input
                      minLength={2}
                      maxLength={100}
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <button className="primary" disabled={busy}>
                    {busy ? "Salvando…" : "Salvar alterações"}
                  </button>
                </form>
              </section>
            </>
          ) : tab === "perfil" && viewer ? (
            <>
              <div className="profile-page-heading">
                <h1>Meu perfil</h1>
              </div>
              <section className="panel profile profile-overview real-profile-layout">
                {viewer.image ? (
                  <img
                    className="profile-photo"
                    alt="Sua foto de perfil"
                    src={viewer.image}
                  />
                ) : (
                  <span className="avatar large">
                    {viewer.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <h2>{viewer.name}</h2>
                <p>{viewer.email}</p>
                {role === "motorista" && viewer.driverStats && (
                  <div className="driver-rating-summary">
                    <span>
                      <Star size={17} aria-hidden="true" />{" "}
                      {viewer.driverStats.average === null
                        ? "Ainda sem avaliações"
                        : `${viewer.driverStats.average.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} de 5 · ${viewer.driverStats.count} ${viewer.driverStats.count === 1 ? "avaliação" : "avaliações"}`}
                    </span>
                    <strong>
                      {viewer.driverStats.completed}{" "}
                      {viewer.driverStats.completed === 1
                        ? "frete concluído"
                        : "fretes concluídos"}
                    </strong>
                  </div>
                )}
                {role === "motorista" && viewer.driverPublicId && (
                  <DriverPublicId
                    key={viewer.driverPublicId}
                    code={viewer.driverPublicId}
                  />
                )}
                <button
                  className="primary"
                  onClick={() => {
                    setName(viewer.name);
                    setRemovePhoto(false);
                    setError("");
                    nav("editar-perfil");
                  }}
                >
                  <Pencil size={17} /> Editar perfil
                </button>
                <button
                  className="secondary"
                  onClick={() => {
                    setError("");
                    nav("enderecos");
                  }}
                >
                  <MapPin size={17} /> Meus endereços
                </button>
                {viewer.roles.motorista && role === "motorista" && (
                  <>
                    <button
                      className="secondary"
                      onClick={() => nav("veiculos")}
                    >
                      Meus veículos
                    </button>
                    {registration?.demoPixDisponivel && (
                      <button
                        className="secondary"
                        onClick={() => nav("assinatura")}
                      >
                        Meu acesso
                      </button>
                    )}
                    <button
                      className="secondary"
                      onClick={() => nav("cadastro-motorista")}
                    >
                      Cadastro do motorista
                    </button>
                  </>
                )}
                <Link
                  className="secondary real-freight-link"
                  href={
                    role === "motorista"
                      ? "/empresa?visao=motorista"
                      : "/empresa"
                  }
                >
                  Empresas e equipe
                </Link>
                {admin && (
                  <a className="secondary" href="/admin">
                    Painel administrativo
                  </a>
                )}
                <button
                  className="secondary"
                  onClick={() =>
                    router.push(
                      `/${role === "cliente" ? "motorista" : "cliente"}/perfil`,
                    )
                  }
                >
                  Alternar para perfil de{" "}
                  {role === "cliente" ? "motorista" : "cliente"}
                </button>
                <button
                  className="danger"
                  disabled={busy}
                  onClick={() => void signOut()}
                >
                  <LogOut size={17} /> Sair da conta
                </button>
              </section>
            </>
          ) : driverHome && viewer?.companyMembership ? null : (
            <section className="panel">
              <h1>Olá, {viewer?.name || session.user.name}</h1>
              <p>
                Seu login e seu perfil estão conectados. Você já pode atualizar
                o nome, gerenciar veículos e acompanhar o cadastro do motorista.
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
