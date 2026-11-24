"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminReviewHeader } from "./AdminReviewHeader";
import { AdminReviewNav } from "./AdminReviewNav";
import { useEffect, useState } from "react";
import { createHttpTransport } from "../../api/http";
import { ConfirmDialog } from "../../components/ConfirmDialog";

const labels = {
  EM_ANALISE: "Em análise",
  AJUSTES_SOLICITADOS: "Ajustes solicitados",
  APROVADO: "Aprovado",
} as const;
type Status = keyof typeof labels;

const http = createHttpTransport();

type Review = {
  id: string;
  nome: string;
  cadastroStatus: Status;
  motivoAjuste: string | null;
  razaoSocial: string;
  cnpj: string;
  responsavelNome: string;
  responsavelEmail: string;
  atualizadoEm: string;
  documentoCnpjId: string | null;
};

export function CompanyReviewPanel() {
  const [filter, setFilter] = useState<Status | "TODOS">("TODOS");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Review[] | null>(null);
  const [target, setTarget] = useState<Review | null>(null);
  const [reason, setReason] = useState("");
  const [decision, setDecision] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(signal?: AbortSignal) {
    setLoading(true);
    try {
      const records = await http.request<Review[]>(
        `/company/review?status=${filter}`,
        {
          signal,
        },
      );
      if (!signal?.aborted) {
        setRows(records);
        setError("");
      }
    } catch (error) {
      if (!signal?.aborted)
        setError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os cadastros.",
        );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [filter]);

  const search = query.trim().toLocaleLowerCase("pt-BR");
  const cnpj = search.replace(/[.\/\s-]/g, "");
  const visible =
    rows?.filter(
      (row) =>
        [row.nome, row.razaoSocial].some((name) =>
          name.toLocaleLowerCase("pt-BR").includes(search),
        ) ||
        (/^\d+$/.test(cnpj) && row.cnpj.includes(cnpj)),
    ) ?? [];

  return (
    <div className="admin-shell">
      <AdminReviewHeader allowed={rows !== null} onError={setError} />
      <main className="admin-main admin-review">
        {rows ? (
          <AdminReviewNav current="companies" />
        ) : (
          <Link href="/admin" className="secondary real-freight-link">
            Voltar à administração
          </Link>
        )}
        {target && (
          <button
            type="button"
            className="secondary admin-review-back"
            onClick={() => {
              setTarget(null);
              setReason("");
              setError("");
            }}
          >
            <ArrowLeft size={16} aria-hidden="true" /> Voltar às empresas
          </button>
        )}
        <h1>{target ? "Detalhes da empresa" : "Análise de empresas"}</h1>
        {rows && !target && (
          <>
            <section className="panel" aria-label="Filtros de empresas">
              <div className="admin-filters">
                <label>
                  Buscar nesta página
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Nome ou CNPJ"
                  />
                </label>
                <label>
                  Situação
                  <select
                    value={filter}
                    disabled={loading || busy}
                    onChange={(event) => {
                      setTarget(null);
                      setFilter(event.target.value as Status | "TODOS");
                    }}
                  >
                    <option value="TODOS">Todas</option>
                    {Object.entries(labels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="secondary"
                  disabled={busy || loading}
                  onClick={() => void load()}
                >
                  {loading ? "Atualizando…" : "Atualizar"}
                </button>
              </div>
            </section>
            <section
              className="panel"
              aria-label="Resultados da busca de empresas"
            >
              {loading && <p role="status">Carregando cadastros…</p>}
              {!loading && visible.length === 0 && (
                <p>Nenhum cadastro encontrado nesta página.</p>
              )}
              {!loading && visible.length > 0 && (
                <div className="admin-case-list admin-case-list-compact">
                  {visible.map((row) => (
                    <article key={row.id}>
                      <h2>{row.nome}</h2>
                      <span
                        className="admin-status"
                        data-status={row.cadastroStatus}
                      >
                        {labels[row.cadastroStatus]}
                      </span>
                      <button
                        type="button"
                        className="secondary"
                        aria-label={`Ver detalhes de ${row.nome}`}
                        onClick={() => {
                          setTarget(row);
                          setReason("");
                        }}
                      >
                        Ver detalhes
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
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
        {!rows && !error && <p role="status">Carregando cadastros…</p>}
        {target && (
          <>
            <section className="panel">
              <div className="section-head">
                <h2>{target.nome}</h2>
                <span
                  className="admin-status"
                  data-status={target.cadastroStatus}
                >
                  {labels[target.cadastroStatus]}
                </span>
              </div>
              <dl className="company-review-data">
                <dt>Nome registrado no CNPJ</dt>
                <dd>{target.razaoSocial}</dd>
                <dt>CNPJ</dt>
                <dd>{target.cnpj}</dd>
                <dt>Responsável</dt>
                <dd>
                  {target.responsavelNome} · {target.responsavelEmail}
                </dd>
              </dl>
              {target.documentoCnpjId ? (
                <a
                  className="secondary real-freight-link"
                  href={`/api/v1/uploads/${target.documentoCnpjId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visualizar comprovante do CNPJ
                </a>
              ) : (
                <p>Comprovante do CNPJ ainda não enviado.</p>
              )}
              {target.motivoAjuste && (
                <div>
                  <h3>Motivo dos ajustes</h3>
                  <p>{target.motivoAjuste}</p>
                </div>
              )}
              {target.cadastroStatus === "EM_ANALISE" && (
                <div className="company-review-actions">
                  <label>
                    Motivo dos ajustes
                    <textarea
                      maxLength={1000}
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                    />
                  </label>
                  <div className="proposal-actions">
                    <button
                      className="secondary"
                      disabled={busy || !reason.trim()}
                      onClick={() => setDecision(false)}
                    >
                      Solicitar ajustes
                    </button>
                    <button
                      className="primary"
                      disabled={busy || !target.documentoCnpjId}
                      onClick={() => setDecision(true)}
                    >
                      Aprovar cadastro
                    </button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
        {target && decision !== null && (
          <ConfirmDialog
            title={
              decision
                ? "Aprovar cadastro da empresa?"
                : "Solicitar ajustes no cadastro?"
            }
            description={target.nome}
            confirmLabel={decision ? "Aprovar cadastro" : "Solicitar ajustes"}
            open
            cancelLabel="Voltar"
            destructive={!decision}
            onClose={() => setDecision(null)}
            onConfirm={async () => {
              setBusy(true);
              setError("");
              try {
                const updated = await http.request<Review>(
                  `/company/review/${target.id}`,
                  {
                    method: "POST",
                    body: {
                      approve: decision,
                      reason,
                      version: target.atualizadoEm,
                    },
                  },
                );
                setNotice(
                  decision ? "Cadastro aprovado." : "Ajustes solicitados.",
                );
                setDecision(null);
                setTarget(null);
                if (filter === "TODOS" || filter === updated.cadastroStatus) {
                  setRows(
                    (current) =>
                      current?.map((row) =>
                        row.id === updated.id ? updated : row,
                      ) ?? [updated],
                  );
                } else {
                  setFilter(updated.cadastroStatus);
                }
                return true;
              } catch (error) {
                throw new Error(
                  error instanceof Error
                    ? error.message
                    : "Não foi possível salvar a decisão.",
                );
              } finally {
                setBusy(false);
              }
            }}
          />
        )}
      </main>
    </div>
  );
}
