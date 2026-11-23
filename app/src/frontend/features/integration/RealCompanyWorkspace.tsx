"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  Building2,
  House,
  PackageSearch,
  ClipboardList,
  CreditCard,
  Truck,
  Users,
  Bell,
  LogOut,
  LoaderCircle,
  UserRound,
} from "lucide-react";
import { authClient } from "../../api/auth-client";
import { createHttpTransport } from "../../api/http";
import { ProposalFormDialog } from "../../components/ProposalFormDialog";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { StatusBadge } from "../../components/StatusBadge";
import { clearRequestDrafts } from "../requests/drafts";
import { DriverPublicId } from "./DriverPublicId";
import { DemoPixView } from "./DemoPixView";
import { companyPlanPriceCents } from "@/contracts/company-plan";
import {
  OperatingAreaPicker,
  type FreightSearchArea,
} from "./OperatingAreaPicker";
import { defaultArea } from "../driver/rules";
import { LoginView } from "../LoginView";
import { RealNotifications } from "./RealNotifications";
import { CompanyRegistrationForm } from "./CompanyRegistrationForm";
import { scheduleLabel } from "../../lib/dates";
import type { FreightStatus, Schedule } from "@/contracts";

type Company = {
  id: string;
  nome: string;
  razaoSocial: string;
  cnpj: string;
  responsavelNome: string;
  responsavelEmail: string;
  logoId: string | null;
  documentoCnpjId: string | null;
  cadastroStatus: "EM_ANALISE" | "AJUSTES_SOLICITADOS" | "APROVADO";
  motivoAjuste: string | null;
  vagas: number;
  planoAte: string | null;
};
type Vehicle = {
  id: string;
  categoria: string;
  modelo: string;
  ativo: boolean;
};
type Member = {
  available: boolean;
  motoristaId: string;
  motorista: {
    user: { name: string };
    cadastro: { status: string } | null;
    veiculos: Vehicle[];
  };
};
type Assignment = {
  id: string;
  motoristaId: string;
  status: string;
  empresa: Pick<Company, "id" | "nome">;
  motorista: { user: { name: string } };
  veiculo: Vehicle;
  frete: {
    id: string;
    titulo: string;
    status: FreightStatus;
    atualizadoEm: string;
    propostaAceitaId: string | null;
  };
  proposta?: {
    id: string;
    status: string;
    conversa: { id: string } | null;
  } | null;
};
type Workspace = {
  accountId: string;
  company: Company | null;
  driver: {
    codigoPublico: string;
    vinculoEmpresa: { empresa: Pick<Company, "id" | "nome"> } | null;
  } | null;
  invitations: { id: string; empresa: Pick<Company, "id" | "nome"> }[];
  outgoing: { id: string; motorista: { user: { name: string } } }[];
  assignments: Assignment[];
  members: Member[];

  demoPayments: boolean;
  unread: boolean;
};
type Opportunity = {
  id: string;
  title: string;
  description: string;
  vehicle: string;
  schedule: Schedule;
  origin: string;
  destination: string;
};
const http = createHttpTransport();
const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const labels: Record<string, string> = {
  PENDENTE: "Aguardando motorista",
  CONFIRMADA: "Disponibilidade confirmada",
  RECUSADA: "Atribuição recusada",
  CANCELADA: "Atribuição cancelada",
};
const proposalLabels: Record<string, string> = {
  PENDENTE: "Proposta enviada",
  ACEITA: "Proposta aceita",
  RECUSADA: "Proposta recusada",
  CANCELADA: "Proposta encerrada",
};
const submit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  return Object.fromEntries(new FormData(event.currentTarget));
};

const companyTabs = {
  home: { label: "Início", Icon: House },
  opportunities: { label: "Solicitações", Icon: PackageSearch },
  team: { label: "Equipe", Icon: Users },
  services: { label: "Serviços", Icon: ClipboardList },
  plan: { label: "Plano", Icon: CreditCard },
} as const;
type Tab = keyof typeof companyTabs | "profile" | "notifications";

