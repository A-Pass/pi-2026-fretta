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
import type { Store } from "@/contracts";
import { api } from "../../api/client";
import { createHttpTransport } from "../../api/http";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { dateTime } from "../../lib/dates";
import {
  demoCases,
  reviewDemo,
  reviewVersion,
  type AdminCase,
  type AdminReview,
} from "./rules";
const labels = {
  EM_ANALISE: "Em análise",
  APROVADO: "Aprovado",
  AJUSTES_SOLICITADOS: "Ajustes solicitados",
};
export function AdminApp() {
  const real = true;
  const [store, setStore] = useState<Store | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("EM_ANALISE"),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState<string | null>(null),
    [limit, setLimit] = useState(12);
  const [reason, setReason] = useState(""),
    [checks, setChecks] = useState<string[]>([]),
    [decision, setDecision] = useState<AdminReview["decision"] | null>(null),
    [success, setSuccess] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    try {
      if (real) {
        // No local capability, URL parameter or e-mail can grant real administrative access.
        await createHttpTransport().request("/admin/me");
        throw Error(
          "O painel real aguarda a integração da sessão, permissões e API administrativa.",
        );
      }
      setStore(await api.load());
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível carregar o painel.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    if (real) return;
    const refresh = () => {
      void load();
    };
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [real]);
  const cases = store ? demoCases(store) : [];
  const current = cases.find((c) => c.id === selected);
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
    setSuccess("");
    setError("");
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
        <Link href="/cliente/perfil">Voltar ao aplicativo</Link>
      </header>
      <main className="admin-main">
        <p className="admin-demo-note">
          {real
            ? "Área restrita · Acesso depende de autorização no servidor."
            : "Acesso administrativo restrito."}
        </p>
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        {loading && <p role="status">Carregando cadastros…</p>}
        {!loading && !store && (
          <section className="panel">
            <h1>Painel indisponível</h1>
            <p>
              A sessão administrativa real ainda não está integrada. Nenhum
              documento foi carregado.
            </p>
            <button className="secondary" onClick={() => void load()}>
              Tentar novamente
            </button>
          </section>
        )}
        {store && (
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
                      {current.photo ? (
                        <img
                          className="admin-face"
                          src={current.photo}
                          alt={`Foto de ${current.registration.fullName}`}
                        />
                      ) : (
                        <p>Foto fictícia não incluída neste exemplo.</p>
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
                        <p>Imagem privada da CNH</p>
                        <small>
                          A imagem da CNH não é exibida por esta interface.
                          visualização real depende de upload privado e
                          autorização do servidor.
                        </small>
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
                </section>
                {current.registration.status === "EM_ANALISE" && (
                  <section className="panel">
                    <h2>Conferência do cadastro</h2>
                    <p>
                      Marque os itens para testar a aprovação. Isso não confirma
                      autenticidade documental.
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
                        disabled={checks.length !== 4}
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
                  {!(store.adminReviews || []).some(
                    (r) => r.caseId === current.id,
                  ) && <p>Nenhuma decisão registrada pelo painel.</p>}
                  <ol className="admin-history">
                    {(store.adminReviews || [])
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
            ? "A decisão será registrada apenas após autorização no servidor."
            : `O prestador verá este motivo ao consultar o cadastro: ${reason.trim()}`
        }
        confirmLabel={
          decision === "APROVADO"
            ? "Confirmar aprovação"
            : "Enviar solicitação de correções"
        }
        cancelLabel="Voltar à análise"
        destructive={false}
        onConfirm={async () => {
          if (!current || !decision || real) return false;
          const latest = await api.load();
          const updated = reviewDemo(
            latest,
            current.id,
            reviewVersion(current),
            decision,
            reason,
          );
          await api.save(updated);
          setStore(updated);
          setSuccess(
            decision === "APROVADO"
              ? "Cadastro aprovado."
              : "Correções solicitadas. O motivo está disponível no cadastro do prestador.",
          );
          setDecision(null);
          return true;
        }}
      />
    </div>
  );
}
