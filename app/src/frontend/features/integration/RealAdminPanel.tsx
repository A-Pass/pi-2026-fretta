"use client";
import { AdminReviewHeader } from "./AdminReviewHeader";
import { AdminReviewNav } from "./AdminReviewNav";
import { correctionItems } from "@/contracts/driver-corrections";
import { useEffect, useState } from "react";
import { createHttpTransport } from "../../api/http";
import { authClient } from "../../api/auth-client";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { SuccessDialog } from "../../components/SuccessDialog";
import { DocumentViewer } from "../admin/DocumentViewer";
import { useDiscardChanges } from "../../components/useDiscardChanges";
import { dateTime } from "../../lib/dates";
type Status = "EM_ANALISE" | "APROVADO" | "AJUSTES_SOLICITADOS";
type Row = {
  id: string;
  motoristaId: string;
  nome: string;
  tipoPessoa: string;
  status: Status;
  enviadoEm: string;
  atualizadoEm: string;
};
type Detail = {
  id: string;
  motoristaId: string;
  nomeCompleto: string;
  tipoPessoa: string;
  cpf: string | null;
  cnpj: string | null;
  razaoSocial: string | null;
  cnh: { numero: string; categoria: string; validade: string };
  documentos: { fotoPerfilId: string | null; documentoCnhId: string | null };
  veiculo: {
    modelo: string;
    placa: string;
    categoria: string;
    ativo: boolean;
  } | null;
  status: Status;
  motivoAjuste: string | null;
  itensAjuste: string[];
  itensConferidos: string[];
  enviadoEm: string;
  analisadoEm: string | null;
  atualizadoEm: string;
};
const http = createHttpTransport(),
  labels = {
    EM_ANALISE: "Em análise",
    APROVADO: "Aprovado",
    AJUSTES_SOLICITADOS: "Ajustes solicitados",
  };
