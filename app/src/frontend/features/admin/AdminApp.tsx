"use client";
import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Camera,
  IdCard,
  Truck,
} from "lucide-react";
import type { Store, CorrectionItem } from "@/contracts";
import { api } from "../../api/client";
import { createHttpTransport } from "../../api/http";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { SuccessDialog } from "../../components/SuccessDialog";
import { useDiscardChanges } from "../../components/useDiscardChanges";
import { DocumentViewer } from "./DocumentViewer";
import { dateTime } from "../../lib/dates";
import {
  demoCases,
  caseWarnings,
  correctionLabels,
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
  const real = process.env.NEXT_PUBLIC_API_MODE === "real";
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
  const [items, setItems] = useState<CorrectionItem[]>([]);
  const [preview, setPreview] = useState<{ src: string; title: string } | null>(
    null,
  );
  const [stale, setStale] = useState(false);
  const dirty =
    !!selected &&
    !!store &&
    demoCases(store).some(
      (c) => c.id === selected && c.registration.status === "EM_ANALISE",
    ) &&
    (!!reason.trim() || checks.length > 0 || items.length > 0);
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  const discard = useDiscardChanges(dirty);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
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
      setStale(false);
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
      if (dirtyRef.current) {
        setStale(true);
        return;
      }
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
    setItems([]);
    setSuccess("");
    setError("");
  }
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <a
          className="brand"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            discard.leave(() => {
              location.href = "/";
            });
          }}
        >
          FRETTA<span>•</span>
        </a>
        <span>
          <ShieldCheck size={19} /> Administração
        </span>
        <a
          href="/?perfil=cliente&tela=perfil"
          onClick={(e) => {
            e.preventDefault();
            discard.leave(() => {
              location.href = "/?perfil=cliente&tela=perfil";
            });
          }}
        >
          Voltar ao aplicativo
        </a>
      </header>
      <main className="admin-main">
        <p className="admin-demo-note">
          {real
            ? "Área restrita · Acesso depende de autorização no servidor."
            : "PAINEL DE DEMONSTRAÇÃO · Administrador fictício. Não use documentos reais. As decisões afetam somente os exemplos deste navegador e não concedem permissão administrativa real."}
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
                    discard.leave(() => {
                      setFilter(status);
                      setLimit(12);
                      setSelected(null);
                    });
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
                        <p className="admin-submission">
                          {(c.registration.submissionCount || 1) > 1
                            ? `Reenviado após correções/atualização · envio ${c.registration.submissionCount}`
                            : "Primeiro envio"}
                        </p>
                        {caseWarnings(c).length > 0 && (
                          <p className="admin-warning-count">
                            {caseWarnings(c).length} pendência(s) para conferir
                          </p>
                        )}
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
                    discard.leave(() => {
                      setSelected(null);
                      setError("");
                      setSuccess("");
                    });
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
                  <p className="admin-submission">
                    {(current.registration.submissionCount || 1) > 1
                      ? `Reenvio · envio ${current.registration.submissionCount}`
                      : "Primeiro envio"}
                  </p>
                  {(() => {
                    const previous = (store.adminReviews || [])
                      .filter(
                        (r) =>
                          r.caseId === current.id &&
                          r.decision === "AJUSTES_SOLICITADOS",
                      )
                      .at(-1);
                    return (
                      previous && (
                        <div className="admin-previous">
                          <h3>Últimas correções solicitadas</h3>
                          <p>{previous.reason}</p>
                          <p>
                            {(previous.correctionItems || [])
                              .map((i) => correctionLabels[i])
                              .join(" · ")}
                          </p>
                          <small>{dateTime(previous.at)}</small>
                        </div>
                      )
                    );
                  })()}
                  {caseWarnings(current).length > 0 && (
                    <div className="admin-warnings" role="status">
                      <h3>Pendências que impedem aprovação</h3>
                      <ul>
                        {caseWarnings(current).map((w) => (
                          <li key={w}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {stale && (
                    <p className="alert">
                      Pode haver uma atualização em outra aba. Suas observações
                      foram mantidas. A confirmação verificará a versão antes de
                      salvar.
                    </p>
                  )}
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
                        <button
                          className="admin-photo-button"
                          onClick={() =>
                            setPreview({
                              src: current.photo,
                              title: `Foto de ${current.registration.fullName}`,
                            })
                          }
                        >
                          <img
                            className="admin-face"
                            src={current.photo}
                            alt={`Foto de ${current.registration.fullName}`}
                          />
                          <span>Ampliar foto</span>
                        </button>
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
                          A CNH real não fica salva nesta demonstração. A
                          visualização real depende do armazenamento privado.
                        </small>
                        {["example-0", "example-1"].includes(current.id) ? (
                          <button
                            className="secondary"
                            onClick={() =>
                              setPreview({
                                src: "/admin-document-example.svg",
                                title: "Documento fictício · sem valor legal",
                              })
                            }
                          >
                            Visualizar documento fictício
                          </button>
                        ) : (
                          <p>
                            Documento indisponível na demonstração. Nenhuma CNH
                            real foi guardada.
                          </p>
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
                    <p>
                      {current.fleetCompanyId
                        ? "Motorista vinculado a uma empresa. O veículo será selecionado pela gestão em cada serviço."
                        : "Nenhum veículo cadastrado."}
                    </p>
                  )}
                  {current.registration.feedback && (
                    <p className="alert">
                      Correções solicitadas: {current.registration.feedback}
                    </p>
                  )}
                </section>
                {current.registration.status === "EM_ANALISE" && (
                  <section className="panel admin-review-panel">
                    <div className="admin-review-heading">
                      <div>
                        <span className="eyebrow">REVISÃO DO PRESTADOR</span>
                        <h2>Conferência do cadastro</h2>
                      </div>
                      <span
                        className={`admin-review-count ${checks.length === 4 ? "complete" : ""}`}
                        role="status"
                      >
                        <CheckCircle2 size={17} />
                        {checks.length} de 4 conferidos
                      </span>
                    </div>
                    <div className="admin-review-progress" aria-hidden="true">
                      <span style={{ width: `${checks.length * 25}%` }} />
                    </div>
                    <p>
                      Marque os itens para testar a aprovação. Isso não confirma
                      autenticidade documental.
                    </p>
                    <div className="admin-checks">
                      {[
                        {
                          label: "Identificação e dados conferidos",
                          description:
                            "Confira nome e informações do cadastro.",
                          Icon: UserRound,
                        },
                        {
                          label: "Foto do motorista conferida",
                          description:
                            "Verifique se o rosto está visível e nítido.",
                          Icon: Camera,
                        },
                        {
                          label: "Habilitação e validade conferidas",
                          description:
                            "Confira os dados e o vencimento da CNH.",
                          Icon: IdCard,
                        },
                        {
                          label: "Veículo e habilitação compatíveis",
                          description:
                            "Revise o veículo e a categoria informada.",
                          Icon: Truck,
                        },
                      ].map(({ label, description, Icon }) => (
                        <label
                          key={label}
                          className={`admin-check-card ${checks.includes(label) ? "is-checked" : ""}`}
                        >
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
                          <span className="admin-check-icon" aria-hidden="true">
                            <Icon size={22} />
                          </span>
                          <span className="admin-check-copy">
                            <strong>{label}</strong>
                            <small>{description}</small>
                          </span>
                        </label>
                      ))}
                    </div>
                    <fieldset className="admin-correction-items">
                      <legend>O que precisa ser corrigido?</legend>
                      <p>Selecione os itens que o motorista deverá revisar.</p>
                      {Object.entries(correctionLabels).map(
                        ([value, label]) => (
                          <label
                            key={value}
                            className={
                              items.includes(value as CorrectionItem)
                                ? "is-selected"
                                : ""
                            }
                          >
                            <input
                              type="checkbox"
                              checked={items.includes(value as CorrectionItem)}
                              onChange={(e) =>
                                setItems((old) =>
                                  e.target.checked
                                    ? [...old, value as CorrectionItem]
                                    : old.filter((i) => i !== value),
                                )
                              }
                            />
                            <span>{label}</span>
                          </label>
                        ),
                      )}
                    </fieldset>
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
                        disabled={
                          reason.trim().length < 10 || !items.length || loading
                        }
                        onClick={() => setDecision("AJUSTES_SOLICITADOS")}
                      >
                        Solicitar correções
                      </button>
                      <button
                        className="primary"
                        disabled={
                          checks.length !== 4 ||
                          caseWarnings(current).length > 0 ||
                          loading
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
                          {r.correctionItems?.length ? (
                            <p>
                              Itens:{" "}
                              {r.correctionItems
                                .map((i) => correctionLabels[i])
                                .join(" · ")}
                            </p>
                          ) : null}
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
            ? "A aprovação será registrada no histórico de demonstração. Não representa verificação oficial dos documentos."
            : `Itens: ${items.map((i) => correctionLabels[i]).join(", ")}. O prestador verá este motivo: ${reason.trim()}`
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
            new Date().toISOString(),
            items,
          );
          await api.save(updated);
          setStore(updated);
          setSuccess(
            decision === "APROVADO"
              ? "Cadastro aprovado na demonstração."
              : "Correções solicitadas. O motivo está disponível no cadastro do prestador.",
          );
          setDecision(null);
          return true;
        }}
      />
      {discard.dialog}
      <DocumentViewer source={preview} onClose={() => setPreview(null)} />
      <SuccessDialog
        open={!!success}
        title={
          current?.registration.status === "APROVADO"
            ? "Cadastro aprovado!"
            : "Correções solicitadas!"
        }
        description={success}
        onClose={() => setSuccess("")}
      />
    </div>
  );
}