export function RealCompanyWorkspace({
  driverHome = false,
}: {
  driverHome?: boolean;
}) {
  const { data: session, isPending } = authClient.useSession();
  const [data, setData] = useState<Workspace | null>(null);
  const [view, setView] = useState<"company" | "driver">(
    driverHome ? "driver" : "company",
  );
  const [tab, setTab] = useState<Tab>("home");
  const [editing, setEditing] = useState(false);
  const [freightQuery, setFreightQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [freightId, setFreightId] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [paymentSeats, setPaymentSeats] = useState<number | null>(null);
  const [seatInput, setSeatInput] = useState("1");
  const [found, setFound] = useState<{ name: string; code: string } | null>(
    null,
  );
  const [memberId, setMemberId] = useState("");
  const [offer, setOffer] = useState<Assignment | null>(null);
  const [confirmation, setConfirmation] = useState<{
    title: string;
    path: string;
    description?: string;
    acceptInvite?: boolean;
  } | null>(null);
  const userId = session?.user.id;
  const account = data?.accountId === userId ? data : null;
  const company = account?.company;
  const active =
    company?.cadastroStatus === "APROVADO" &&
    !!company.planoAte &&
    Date.parse(company.planoAte) > Date.now();
  const companyId = company?.id;
  const areaKey = companyId ? `fretta:company-area:${companyId}` : null;
  const [area, setArea] = useState<FreightSearchArea>({
    base: defaultArea.center,
    radius: 25,
  });
  const [restoredArea, setRestoredArea] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchRevision, setSearchRevision] = useState(0);
  const showSearch =
    view === "company" &&
    (tab === "home" || tab === "opportunities") &&
    !editing;
  useEffect(() => {
    if (!areaKey) return;
    let saved = { base: defaultArea.center, radius: 25 };
    try {
      const value = JSON.parse(localStorage.getItem(areaKey) ?? "null");
      if (
        value &&
        Number.isFinite(value.base?.lat) &&
        Number.isFinite(value.base?.lng) &&
        Math.abs(value.base.lat) <= 90 &&
        Math.abs(value.base.lng) <= 180 &&
        Number.isInteger(value.radius) &&
        value.radius >= 1 &&
        value.radius <= 300
      ) {
        saved = { base: value.base, radius: value.radius };
      }
    } catch {}
    setArea(saved);
    setRestoredArea(areaKey);
  }, [areaKey]);

  useEffect(() => {
    if (!showSearch || !active || !areaKey || restoredArea !== areaKey) return;
    const controller = new AbortController();
    setSearching(true);
    setSearchError("");
    setOpportunities([]);
    const timer = window.setTimeout(async () => {
      const query = new URLSearchParams({
        lat: String(area.base.lat),
        lng: String(area.base.lng),
        radius: String(area.radius),
      });
      try {
        const results = await http.request<{ items: Opportunity[] }>(
          `/company/opportunities?${query}`,
          { signal: controller.signal },
        );
        if (!controller.signal.aborted) setOpportunities(results.items);
      } catch (error) {
        if (!controller.signal.aborted)
          setSearchError(
            error instanceof Error
              ? error.message
              : "Não foi possível buscar os fretes.",
          );
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 200);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [showSearch, active, areaKey, restoredArea, area, searchRevision]);

  function changeArea(next: FreightSearchArea) {
    setSearching(true);
    setOpportunities([]);
    setFreightId("");
    setArea(next);
    try {
      if (areaKey) localStorage.setItem(areaKey, JSON.stringify(next));
    } catch {}
  }
  async function load(signal?: AbortSignal) {
    const result = await http.request<Workspace>("/company", { signal });
    if (!signal?.aborted) setData(result);
    return result;
  }
  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    void load(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        if (result.company)
          setSeatInput(String(Math.max(1, result.company.vagas)));
        const query = new URLSearchParams(location.search);
        setView(
          driverHome || query.get("visao") === "motorista"
            ? "driver"
            : "company",
        );
        if (query.get("aba") === "servicos") setTab("services");
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      });
    return () => controller.abort();
  }, [userId, driverHome]);
  useEffect(() => {
    if (!userId || busy || refreshing || offer || confirmation) return;
    const controller = new AbortController();
    const refresh = () => {
      if (document.visibilityState === "visible")
        void load(controller.signal).catch(() => {});
    };
    window.addEventListener("focus", refresh);
    const timer = window.setInterval(refresh, 10000);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, [userId, busy, refreshing, offer, confirmation]);

  async function refresh() {
    setRefreshing(true);
    setError("");
    setRefreshMessage("");
    const animation = new Promise<void>((resolve) => setTimeout(resolve, 2000));
    try {
      const [result] = await Promise.all([
        http.request<Workspace>("/company"),
        animation,
      ]);
      setData(result);
      setRefreshMessage("Situação atualizada.");
      setSearchRevision((revision) => revision + 1);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Não foi possível atualizar.",
      );
    } finally {
      await animation;
      setRefreshing(false);
    }
  }

  async function run(
    path: string,
    body: object = {},
    message = "Alteração salva.",
    reportInDialog = false,
  ) {
    if (busy) return false;
    setError("");
    setNotice("");
    setBusy(true);
    try {
      if (path === "edit" || path === "create") {
        const company = await http.request<Company>(`/company/${path}`, {
          method: "POST",
          body,
        });
        setData((current) =>
          current && current.accountId === userId
            ? { ...current, company }
            : current,
        );
      } else {
        await http.request(`/company/${path}`, { method: "POST", body });
        await load();
      }
      setNotice(message);
      return true;
    } catch (e) {
      if (reportInDialog) throw e;
      setError(e instanceof Error ? e.message : "Não foi possível concluir.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function lookup(event: FormEvent<HTMLFormElement>) {
    const { code } = submit(event);
    setBusy(true);
    setFound(null);
    setError("");
    try {
      setFound(
        await http.request("/company/lookup", {
          method: "POST",
          body: { code },
        }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Motorista indisponível.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (tab !== "plan" || view !== "company") setPaymentSeats(null);
  }, [tab, view]);

  useEffect(() => {
    if (
      tab === "opportunities" &&
      freightId &&
      opportunities.some((item) => item.id === freightId)
    ) {
      document.getElementById("company-assignment-title")?.focus();
    }
  }, [tab, freightId, opportunities]);

  if (isPending)
    return driverHome ? (
      <p role="status">Carregando serviços…</p>
    ) : (
      <main role="status">Conferindo sua sessão…</main>
    );
  if (driverHome && !session) return null;
  if (!session)
    return (
      <LoginView
        role="empresa"
        onBack={() => location.assign("/")}
        onGoogleSignIn={async () => {
          setBusy(true);
          setError("");
          try {
            const result = await authClient.signIn.social({
              provider: "google",
              callbackURL: location.href,
            });
            if (result.error)
              throw Error(
                result.error.message || "Não foi possível entrar com Google.",
              );
          } catch (error) {
            setError(
              error instanceof Error
                ? error.message
                : "Não foi possível entrar.",
            );
            setBusy(false);
          }
        }}
        googleSignInPending={busy}
        googleSignInError={error}
      />
    );
  const seats = Number(seatInput);
  const minimumSeats = Math.max(1, account?.members.length ?? 0);
  const validSeats = seats >= minimumSeats && seats <= 50;
  const driver = account?.driver;
  const availableMembers =
    account?.members.filter((item) => item.available) ?? [];
  const member = availableMembers.find((item) => item.motoristaId === memberId);
  const selectedFreight = opportunities.find((item) => item.id === freightId);
  const query = freightQuery.trim().toLocaleLowerCase("pt-BR");
  const visibleFreights =
    tab === "home"
      ? opportunities.slice(0, 3)
      : opportunities.filter((item) =>
          [item.title, item.origin, item.destination, item.vehicle].some(
            (part) => part.toLocaleLowerCase("pt-BR").includes(query),
          ),
        );
  const assignments =
    account?.assignments.filter((a) =>
      view === "company"
        ? a.empresa.id === company?.id
        : a.motoristaId === userId &&
          (!driverHome || a.empresa.id === driver?.vinculoEmpresa?.empresa.id),
    ) ?? [];

  const visibleAssignments = assignments.filter((item) => {
    const history =
      item.frete.status === "CONCLUIDO" ||
      item.frete.status === "CANCELADO" ||
      item.status === "CANCELADA" ||
      item.status === "RECUSADA" ||
      (item.frete.status !== "ABERTO" &&
        (!item.proposta || item.frete.propostaAceitaId !== item.proposta.id));
    return (
      view === "driver" ||
      serviceFilter === "all" ||
      (serviceFilter === "history" ? history : !history)
    );
  });

  const assignedServices = (
    <section className="panel">
      <h2>Serviços atribuídos</h2>
      {view === "company" && (
        <label className="company-freight-search">
          Situação dos serviços
          <select
            value={serviceFilter}
            onChange={(event) => setServiceFilter(event.target.value)}
          >
            <option value="all">Todos</option>
            <option value="ongoing">Em andamento</option>
            <option value="history">Histórico</option>
          </select>
        </label>
      )}
      {!visibleAssignments.length && (
        <p>
          {assignments.length
            ? "Nenhum serviço neste filtro."
            : "Nenhum serviço atribuído."}
        </p>
      )}
      {visibleAssignments.map((a) => {
        const isOpen = a.frete.status === "ABERTO";
        const actionable = ["PENDENTE", "CONFIRMADA"].includes(a.status);
        return (
          <article className="panel" key={a.id}>
            <h3>{a.frete.titulo}</h3>
            <p>
              {view === "company" ? a.motorista.user.name : a.empresa.nome} ·{" "}
              {a.veiculo.modelo}
            </p>
            <p>
              {labels[a.status]}
              {a.proposta ? ` · ${proposalLabels[a.proposta.status]}` : ""}
            </p>
            <StatusBadge status={a.frete.status} />
            <div className="actions">
              {(actionable || a.proposta) && (
                <Link
                  className="secondary real-freight-link"
                  href={`/motorista/fretes/${a.frete.id}`}
                >
                  Ver frete
                </Link>
              )}
              {view === "driver" && isOpen && a.status === "PENDENTE" && (
                <>
                  <button
                    className="secondary"
                    disabled={busy}
                    onClick={() =>
                      void run(
                        `respond-assignment/${a.id}`,
                        { accept: false },
                        "Atribuição recusada.",
                      )
                    }
                  >
                    Recusar serviço
                  </button>
                  <button
                    className="primary"
                    disabled={busy}
                    onClick={() =>
                      void run(
                        `respond-assignment/${a.id}`,
                        { accept: true },
                        "Disponibilidade confirmada.",
                      )
                    }
                  >
                    Confirmar disponibilidade
                  </button>
                </>
              )}
              {view === "company" &&
                active &&
                isOpen &&
                a.status === "CONFIRMADA" && (
                  <button
                    className="primary"
                    disabled={busy}
                    onClick={() => setOffer(a)}
                  >
                    {a.proposta
                      ? "Enviar nova proposta"
                      : "Enviar proposta da empresa"}
                  </button>
                )}
              {view === "company" && isOpen && actionable && (
                <button
                  className="secondary"
                  disabled={busy}
                  onClick={() =>
                    setConfirmation({
                      title: "Cancelar atribuição?",
                      path: `cancel-assignment/${a.id}`,
                    })
                  }
                >
                  Cancelar atribuição
                </button>
              )}
              {a.proposta?.conversa && (
                <Link
                  className="secondary real-freight-link"
                  href={`/motorista/chat/${a.proposta.conversa.id}`}
                >
                  Conversar
                </Link>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );

  if (driverHome) {
    return (
      <div className="driver-home-assigned">
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="driver-review-approved" role="status">
            {notice}
          </p>
        )}
        {account ? (
          assignedServices
        ) : error ? (
          <button
            type="button"
            className="secondary"
            disabled={refreshing}
            onClick={() => void refresh()}
          >
            Tentar novamente
          </button>
        ) : (
          <p role="status">Carregando serviços…</p>
        )}
      </div>
    );
  }

  return (
    <div
      className={
        view === "company" && company?.cadastroStatus === "APROVADO"
          ? "fleet-shell company-with-navigation"
          : "fleet-shell"
      }
    >
      <header className="admin-header">
        {view === "company" ? (
          <button
            type="button"
            className="brand company-brand-home"
            onClick={() => {
              setEditing(false);
              setTab("home");
            }}
          >
            <Truck size={20} /> FRETTA<span>•</span>
          </button>
        ) : (
          <Link href="/motorista/inicio" className="brand">
            <Truck size={20} /> FRETTA<span>•</span>
          </Link>
        )}
        <div className="company-header-actions">
          <button
            type="button"
            className="secondary"
            aria-label={
              account?.unread ? "Notificações não lidas" : "Notificações"
            }
            style={{ position: "relative" }}
            onClick={() => {
              setEditing(false);
              setTab("notifications");
            }}
          >
            <Bell size={18} />
            {account?.unread && (
              <span className="notification-unread-dot" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className="secondary"
            aria-label="Meu perfil"
            onClick={() => {
              setEditing(false);
              setTab("profile");
            }}
          >
            <UserRound size={18} />
          </button>
        </div>
      </header>
      <main className="admin-main real-company">
        <div className="section-head">
          <h1>
            {view === "driver"
              ? "Área do motorista"
              : (company?.nome ?? "Área da empresa")}
          </h1>
          {tab !== "notifications" && (
            <button
              type="button"
              className="secondary driver-status-refresh company-status-refresh"
              disabled={busy || refreshing}
              aria-busy={refreshing}
              onClick={() => void refresh()}
            >
              {refreshing && (
                <LoaderCircle
                  className="company-status-spinner"
                  size={20}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              )}
              <span role="status">
                {refreshing ? "Atualizando…" : "Atualizar situação"}
              </span>
            </button>
          )}
        </div>
        {refreshMessage && tab !== "notifications" && (
          <p role="status">{refreshMessage}</p>
        )}
        {(tab === "profile" || tab === "notifications") && !editing && (
          <button
            type="button"
            className="secondary"
            onClick={() => setTab(view === "driver" ? "team" : "home")}
          >
            {view === "driver"
              ? "Voltar ao meu vínculo"
              : "Voltar à área da empresa"}
          </button>
        )}
        {driver &&
          (view === "driver" || company?.cadastroStatus === "APROVADO") && (
            <nav className="fleet-tabs" aria-label="Área de trabalho">
              <button
                type="button"
                className={view === "company" ? "primary" : "secondary"}
                aria-pressed={view === "company"}
                onClick={() => {
                  setView("company");
                  setTab("home");
                }}
              >
                <Building2 size={17} /> Minha empresa
              </button>
              <button
                type="button"
                className={view === "driver" ? "primary" : "secondary"}
                aria-pressed={view === "driver"}
                onClick={() => {
                  setView("driver");
                  setTab("team");
                }}
              >
                <Users size={17} /> Meu vínculo
              </button>
            </nav>
          )}
        {view === "driver" && (
          <nav
            className="fleet-tabs"
            aria-label="Painel do motorista vinculado"
          >
            <button
              className={
                tab === "team" || tab === "home" ? "primary" : "secondary"
              }
              onClick={() => setTab("team")}
            >
              Convites e vínculo
            </button>
            <button
              className={tab === "services" ? "primary" : "secondary"}
              onClick={() => setTab("services")}
            >
              Serviços atribuídos
            </button>
            <Link
              className="secondary real-freight-link"
              href="/motorista/chat"
            >
              Conversas
            </Link>
          </nav>
        )}
        {tab === "notifications" && (
          <RealNotifications
            role="motorista"
            onRead={() => void load().catch(() => {})}
          />
        )}
        {tab === "profile" && !editing && (
          <section className="panel">
            <h2>Meu perfil</h2>
            <p>
              {session.user.name} · {session.user.email}
            </p>
            {company && (
              <p>
                {company.razaoSocial} · CNPJ {company.cnpj}
              </p>
            )}
            {company &&
              (company.cadastroStatus !== "EM_ANALISE" ||
                !company.razaoSocial) && (
                <button className="secondary" onClick={() => setEditing(true)}>
                  Editar dados da empresa
                </button>
              )}
            <button
              className="secondary"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  const result = await authClient.signOut();
                  if (result.error)
                    throw Error(
                      result.error.message || "Não foi possível sair.",
                    );
                  try {
                    clearRequestDrafts(sessionStorage);
                  } catch {}
                  location.replace("/");
                } catch (error) {
                  setError(
                    error instanceof Error
                      ? error.message
                      : "Não foi possível sair.",
                  );
                  setBusy(false);
                }
              }}
            >
              <LogOut size={17} /> Sair da conta
            </button>
          </section>
        )}
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="driver-review-approved" role="status">
            {notice}
          </p>
        )}
        {!account && !error && <p role="status">Carregando…</p>}
        {account &&
          view === "company" &&
          (!company || editing) &&
          (tab === "home" || editing) && (
            <CompanyRegistrationForm
              busy={busy}
              startAtProof={
                !!(
                  company?.razaoSocial &&
                  company.responsavelNome &&
                  company.responsavelEmail &&
                  (company.cadastroStatus !== "APROVADO" ||
                    !company.documentoCnpjId)
                )
              }
              correctionReason={
                company?.cadastroStatus === "AJUSTES_SOLICITADOS"
                  ? company.motivoAjuste
                  : null
              }
              initial={{
                legalName: company?.razaoSocial || company?.nome || "",
                cnpj: company?.cnpj ?? "",
                contact: company?.responsavelNome || session.user.name,
                email: company?.responsavelEmail || session.user.email,
                logoId: company?.logoId ?? null,
                documentId: company?.documentoCnpjId ?? null,
              }}
              cancel={editing ? () => setEditing(false) : undefined}
              save={async (fields) => {
                const saved = await run(
                  company ? "edit" : "create",
                  {
                    ...fields,
                    name:
                      company?.razaoSocial &&
                      company.nome !== company.razaoSocial
                        ? company.nome
                        : fields.legalName,
                  },
                  "Cadastro da empresa salvo.",
                );
                if (saved) {
                  setEditing(false);
                  setTab("home");
                }
                return saved;
              }}
            />
          )}
        {account &&
          view === "company" &&
          company &&
          !editing &&
          company.cadastroStatus !== "APROVADO" &&
          !["profile", "notifications"].includes(tab) && (
            <section
              className="panel company-registration-status"
              aria-labelledby="company-status"
            >
              <p className="eyebrow">Situação do cadastro</p>
              <h2 id="company-status">
                {!company.razaoSocial
                  ? "Complete o cadastro da empresa"
                  : company.cadastroStatus === "AJUSTES_SOLICITADOS"
                    ? "Ajustes solicitados"
                    : "Cadastro em análise"}
              </h2>
              <p>
                {company.motivoAjuste ??
                  (company.razaoSocial
                    ? "Recebemos os dados da empresa. Aguarde a análise da administração para ativar o plano e começar a usar o painel."
                    : "Preencha os dados da empresa para enviar o cadastro para análise.")}
              </p>
              {!company.documentoCnpjId && (
                <p>
                  Envie o comprovante do CNPJ em PDF ou foto para concluir a
                  conferência.
                </p>
              )}
              <button className="primary" onClick={() => setEditing(true)}>
                Atualizar cadastro
              </button>
              <button className="secondary" onClick={() => setTab("profile")}>
                Meu perfil
              </button>
            </section>
          )}
        {account &&
          view === "company" &&
          company?.cadastroStatus === "APROVADO" &&
          !editing && (
            <>
              {tab === "plan" && paymentSeats !== null && (
                <DemoPixView
                  companySeats={paymentSeats}
                  onBack={() => setPaymentSeats(null)}
                  onActivated={async () => {
                    await load();
                  }}
                />
              )}
              {tab === "plan" && paymentSeats === null && (
                <section className="panel">
                  <h2>Plano da empresa</h2>
                  <p>
                    {active
                      ? `Plano ativo · ${account.members.length} de ${company.vagas} vagas ocupadas`
                      : "Ative o plano para convidar motoristas e enviar propostas."}
                  </p>
                  {active && company.planoAte && (
                    <p>
                      Válido até{" "}
                      {new Intl.DateTimeFormat("pt-BR", {
                        timeZone: "America/Bahia",
                      }).format(new Date(company.planoAte))}
                      . Alterar as vagas mantém essa data.
                    </p>
                  )}
                  <p>
                    R$ 249,90 por mês com uma vaga. Cada vaga adicional custa R$
                    49,90.
                  </p>
                  {!account.demoPayments && (
                    <p>
                      Pagamento de demonstração indisponível neste ambiente.
                    </p>
                  )}
                  {account.demoPayments && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!validSeats) return;
                        setPaymentSeats(seats);
                      }}
                    >
                      <label>
                        Vagas para motoristas
                        <input
                          type="text"
                          inputMode="numeric"
                          value={seatInput}
                          onChange={(event) =>
                            setSeatInput(
                              event.target.value
                                .replace(/\D/g, "")
                                .replace(/^0+/, ""),
                            )
                          }
                          aria-describedby="company-seats-range"
                          required
                        />
                      </label>
                      <small id="company-seats-range">
                        Informe de {minimumSeats} a 50 vagas.
                      </small>
                      {validSeats && (
                        <p>
                          <strong>
                            {money.format(companyPlanPriceCents(seats) / 100)}
                          </strong>{" "}
                          valor mensal · sem cobrança real
                        </p>
                      )}
                      <button
                        className="primary"
                        disabled={busy || !validSeats}
                      >
                        {active
                          ? "Gerar Pix para alterar plano"
                          : "Gerar Pix de demonstração"}
                      </button>
                    </form>
                  )}
                </section>
              )}
              {tab === "team" && (
                <section className="panel">
                  <h2>Equipe</h2>
                  <p>
                    {account.members.length} de {company.vagas} vagas ocupadas ·{" "}
                    {account.outgoing.length} convites pendentes
                  </p>
                  {!active || account.members.length >= company.vagas ? (
                    <div className="actions">
                      <p>
                        {active
                          ? "Todas as vagas estão ocupadas."
                          : "Ative o plano para enviar convites."}
                      </p>
                      <button
                        className="secondary"
                        onClick={() => setTab("plan")}
                      >
                        Ver plano
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={lookup}>
                      <label>
                        ID do motorista
                        <input
                          name="code"
                          required
                          autoComplete="off"
                          spellCheck={false}
                          placeholder="Cole o ID informado pelo motorista"
                        />
                      </label>
                      <button className="secondary" disabled={busy}>
                        Buscar motorista
                      </button>
                    </form>
                  )}
                  {active &&
                    account.members.length < company.vagas &&
                    found && (
                      <div className="actions">
                        <b>{found.name}</b>
                        <button
                          className="primary"
                          disabled={busy}
                          onClick={async () => {
                            if (
                              await run(
                                "invite",
                                { code: found.code },
                                "Convite enviado.",
                              )
                            )
                              setFound(null);
                          }}
                        >
                          Enviar convite
                        </button>
                      </div>
                    )}
                  <h3>Convites enviados</h3>
                  {!account.outgoing.length && <p>Nenhum convite pendente.</p>}
                  {account.outgoing.map((invite) => (
                    <div className="actions" key={invite.id}>
                      <span>
                        {invite.motorista.user.name} · Convite pendente
                      </span>
                      <button
                        className="secondary"
                        disabled={busy}
                        onClick={() => void run(`cancel-invite/${invite.id}`)}
                      >
                        Cancelar convite
                      </button>
                    </div>
                  ))}
                  <h3>Motoristas vinculados</h3>
                  {!account.members.length && (
                    <p>Nenhum motorista na equipe.</p>
                  )}
                  {account.members.map((item) => (
                    <div className="actions" key={item.motoristaId}>
                      <span>
                        {item.motorista.user.name} ·{" "}
                        {item.available
                          ? "Disponível para atribuição"
                          : "Indisponível para atribuição"}
                      </span>
                      <button
                        className="secondary"
                        disabled={busy}
                        onClick={() =>
                          setConfirmation({
                            title: "Remover motorista da equipe?",
                            path: `remove-member/${item.motoristaId}`,
                          })
                        }
                      >
                        Remover vínculo
                      </button>
                    </div>
                  ))}
                </section>
              )}
              {tab === "home" && !editing && (
                <section className="panel company-area">
                  <h2>Área de atuação</h2>
                  <p>
                    Escolha a base e o raio para buscar fretes pelo local de
                    retirada.
                  </p>
                  {areaKey && restoredArea === areaKey && (
                    <OperatingAreaPicker area={area} onChange={changeArea} />
                  )}
                </section>
              )}
              {showSearch && !active && (
                <section className="panel">
                  <h2>Solicitações</h2>
                  <p>Ative o plano para buscar fretes.</p>
                  <button className="primary" onClick={() => setTab("plan")}>
                    Ver plano
                  </button>
                </section>
              )}
              {showSearch && active && (
                <section className="panel">
                  <h2>Solicitações na sua área</h2>
                  {tab === "opportunities" && (
                    <>
                      <p>
                        Raio de {area.radius} km a partir da base definida no
                        Início.
                      </p>
                      <button
                        className="secondary"
                        onClick={() => {
                          setTab("home");
                          window.scrollTo(0, 0);
                        }}
                      >
                        Ajustar área de atuação
                      </button>
                      <label className="company-freight-search">
                        Buscar solicitações
                        <input
                          value={freightQuery}
                          onChange={(event) =>
                            setFreightQuery(event.target.value)
                          }
                          placeholder="Frete, bairro, cidade ou veículo"
                        />
                      </label>
                    </>
                  )}
                  {searching && <p role="status">Buscando solicitações…</p>}
                  {searchError && (
                    <p className="alert" role="alert">
                      {searchError}
                    </p>
                  )}
                  {!searching && !searchError && opportunities.length === 0 && (
                    <p>Nenhuma solicitação disponível nesse raio.</p>
                  )}
                  {!searching &&
                    opportunities.length > 0 &&
                    !visibleFreights.length && (
                      <p>Nenhuma solicitação corresponde à busca.</p>
                    )}
                  <div className="company-opportunities">
                    {visibleFreights.map((item) => {
                      const assigned = assignments.some(
                        (entry) =>
                          entry.frete.id === item.id &&
                          (entry.status === "PENDENTE" ||
                            entry.status === "CONFIRMADA"),
                      );
                      return (
                        <details key={item.id} className="company-opportunity">
                          <summary>{item.title}</summary>
                          <p>
                            {item.origin} → {item.destination} · {item.vehicle}
                          </p>
                          <p>{scheduleLabel(item.schedule)}</p>
                          <p>{item.description}</p>
                          {assigned ? (
                            <button
                              className="secondary"
                              onClick={() => {
                                setTab("services");
                                setServiceFilter("all");
                                window.scrollTo(0, 0);
                              }}
                            >
                              Acompanhar em serviços
                            </button>
                          ) : (
                            <button
                              className="secondary"
                              onClick={() => {
                                setFreightQuery("");
                                setFreightId(item.id);
                                setMemberId("");
                                setTab("opportunities");
                              }}
                            >
                              {availableMembers.length
                                ? "Atribuir solicitação"
                                : "Ver como atribuir"}
                            </button>
                          )}
                        </details>
                      );
                    })}
                  </div>
                  {tab === "home" && opportunities.length > 0 && (
                    <button
                      className="secondary"
                      onClick={() => {
                        setTab("opportunities");
                        window.scrollTo(0, 0);
                      }}
                    >
                      Ver todas as solicitações
                    </button>
                  )}
                  {tab === "opportunities" && selectedFreight && (
                    <section className="company-assignment">
                      <h3 id="company-assignment-title" tabIndex={-1}>
                        Atribuir {selectedFreight.title}
                      </h3>
                      {availableMembers.length === 0 ? (
                        <>
                          <p>
                            Vincule um motorista aprovado, com CNH válida e
                            veículo ativo.
                          </p>
                          <button
                            className="secondary"
                            onClick={() => {
                              setTab("team");
                              window.scrollTo(0, 0);
                            }}
                          >
                            Ir para Equipe
                          </button>
                        </>
                      ) : (
                        <form
                          onSubmit={async (event) => {
                            const fields = submit(event);
                            if (
                              await run(
                                "assign",
                                { ...fields, freightId: selectedFreight.id },
                                "Serviço enviado ao motorista.",
                              )
                            ) {
                              setFreightId("");
                              setServiceFilter("all");
                              setTab("services");
                              window.scrollTo(0, 0);
                            }
                          }}
                        >
                          <label>
                            Motorista
                            <select
                              name="driverId"
                              required
                              value={memberId}
                              onChange={(e) => setMemberId(e.target.value)}
                            >
                              <option value="" disabled>
                                Selecione um motorista
                              </option>
                              {availableMembers.map((item) => (
                                <option
                                  key={item.motoristaId}
                                  value={item.motoristaId}
                                >
                                  {item.motorista.user.name}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Veículo
                            <select
                              key={memberId}
                              name="vehicleId"
                              required
                              defaultValue=""
                            >
                              <option value="" disabled>
                                Selecione um veículo
                              </option>
                              {member?.motorista.veiculos.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.categoria} · {v.modelo}
                                </option>
                              ))}
                            </select>
                          </label>
                          <button className="primary" disabled={busy}>
                            Pedir disponibilidade
                          </button>
                        </form>
                      )}
                      <button
                        className="secondary"
                        onClick={() => setFreightId("")}
                      >
                        Fechar atribuição
                      </button>
                    </section>
                  )}
                </section>
              )}
            </>
          )}
        {account && view === "driver" && (tab === "team" || tab === "home") && (
          <section className="panel">
            <h2>Meu vínculo</h2>
            {driver ? (
              <>
                <DriverPublicId code={driver.codigoPublico} />
                {driver.vinculoEmpresa ? (
                  <div className="actions">
                    <strong>
                      Vinculado a {driver.vinculoEmpresa.empresa.nome}
                    </strong>
                    <button
                      className="secondary"
                      disabled={busy}
                      onClick={() =>
                        setConfirmation({
                          title: "Encerrar vínculo com a empresa?",
                          path: "leave",
                        })
                      }
                    >
                      Sair da equipe
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <Link
                href="/motorista/inicio"
                className="secondary real-freight-link"
              >
                Ativar perfil de motorista
              </Link>
            )}
            {account.invitations.map((invite) => (
              <article className="panel" key={invite.id}>
                <h3>Convite de {invite.empresa.nome}</h3>
                <p>
                  Se aceitar, você só verá novos fretes que essa empresa
                  atribuir a você. A empresa negocia os fretes e o vínculo
                  dispensa a assinatura individual.
                </p>
                <div className="actions">
                  <button
                    className="secondary"
                    disabled={busy}
                    onClick={() =>
                      void run(
                        `respond-invite/${invite.id}`,
                        { accept: false },
                        "Convite recusado.",
                      )
                    }
                  >
                    Recusar
                  </button>
                  <button
                    className="primary"
                    disabled={busy}
                    onClick={() =>
                      setConfirmation({
                        title: `Aceitar convite de ${invite.empresa.nome}?`,
                        path: `respond-invite/${invite.id}`,
                        acceptInvite: true,
                        description:
                          "Enquanto estiver vinculado, você verá apenas os novos fretes atribuídos pela empresa. Seu feed de autônomo ficará indisponível durante o vínculo. Os fretes já contratados continuam em Meus serviços.",
                      })
                    }
                  >
                    Aceitar vínculo
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
        {account &&
          tab === "services" &&
          (view === "driver" || company) &&
          assignedServices}
        {offer && (
          <ProposalFormDialog
            vehicles={[
              {
                id: offer.veiculo.id,
                category: offer.veiculo.categoria,
                model: offer.veiculo.modelo,
                plate: "",
                description: "",
              },
            ]}
            onClose={() => setOffer(null)}
            onManageVehicles={() => setOffer(null)}
            onSubmit={async (draft) => {
              await http.request(
                `/freights/${offer.frete.id}/company-propose`,
                {
                  method: "POST",
                  body: {
                    ...draft,
                    assignmentId: offer.id,
                    expectedUpdatedAt: offer.frete.atualizadoEm,
                  },
                },
              );
              await load();
              setNotice("Proposta da empresa enviada.");
              return true;
            }}
          />
        )}
        <ConfirmDialog
          open={!!confirmation}
          title={confirmation?.title ?? ""}
          description={
            confirmation?.description ??
            "Confirme para registrar esta alteração."
          }
          confirmLabel={
            confirmation?.acceptInvite ? "Aceitar vínculo" : "Confirmar"
          }
          destructive={!confirmation?.acceptInvite}
          cancelLabel="Voltar"
          onClose={() => setConfirmation(null)}
          onConfirm={async () => {
            if (
              !confirmation ||
              !(await run(
                confirmation.path,
                confirmation.acceptInvite ? { accept: true } : {},
                confirmation.acceptInvite
                  ? "Vínculo aceito. Acompanhe os fretes atribuídos em Serviços atribuídos."
                  : undefined,
                true,
              ))
            )
              return false;
            setConfirmation(null);
            return true;
          }}
        />
      </main>
      {view === "company" && company?.cadastroStatus === "APROVADO" && (
        <nav className="company-bottom-nav" aria-label="Navegação da empresa">
          {Object.entries(companyTabs).map(([key, { label, Icon }]) => (
            <button
              type="button"
              key={key}
              aria-current={tab === key ? "page" : undefined}
              onClick={() => {
                setEditing(false);
                if (tab !== key) {
                  setNotice("");
                  setError("");
                  setRefreshMessage("");
                }
                setTab(key as Tab);
                window.scrollTo(0, 0);
              }}
            >
              <Icon size={21} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