export function RealAdminPanel() {
  const [allowed, setAllowed] = useState(false),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [rows, setRows] = useState<Row[]>([]),
    [cursor, setCursor] = useState<string | null>(null),
    [filter, setFilter] = useState("EM_ANALISE"),
    [query, setQuery] = useState(""),
    [detail, setDetail] = useState<Detail | null>(null),
    [checks, setChecks] = useState<string[]>([]),
    [reason, setReason] = useState(""),
    [decision, setDecision] = useState<Status | null>(null),
    [success, setSuccess] = useState(""),
    [preview, setPreview] = useState<{ src: string; title: string } | null>(
      null,
    );
  const discard = useDiscardChanges(
    !!detail &&
      detail.status === "EM_ANALISE" &&
      (checks.length !== detail.itensConferidos.length ||
        checks.some((check) => !detail.itensConferidos.includes(check)) ||
        !!reason),
  );
  async function list(append = false) {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (filter !== "TODOS") p.set("status", filter);
      if (append && cursor) p.set("cursor", cursor);
      const page = await http.request<{
        items: Row[];
        nextCursor: string | null;
      }>(`/admin/driver-registrations?${p}`);
      setRows((old) => (append ? [...old, ...page.items] : page.items));
      setCursor(page.nextCursor);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível carregar.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    http
      .request("/admin/me")
      .then(() => {
        if (active) setAllowed(true);
      })
      .catch((e) => {
        if (active) {
          setAllowed(false);
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (allowed) void list();
  }, [allowed, filter]);
  async function open(id: string) {
    setLoading(true);
    setError("");
    try {
      const data = await http.request<Detail>(
        `/admin/driver-registrations/${encodeURIComponent(id)}`,
      );
      setDetail(data);
      setChecks(data.itensConferidos);
      setReason(
        data.status === "AJUSTES_SOLICITADOS" ? (data.motivoAjuste ?? "") : "",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível abrir.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="admin-shell">
      <AdminReviewHeader
        allowed={allowed}
        onError={setError}
        beforeLeaving={discard.leave}
      />
      <main className="admin-main admin-review">
        {allowed && <AdminReviewNav current="drivers" />}
        <h1>Análise de motoristas</h1>
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        {loading && <p role="status">Carregando…</p>}
        {!allowed && !loading && (
          <section className="panel">
            <h2>Acesso não autorizado ou indisponível</h2>
            <p>
              Entre com uma conta autorizada. Conhecer esta URL não concede
              permissão.
            </p>
            <button
              className="primary"
              onClick={async () => {
                const result = await authClient.signIn.social({
                  provider: "google",
                  callbackURL: `${location.origin}/admin`,
                });
                if (result.error)
                  setError(result.error.message || "Não foi possível entrar.");
              }}
            >
              Entrar com Google
            </button>
          </section>
        )}
        {allowed && !detail && (
          <>
            <section className="panel" aria-label="Filtros de motoristas">
              <div className="admin-filters">
                <label>
                  Buscar nesta página
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Nome do motorista"
                  />
                </label>
                <label>
                  Situação
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="TODOS">Todas</option>
                    {Object.entries(labels).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="secondary"
                  disabled={loading}
                  onClick={() => void list()}
                >
                  {loading ? "Atualizando…" : "Atualizar"}
                </button>
              </div>
            </section>
            <section
              className="panel"
              aria-label="Resultados da busca de motoristas"
            >
              <div className="admin-case-list admin-case-list-compact">
                {rows
                  .filter((r) =>
                    r.nome.toLowerCase().includes(query.toLowerCase()),
                  )
                  .map((r) => (
                    <article key={r.id}>
                      <h2>{r.nome}</h2>
                      <span className="admin-status" data-status={r.status}>
                        {labels[r.status]}
                      </span>
                      <button
                        className="secondary"
                        aria-label={`Ver detalhes de ${r.nome}`}
                        onClick={() => void open(r.id)}
                      >
                        Ver detalhes
                      </button>
                    </article>
                  ))}
              </div>
              {!rows.length && !loading && <p>Nenhum cadastro encontrado.</p>}
              {cursor && (
                <button
                  disabled={loading}
                  className="secondary"
                  onClick={() => void list(true)}
                >
                  Carregar mais cadastros
                </button>
              )}
            </section>
          </>
        )}
        {allowed && detail && (
          <>
            <button
              className="back"
              onClick={() =>
                discard.leave(() => {
                  setDetail(null);
                  setError("");
                })
              }
            >
              Voltar aos cadastros
            </button>
            <section className="panel">
              <div className="section-head">
                <h2>{detail.nomeCompleto}</h2>
                <span className="admin-status" data-status={detail.status}>
                  {labels[detail.status]}
                </span>
              </div>
              <div className="admin-detail-grid">
                <div>
                  <h3>Identificação</h3>
                  <p>
                    {detail.tipoPessoa === "PJ" ? "Empresa" : "Pessoa física"}
                  </p>
                  <p>CPF: {detail.cpf || "Não informado"}</p>
                  {detail.cnpj && <p>CNPJ: {detail.cnpj}</p>}
                  {detail.razaoSocial && <p>{detail.razaoSocial}</p>}
                  <p>Enviado em {dateTime(detail.enviadoEm)}</p>
                  {detail.documentos.fotoPerfilId && (
                    <button
                      className="secondary"
                      onClick={() =>
                        setPreview({
                          src: `/api/v1/driver/registration/documents/${encodeURIComponent(detail.documentos.fotoPerfilId!)}`,
                          title: `Foto de ${detail.nomeCompleto}`,
                        })
                      }
                    >
                      Visualizar foto
                    </button>
                  )}
                </div>
                <div>
                  <h3>Habilitação</h3>
                  <p>Registro: {detail.cnh.numero}</p>
                  <p>
                    Categoria {detail.cnh.categoria} · Validade{" "}
                    {dateTime(detail.cnh.validade)}
                  </p>
                  {detail.documentos.documentoCnhId && (
                    <button
                      className="secondary"
                      onClick={() =>
                        setPreview({
                          src: `/api/v1/driver/registration/documents/${encodeURIComponent(detail.documentos.documentoCnhId!)}`,
                          title: "CNH · acesso privado",
                        })
                      }
                    >
                      Visualizar CNH
                    </button>
                  )}
                </div>
              </div>
              <h3>Veículo</h3>
              <p>
                {detail.veiculo
                  ? `${detail.veiculo.modelo} · ${detail.veiculo.placa} · ${detail.veiculo.categoria}`
                  : "Nenhum veículo informado"}
              </p>
              {detail.motivoAjuste && (
                <p className="alert">{detail.motivoAjuste}</p>
              )}
              {detail.analisadoEm && (
                <p>
                  Analisado em {dateTime(detail.analisadoEm)}. O histórico
                  completo de revisões ainda não é retornado por esta API.
                </p>
              )}
            </section>
            {(detail.status === "EM_ANALISE" ||
              (detail.status === "AJUSTES_SOLICITADOS" &&
                !detail.itensAjuste.length)) && (
              <section className="panel admin-review-panel">
                <h2>Conferência do cadastro</h2>
                <p>
                  Marque os itens conferidos. Os itens desmarcados serão
                  solicitados ao motorista.
                </p>
                <div className="admin-checks">
                  {correctionItems.map(({ id, label }) => (
                    <label
                      className={`admin-check-card ${checks.includes(id) ? "is-checked" : ""}`}
                      key={id}
                    >
                      <input
                        type="checkbox"
                        checked={checks.includes(id)}
                        onChange={(e) =>
                          setChecks((c) =>
                            e.target.checked
                              ? [...c, id]
                              : c.filter((x) => x !== id),
                          )
                        }
                      />
                      <strong>{label}</strong>
                    </label>
                  ))}
                </div>
                <label>
                  Motivo das correções
                  <textarea
                    maxLength={1000}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </label>
                <div className="actions">
                  <button
                    className="secondary"
                    disabled={
                      reason.trim().length < 10 ||
                      checks.length === correctionItems.length ||
                      loading
                    }
                    onClick={() => setDecision("AJUSTES_SOLICITADOS")}
                  >
                    Solicitar correções
                  </button>
                  <button
                    className="primary"
                    disabled={
                      detail.status !== "EM_ANALISE" ||
                      checks.length !== 4 ||
                      loading ||
                      !detail.documentos.documentoCnhId ||
                      !detail.documentos.fotoPerfilId ||
                      !detail.veiculo?.ativo ||
                      detail.cnh.validade.slice(0, 10) <
                        new Date().toLocaleDateString("sv-SE")
                    }
                    onClick={() => setDecision("APROVADO")}
                  >
                    Aprovar cadastro
                  </button>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <ConfirmDialog
        open={!!decision}
        onClose={() => setDecision(null)}
        title={
          decision === "APROVADO"
            ? "Aprovar este cadastro?"
            : "Solicitar correções?"
        }
        description={
          decision === "APROVADO"
            ? "A situação será atualizada no banco e o motorista poderá consultar o resultado."
            : reason
        }
        confirmLabel="Confirmar decisão"
        cancelLabel="Voltar"
        destructive={false}
        onConfirm={async () => {
          if (!detail || !decision) return false;
          await http.request("/admin/driver/registration", {
            method: "PATCH",
            body: {
              motoristaId: detail.motoristaId,
              status: decision,
              motivoAjuste:
                decision === "AJUSTES_SOLICITADOS" ? reason : undefined,
              itensAjuste:
                decision === "AJUSTES_SOLICITADOS"
                  ? correctionItems
                      .filter((item) => !checks.includes(item.id))
                      .map((item) => item.id)
                  : undefined,
              expectedUpdatedAt: detail.atualizadoEm,
            },
          });
          setDecision(null);
          setSuccess("Decisão registrada no servidor.");
          await open(detail.id);
          await list();
          return true;
        }}
      />
      {discard.dialog}
      <DocumentViewer
        source={preview}
        onClose={() => setPreview(null)}
        demo={false}
      />
      <SuccessDialog
        open={!!success}
        title="Decisão registrada"
        description={success}
        onClose={() => setSuccess("")}
      />
    </div>
  );
}
