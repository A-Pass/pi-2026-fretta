"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import type { AdminCase, AdminReview } from "@/contracts";
import { createHttpTransport } from "../../api/http";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { dateTime } from "../../lib/dates";
import { reviewVersion } from "./rules";
const labels = {
  EM_ANALISE: "Em análise",
  APROVADO: "Aprovado",
  AJUSTES_SOLICITADOS: "Ajustes solicitados",
};
export function AdminApp() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [cases, setCases] = useState<AdminCase[]>([]),
    [reviews, setReviews] = useState<AdminReview[]>([]),
    [privateDocuments, setPrivateDocuments] = useState<{
      profilePhoto: string | null;
      licensePhoto: string | null;
    } | null>(null),
    [privateDocumentsLoading, setPrivateDocumentsLoading] = useState(false),
    [loaded, setLoaded] = useState(false),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("EM_ANALISE"),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState<string | null>(null),
    [limit, setLimit] = useState(12);
  const [reason, setReason] = useState(""),
    [checks, setChecks] = useState<string[]>([]),
    [decision, setDecision] = useState<AdminReview["decision"] | null>(null),
    [activateOnApproval, setActivateOnApproval] = useState(false),
    [subscriptionLoading, setSubscriptionLoading] = useState(false),
    [success, setSuccess] = useState("");
  async function load(): Promise<boolean> {
    setLoading(true);
    setError("");
    try {
      const result = await createHttpTransport().request<{
        cases: AdminCase[];
        reviews: AdminReview[];
      }>("/admin/registrations");
      setCases(result.cases);
      setReviews(result.reviews);
      setLoaded(true);
      return true;
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível carregar o painel.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void createHttpTransport()
      .request<{ authenticated: boolean }>("/admin/me")
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (!authenticated) return;
    void load();
  }, [authenticated]);
  useEffect(() => {
    if (!authenticated) return;
    const refresh = () => {
      void load();
    };
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [authenticated]);
  const current = cases.find((c) => c.id === selected);
  useEffect(() => {
    if (!authenticated || !current) {
      setPrivateDocuments(null);
      setPrivateDocumentsLoading(false);
      return;
    }
    let active = true;
    setPrivateDocuments(null);
    setPrivateDocumentsLoading(true);
    createHttpTransport()
      .request<{ profilePhoto: string | null; licensePhoto: string | null }>(
        `/admin/registrations/${encodeURIComponent(current.id)}/documents`,
      )
      .then((documents) => {
        if (active) setPrivateDocuments(documents);
      })
      .catch((failure) => {
        if (active)
          setError(
            failure instanceof Error
              ? failure.message
              : "Não foi possível carregar os documentos privados.",
          );
      })
      .finally(() => {
        if (active) setPrivateDocumentsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [authenticated, current?.id]);
  const filtered = cases.filter(
    (c) =>
      (filter === "TODOS" || c.registration.status === filter) &&
      `${c.registration.fullName} ${c.registration.companyName || ""}`
        .toLocaleLowerCase("pt-BR")
        .includes(query.toLocaleLowerCase("pt-BR")),
  );
  function open(c: AdminCase) {
    setSelected(c.id);
    setReason("");
    setChecks([]);
    setActivateOnApproval(false);
    setSuccess("");
    setError("");
  }
  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoginLoading(true);
    setError("");
    try {
      await createHttpTransport().request("/admin/login", {
        method: "POST",
        body: {
          username: loginUsername,
          password: loginPassword,
        },
      });
      setLoginPassword("");
      setAuthenticated(true);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível entrar no painel.",
      );
    } finally {
      setLoginLoading(false);
    }
  }
  async function logout() {
    try {
      await createHttpTransport().request("/admin/logout", { method: "POST" });
      setAuthenticated(false);
      setCases([]);
      setReviews([]);
      setLoaded(false);
      setSelected(null);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Não foi possível encerrar a sessão administrativa.",
      );
    }
  }
  async function activateSubscription() {
    if (!current) return;
    setSubscriptionLoading(true);
    setError("");
    setSuccess("");
    try {
      const result = await createHttpTransport().request<{
        subscription: { active: true; expiresAt: string };
      }>(
        `/admin/registrations/${encodeURIComponent(current.id)}/subscription`,
        { method: "POST" },
      );
      setCases((previous) =>
        previous.map((item) =>
          item.id === current.id
            ? { ...item, subscription: result.subscription }
            : item,
        ),
      );
      await load();
      setSuccess(
        `Assinatura ativada por 30 dias, até ${dateTime(result.subscription.expiresAt)}.`,
      );
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Não foi possível ativar a assinatura.",
      );
    } finally {
      setSubscriptionLoading(false);
    }
  }
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <Link className="brand" href="/">
          FRETTA<span>•</span>
        </Link>
        <span>
          <ShieldCheck size={19} /> Administração
        </span>
        {authenticated ? (
          <button className="admin-logout" type="button" onClick={() => void logout()}>
            Sair
          </button>
        ) : (
          <Link href="/cliente/perfil">Voltar ao aplicativo</Link>
        )}
      </header>
      <main className="admin-main">
        {!authenticated && (
          <section className="admin-login panel" aria-labelledby="admin-login-title">
            <div className="admin-login-icon">
              <ShieldCheck size={28} />
            </div>
            <span className="eyebrow">ÁREA RESTRITA</span>
            <h1 id="admin-login-title">Login administrativo</h1>
            <p className="muted">
              Entre com usuário e senha. Esta área não possui cadastro público.
            </p>
            {error && (
              <p className="alert" role="alert">
                {error}
              </p>
            )}
            <form onSubmit={login}>
              <label>
                Usuário
                <input
                  name="username"
                  autoComplete="username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                />
              </label>
              <label>
                Senha
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </label>
              <button className="primary" disabled={loginLoading}>
                {loginLoading ? "Entrando…" : "Entrar"}
              </button>
            </form>
          </section>
        )}
        {authenticated && (
        <>
        <p className="admin-access-note">
          Área restrita · cadastros e decisões são carregados e salvos no banco de dados.
        </p>
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        {loading && <p role="status">Carregando cadastros…</p>}
        {!loading && !loaded && (
          <section className="panel">
            <h1>Painel indisponível</h1>
            <p>
              Não foi possível carregar os cadastros do banco de dados.
            </p>
            <button className="secondary" onClick={() => void load()}>
              Tentar novamente
            </button>
          </section>
        )}
        {loaded && (
          <>
            <span className="eyebrow">CUIDADO EM CADA CADASTRO</span>
            <h1>Análise de prestadores</h1>
            <div className="admin-stats">
              {Object.entries(labels).map(([status, label]) => (
                <button
                  key={status}
                  className="panel"
                  aria-pressed={filter === status}
                  onClick={() => {
                    setFilter(status);
                    setLimit(12);
                    setSelected(null);
                  }}
                >
                  <b>
                    {
                      cases.filter((c) => c.registration.status === status)
                        .length
                    }
                  </b>
                  {label}
                </button>
              ))}
            </div>
            {!current ? (
              <section className="panel">
                <div className="admin-filters">
                  <label>
                    Buscar prestador
                    <input
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setLimit(12);
                      }}
                      placeholder="Nome ou empresa"
                    />
                  </label>
                  <label>
                    Situação
                    <select
                      value={filter}
                      onChange={(e) => {
                        setFilter(e.target.value);
                        setLimit(12);
                      }}
                    >
                      <option value="TODOS">Todas</option>
                      {Object.entries(labels).map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button className="secondary" onClick={() => void load()}>
                    <RefreshCw size={17} />
                    Atualizar
                  </button>
                </div>
                <p role="status">{filtered.length} cadastro(s) encontrado(s)</p>
                <div className="admin-case-list">
                  {filtered.slice(0, limit).map((c) => (
                    <article key={c.id}>
                      <div>
                        <h2>{c.registration.fullName}</h2>
                        <p>
                          {c.registration.companyName || "Motorista autônomo"}
                        </p>
                        <small>
                          Enviado em {dateTime(c.registration.submittedAt)}
                        </small>
                      </div>
                      <span className="admin-status">
                        {labels[c.registration.status]}
                      </span>
                      <button className="secondary" onClick={() => open(c)}>
                        Analisar cadastro de {c.registration.fullName}
                      </button>
                    </article>
                  ))}
                </div>
                {!filtered.length && (
                  <p>Nenhum cadastro corresponde à busca.</p>
                )}
                {filtered.length > limit && (
                  <button
                    className="secondary"
                    onClick={() => setLimit((n) => n + 12)}
                  >
                    Carregar mais cadastros
                  </button>
                )}
              </section>
            ) : (
              <>
                <button
                  className="back"
                  onClick={() => {
                    setSelected(null);
                    setError("");
                    setSuccess("");
                  }}
                >
                  <ArrowLeft size={18} />
                  Voltar aos cadastros
                </button>
                <section className="panel">
                  <div className="section-head">
                    <div>
                      <h2>{current.registration.fullName}</h2>
                      <p>
                        {current.registration.companyName || "Pessoa física"}
                      </p>
                    </div>
                    <span className="admin-status">
                      {labels[current.registration.status]}
                    </span>
                  </div>
                  <div className="admin-detail-grid">
                    <div>
                      <h3>Identificação</h3>
                      <p>CPF: {current.registration.cpfMasked}</p>
                      {current.registration.cnpjMasked && (
                        <p>CNPJ: {current.registration.cnpjMasked}</p>
                      )}
                      <p>
                        Enviado em {dateTime(current.registration.submittedAt)}
                      </p>
                      {privateDocuments?.profilePhoto ? (
                        <img
                          className="admin-face"
                          src={privateDocuments.profilePhoto}
                          alt={`Foto de ${current.registration.fullName}`}
                        />
                      ) : privateDocumentsLoading ? (
                        <p>Carregando foto privada…</p>
                      ) : (
                        <p>Foto de perfil não cadastrada.</p>
                      )}
                    </div>
                    <div>
                      <h3>Habilitação</h3>
                      <p>
                        Registro: {current.registration.license.numberMasked}
                      </p>
                      <p>Categoria: {current.registration.license.category}</p>
                      <p>
                        Validade:{" "}
                        {current.registration.license.expiresOn
                          .split("-")
                          .reverse()
                          .join("/")}
                      </p>
                      <div className="admin-document">
                        <ClipboardList />
                        {privateDocuments?.licensePhoto ? (
                          <img
                            className="admin-license-preview"
                            src={privateDocuments.licensePhoto}
                            alt={`Imagem da CNH de ${current.registration.fullName}`}
                          />
                        ) : privateDocumentsLoading ? (
                          <p>Carregando documento privado…</p>
                        ) : (
                          <>
                            <p>Imagem da CNH não cadastrada.</p>
                            <small>
                              A aprovação exige o envio e a conferência deste
                              documento.
                            </small>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <h3>Veículos informados</h3>
                  {current.vehicles.length ? (
                    current.vehicles.map((v) => (
                      <article className="admin-vehicle" key={v.id}>
                        <b>
                          {v.category} · {v.model}
                        </b>
                        <p>
                          Placa: {v.plate}{" "}
                          {v.capacityKg ? `· ${v.capacityKg} kg` : ""}
                        </p>
                        <p>{v.description}</p>
                      </article>
                    ))
                  ) : (
                    <p>Nenhum veículo cadastrado.</p>
                  )}
                  {current.registration.feedback && (
                    <p className="alert">
                      Correções solicitadas: {current.registration.feedback}
                    </p>
                  )}
                  {current.registration.status === "APROVADO" && (
                    <div className="admin-subscription">
                      <h3>Assinatura</h3>
                      {current.subscription?.active ? (
                        <p>
                          Ativa até {dateTime(current.subscription.expiresAt)}.
                        </p>
                      ) : (
                        <>
                          <p>Não há uma assinatura ativa para este motorista.</p>
                          <button
                            className="secondary"
                            disabled={subscriptionLoading}
                            onClick={() => void activateSubscription()}
                          >
                            {subscriptionLoading
                              ? "Ativando…"
                              : "Ativar por 30 dias"}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </section>
                {current.registration.status === "EM_ANALISE" && (
                  <section className="panel">
                    <h2>Conferência do cadastro</h2>
                    <p>
                      Marque os itens conferidos. A aprovação não substitui a
                      verificação de autenticidade documental.
                    </p>
                    <div className="admin-checks">
                      {[
                        "Identificação e dados conferidos",
                        "Foto do motorista conferida",
                        "Habilitação e validade conferidas",
                        "Veículo e habilitação compatíveis",
                      ].map((label) => (
                        <label key={label}>
                          <input
                            type="checkbox"
                            checked={checks.includes(label)}
                            onChange={(e) =>
                              setChecks((old) =>
                                e.target.checked
                                  ? [...old, label]
                                  : old.filter((x) => x !== label),
                              )
                            }
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                    {current.subscription?.active ? (
                      <p>
                        Assinatura ativa até{" "}
                        {dateTime(current.subscription.expiresAt)}; a aprovação
                        não altera o prazo vigente.
                      </p>
                    ) : (
                      <label className="admin-subscription-option">
                        <input
                          type="checkbox"
                          checked={activateOnApproval}
                          onChange={(event) =>
                            setActivateOnApproval(event.target.checked)
                          }
                        />
                        Ativar assinatura por 30 dias após a aprovação (concessão
                        administrativa, sem cobrança).
                      </label>
                    )}
                    <label className="admin-reason">
                      Observações / correções a solicitar
                      <textarea
                        maxLength={1000}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Explique o que o motorista precisa corrigir (mínimo 10 caracteres para solicitar ajustes)."
                      />
                    </label>
                    <small>
                      {reason.length}/1000 caracteres · Não inclua números de
                      documentos.
                    </small>
                    <div className="actions">
                      <button
                        className="secondary"
                        disabled={reason.trim().length < 10}
                        onClick={() => setDecision("AJUSTES_SOLICITADOS")}
                      >
                        Solicitar correções
                      </button>
                      <button
                        className="primary"
                        disabled={
                          checks.length !== 4 ||
                          !privateDocuments?.licensePhoto ||
                          privateDocumentsLoading
                        }
                        onClick={() => setDecision("APROVADO")}
                      >
                        <CheckCircle2 size={18} />
                        Aprovar cadastro
                      </button>
                    </div>
                  </section>
                )}
                {success && (
                  <p role="status" className="admin-success">
                    {success}
                  </p>
                )}
                <section className="panel">
                  <h2>Histórico de análises</h2>
                  {!reviews.some((r) => r.caseId === current.id) && (
                    <p>Nenhuma decisão registrada pelo painel.</p>
                  )}
                  <ol className="admin-history">
                    {reviews
                      .filter((r) => r.caseId === current.id)
                      .slice()
                      .reverse()
                      .map((r) => (
                        <li key={r.id}>
                          <b>{labels[r.decision]}</b>
                          <p>
                            {r.actor} · {dateTime(r.at)}
                          </p>
                          {r.reason && <p>{r.reason}</p>}
                        </li>
                      ))}
                  </ol>
                </section>
              </>
            )}
          </>
        )}
        </>
        )}
      </main>
      <ConfirmDialog
        open={!!decision}
        onClose={() => setDecision(null)}
        title={
          decision === "APROVADO"
            ? `Aprovar cadastro de ${current?.registration.fullName || ""}?`
            : "Solicitar correções neste cadastro?"
        }
        description={
          decision === "APROVADO"
            ? activateOnApproval
              ? "O cadastro será aprovado e uma assinatura administrativa de 30 dias será ativada, sem cobrança."
              : "A decisão será registrada apenas após autorização no servidor."
            : `O prestador verá este motivo ao consultar o cadastro: ${reason.trim()}`
        }
        confirmLabel={
          decision === "APROVADO"
            ? activateOnApproval
              ? "Aprovar e ativar assinatura"
              : "Confirmar aprovação"
            : "Enviar solicitação de correções"
        }
        cancelLabel="Voltar à análise"
        destructive={false}
        onConfirm={async () => {
          if (!current || !decision) return false;
          try {
            await createHttpTransport().request(
              `/admin/registrations/${encodeURIComponent(current.id)}/review`,
              {
                method: "POST",
                body: {
                  expectedVersion: reviewVersion(current),
                  decision,
                  activateSubscription:
                    decision === "APROVADO" && activateOnApproval,
                  reason,
                  checks,
                },
              },
            );
            const refreshed = await load();
            setSuccess(
              refreshed
                ? decision === "APROVADO"
                  ? activateOnApproval
                    ? "Cadastro aprovado e assinatura ativada por 30 dias."
                    : "Cadastro aprovado."
                  : "Correções solicitadas. O motivo está disponível no cadastro do prestador."
                : "Decisão registrada no banco de dados. Atualize o painel para carregar os dados mais recentes.",
            );
            setActivateOnApproval(false);
            setDecision(null);
            return true;
          } catch (failure) {
            setError(
              failure instanceof Error
                ? failure.message
                : "Não foi possível registrar a decisão.",
            );
            return false;
          }
        }}
      />
    </div>
  );
}
