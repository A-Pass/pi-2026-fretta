"use client";
import { useEffect, useRef, useState } from "react";
import {
  Building2,
  Users,
  Truck,
  Copy,
  UserPlus,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import type { Store, FleetDispatch } from "@/contracts";
import { api } from "../../api/client";
import { withNotifications } from "../notifications/rules";
import { createHttpTransport } from "../../api/http";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { SuccessDialog } from "../../components/SuccessDialog";
import { ProposalFormDialog } from "../../components/ProposalFormDialog";
import { VehicleBookView } from "../vehicles/VehicleBookView";
import { vehicleLabel } from "../vehicles/rules";
import { dateTime } from "../../lib/dates";
import { defaultArea, opportunities } from "../driver/rules";
import {
  MANAGER,
  fleetState,
  createDemoCompany,
  lookupDriver,
  inviteDriver,
  invitePending,
  answerInvite,
  cancelInvite,
  cancelDispatch,
  changeMember,
  driverReady,
  saveFleetVehicles,
  assignService,
  answerService,
  sendCompanyProposal,
  employeeServices,
  startCompanyTransport,
  dispatchLive,
} from "./rules";
type Props = {
  initialActor?: string;
  embeddedStore?: Store;
  onSave?: (store: Store) => Promise<boolean>;
};
export function FleetWorkspace({
  initialActor = MANAGER,
  embeddedStore,
  onSave,
}: Props) {
  const [local, setLocal] = useState<Store | null>(embeddedStore || null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(!embeddedStore),
    [busy, setBusy] = useState(false),
    [actor, setActor] = useState(initialActor),
    [tab, setTab] = useState("equipe");
  const [companyName, setCompanyName] = useState(""),
    [code, setCode] = useState(""),
    [found, setFound] = useState<ReturnType<typeof lookupDriver>>(null),
    [copied, setCopied] = useState(false),
    [success, setSuccess] = useState("");
  const [job, setJob] = useState<FleetDispatch | null>(null),
    [assignDriver, setAssignDriver] = useState(""),
    [assignVehicle, setAssignVehicle] = useState(""),
    [assignFreight, setAssignFreight] = useState("");
  const [action, setAction] = useState<{
    title: string;
    description: string;
    label: string;
    run: (s: Store) => Store;
  } | null>(null);
  const [message, setMessage] = useState(""),
    [chat, setChat] = useState<string | null>(null);
  const store = embeddedStore || local,
    real = process.env.NEXT_PUBLIC_API_MODE === "real",
    saving = useRef(false);
  async function load() {
    if (embeddedStore) return;
    setLoading(true);
    setError("");
    try {
      if (real) {
        await createHttpTransport().request("/companies/me");
        throw Error(
          "A integração de contas e permissões da empresa ainda não está disponível.",
        );
      }
      setLocal(await api.load());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível carregar.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    if (embeddedStore) return;
    const sync = () => {
      void load();
    };
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, [embeddedStore]);
  async function commit(transform: (s: Store) => Store) {
    if (saving.current || real) return false;
    saving.current = true;
    setBusy(true);
    setError("");
    try {
      const previous = embeddedStore || (await api.load());
      const next = withNotifications(previous, transform(previous));
      if (onSave) {
        if (!(await onSave(next))) throw Error("Não foi possível salvar.");
      } else await api.save(next);
      setLocal(next);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível salvar.");
      throw e;
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }
  function confirm(
    title: string,
    description: string,
    label: string,
    run: (s: Store) => Store,
  ) {
    setError("");
    setAction({ title, description, label, run });
  }
  async function safe(transform: (s: Store) => Store) {
    try {
      return await commit(transform);
    } catch {
      return false;
    }
  }
  const fleet = store ? fleetState(store) : null,
    manager = actor === MANAGER,
    person = fleet?.people.find((p) => p.id === actor),
    members = fleet?.members.filter((m) => !m.leftAt) || [],
    membership = members.find((m) => m.driverId === actor),
    incoming =
      fleet?.invites.filter((i) => i.driverId === actor && invitePending(i)) ||
      [];
  const myJobs = store ? employeeServices(store, actor) : [],
    selectedChat = fleet?.dispatches.find((d) => d.id === chat),
    chatProposal = store?.proposals.find(
      (p) => p.id === selectedChat?.proposalId,
    );
  const allowedChat =
    selectedChat &&
    (manager || selectedChat.driverId === actor) &&
    !!chatProposal;
  function dispatchStatus(d: FleetDispatch) {
    const f = store?.freights.find((f) => f.id === d.freightId),
      p = store?.proposals.find((p) => p.id === d.proposalId);
    return d.status === "CANCELADA"
      ? "Atribuição retirada pela empresa"
      : d.status === "RECUSADA"
        ? "Recusado pelo motorista"
        : !store || !dispatchLive(store, d)
          ? f?.status === "CONCLUIDO"
            ? "Concluído"
            : "Encerrado"
          : d.status === "PENDENTE"
            ? "Aguardando motorista"
            : !p
              ? "Motorista disponível · enviar proposta"
              : p.status === "PENDENTE"
                ? "Proposta enviada · aguardando cliente"
                : f?.status === "AGENDADO"
                  ? "Agendado"
                  : f?.status === "EM_TRANSPORTE"
                    ? "Em transporte"
                    : "Encerrado";
  }
  function serviceCard(d: FleetDispatch) {
    const f = store!.freights.find((f) => f.id === d.freightId),
      p = fleet!.people.find((p) => p.id === d.driverId),
      proposal = store!.proposals.find((p) => p.id === d.proposalId),
      isContracted = f?.acceptedProposalId === d.proposalId && !!d.proposalId;
    return (
      <article className="panel fleet-service" key={d.id}>
        <span className="fleet-badge">{dispatchStatus(d)}</span>
        <h3>{f?.title || "Solicitação indisponível"}</h3>
        <p>
          {p?.name} · {vehicleLabel(d.vehicle)}
        </p>
        <p>
          {f?.origin} → {f?.destination}
        </p>
        <small>Disponibilizado por {fleet!.company.name}</small>
        <div className="actions">
          {!manager && d.status === "PENDENTE" && dispatchLive(store!, d) && (
            <>
              <button
                className="primary"
                onClick={() =>
                  confirm(
                    "Aceitar este serviço?",
                    "Você confirma disponibilidade. O cliente ainda precisará aceitar a proposta da empresa.",
                    "Aceitar serviço",
                    (s) => answerService(s, actor, d.id, true),
                  )
                }
              >
                Aceitar serviço
              </button>
              <button
                className="secondary"
                onClick={() =>
                  confirm(
                    "Recusar este serviço?",
                    "A empresa será informada. Seu vínculo com a equipe será mantido.",
                    "Recusar serviço",
                    (s) => answerService(s, actor, d.id, false),
                  )
                }
              >
                Recusar serviço
              </button>
            </>
          )}
          {manager && !d.proposalId && dispatchLive(store!, d) && (
            <button
              className="secondary"
              onClick={() =>
                confirm(
                  "Retirar atribuição?",
                  "O motorista deixará de receber esse serviço. Não existe proposta enviada ao cliente.",
                  "Retirar atribuição",
                  (s) => cancelDispatch(s, actor, d.id),
                )
              }
            >
              Retirar atribuição
            </button>
          )}
          {manager &&
            d.status === "ACEITA" &&
            !d.proposalId &&
            dispatchLive(store!, d) && (
              <button className="primary" onClick={() => setJob(d)}>
                Enviar proposta ao cliente
              </button>
            )}
          {!manager && isContracted && f?.status === "AGENDADO" && (
            <button
              className="primary"
              onClick={() =>
                confirm(
                  "Iniciar transporte?",
                  "O cliente será informado do início do transporte.",
                  "Iniciar transporte",
                  (s) => startCompanyTransport(s, actor, d.id),
                )
              }
            >
              Iniciar transporte
            </button>
          )}
          {proposal && (
            <button
              className="secondary"
              onClick={() => {
                setChat(d.id);
                setMessage("");
              }}
            >
              Conversar sobre o frete
            </button>
          )}
        </div>
        {!manager &&
          isContracted &&
          ["AGENDADO", "EM_TRANSPORTE", "CONCLUIDO"].includes(
            f?.status || "",
          ) && (
            <details>
              <summary>Endereços do serviço contratado</summary>
              {(["pickup", "delivery"] as const).map((key) => {
                const a = store!.freightAddresses?.[d.freightId]?.[key];
                return (
                  <p key={key}>
                    <b>{key === "pickup" ? "Retirada" : "Entrega"}: </b>
                    {a
                      ? `${a.street}, ${a.number} · ${a.neighborhood}, ${a.city}/${a.state}`
                      : "Endereço completo não informado neste exemplo."}
                  </p>
                );
              })}
            </details>
          )}
      </article>
    );
  }
  return (
    <div className={embeddedStore ? "fleet-embedded" : "fleet-shell"}>
      {!embeddedStore && (
        <header className="admin-header">
          <a className="brand" href="/">
            FRETTA<span>•</span>
          </a>
          <span>
            <Building2 size={19} />
            Empresa e equipe
          </span>
          <a href="/?perfil=motorista&tela=perfil">Voltar ao aplicativo</a>
        </header>
      )}
      <main className={embeddedStore ? "" : "admin-main"}>
        <p className="admin-demo-note">
          {real
            ? "Área da empresa indisponível até integrar autenticação e permissões no servidor."
            : "DEMONSTRAÇÃO · Contas e convites fictícios neste navegador. Não envia mensagens externas nem gera cobranças."}
        </p>
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        {loading && <p role="status">Carregando equipe…</p>}
        {real && !loading && (
          <section className="panel">
            <h1>Integração pendente</h1>
            <p>Nenhum dado de empresa real foi carregado.</p>
          </section>
        )}
        {!real && store && !fleet && !manager && (
          <section className="panel">
            <h1>Minha equipe e convites</h1>
            <p>
              Você ainda não está vinculado a uma empresa neste exemplo.
              Compartilhe seu código com o gestor.
            </p>
            <code className="fleet-badge">FRT-C7L2T9</code>
            <p>
              Os convites aparecerão aqui quando uma empresa enviar uma
              solicitação.
            </p>
          </section>
        )}
        {!real && store && !fleet && manager && (
          <section className="panel">
            <Building2 size={35} />
            <h1>Prepare sua equipe</h1>
            <p>
              Crie uma empresa fictícia para experimentar convites, veículos e
              atribuições. Os motoristas são analisados separadamente; o gestor
              não aprova documentos.
            </p>
            <label>
              Nome da empresa
              <input
                maxLength={100}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={
                  store.companyProfile?.tradeName || "Ex.: Transportes Exemplo"
                }
              />
            </label>
            <button
              className="primary"
              disabled={busy || companyName.trim().length < 3}
              onClick={() =>
                void safe((s) => createDemoCompany(s, companyName))
              }
            >
              Criar empresa de demonstração
            </button>
          </section>
        )}
        {!real && store && fleet && (
          <>
            {!embeddedStore && (
              <div className="panel fleet-preview">
                <label>
                  Simular conta para testar o fluxo
                  <select
                    value={actor}
                    onChange={(e) => {
                      setActor(e.target.value);
                      setFound(null);
                      setTab("equipe");
                      setChat(null);
                    }}
                  >
                    <option value={MANAGER}>
                      Gestor · {fleet.company.name}
                    </option>
                    {fleet.people.map((p) => (
                      <option key={p.id} value={p.id}>
                        Motorista · {p.name}
                      </option>
                    ))}
                  </select>
                </label>
                <p>
                  Esta seleção serve só à demonstração. Na versão real, a sessão
                  define a identidade e as permissões.
                </p>
              </div>
            )}
            <span className="eyebrow">
              {manager ? "SUA EMPRESA, SUA EQUIPE" : "SEU TRABALHO NA EQUIPE"}
            </span>
            <h1>
              {manager
                ? fleet.company.name
                : `Olá, ${person?.name || "motorista"}`}
            </h1>
            {manager ? (
              <>
                <div
                  className="fleet-tabs"
                  role="group"
                  aria-label="Área da empresa"
                >
                  {[
                    ["equipe", "Equipe", Users],
                    ["veiculos", "Frota", Truck],
                    ["servicos", "Serviços", CheckCircle2],
                    ["plano", "Plano", Building2],
                  ].map(([value, label, Icon]) => {
                    const I = Icon as typeof Users;
                    return (
                      <button
                        key={String(value)}
                        className={tab === value ? "primary" : "secondary"}
                        aria-pressed={tab === value}
                        onClick={() => setTab(String(value))}
                      >
                        <I size={17} />
                        {String(label)}
                      </button>
                    );
                  })}
                </div>
                {tab === "equipe" && (
                  <>
                    <div className="fleet-metrics">
                      <div className="panel">
                        <b>{members.length}</b> motoristas vinculados
                      </div>
                      <div className="panel">
                        <b>{members.filter((m) => m.activeSeat).length}</b>{" "}
                        ativos na demonstração
                      </div>
                      <div className="panel">
                        <b>
                          {fleet.invites.filter((i) => invitePending(i)).length}
                        </b>{" "}
                        convites pendentes
                      </div>
                    </div>
                    <section className="panel">
                      <h2>
                        <UserPlus size={22} />
                        Convidar motorista
                      </h2>
                      <p>
                        Peça o código público do motorista. Confira foto e nome
                        antes de enviar o convite.
                      </p>
                      <form
                        className="fleet-invite-search"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const result = lookupDriver(store, code);
                          setFound(result);
                          setError(
                            result
                              ? ""
                              : "Nenhum motorista encontrado com esse código.",
                          );
                        }}
                      >
                        <label>
                          Código do motorista
                          <input
                            value={code}
                            maxLength={20}
                            placeholder="FRT-7K9P2X"
                            onChange={(e) => {
                              setCode(e.target.value);
                              setFound(null);
                            }}
                          />
                        </label>
                        <button
                          className="secondary"
                          disabled={busy || !code.trim()}
                        >
                          Buscar motorista
                        </button>
                      </form>
                      {found && (
                        <div className="fleet-found">
                          {found.photo && (
                            <img
                              src={found.photo}
                              alt={`Foto de ${found.name}`}
                            />
                          )}
                          <div>
                            <b>{found.name}</b>
                            <p>{found.code}</p>
                          </div>
                          <button
                            className="primary"
                            disabled={busy}
                            onClick={() =>
                              confirm(
                                `Convidar ${found.name}?`,
                                `${fleet.company.name} enviará uma solicitação de vínculo. O motorista precisa aceitar. O convite expira em sete dias.`,
                                "Enviar convite",
                                (s) => inviteDriver(s, actor, found.id),
                              )
                            }
                          >
                            Enviar convite
                          </button>
                        </div>
                      )}
                      <details className="fleet-demo-codes">
                        <summary>Códigos fictícios para testar</summary>
                        {fleet.people.map((p) => (
                          <p key={p.id}>
                            {p.name}: <code>{p.code}</code>
                          </p>
                        ))}
                      </details>
                    </section>
                    <section className="panel">
                      <h2>Convites enviados</h2>
                      {!fleet.invites.length && <p>Nenhum convite enviado.</p>}
                      {fleet.invites
                        .slice()
                        .reverse()
                        .map((i) => (
                          <article className="fleet-member" key={i.id}>
                            <div>
                              <b>
                                {
                                  fleet.people.find((p) => p.id === i.driverId)
                                    ?.name
                                }
                              </b>
                              <p>
                                {i.status === "PENDENTE" && !invitePending(i)
                                  ? "Expirado"
                                  : i.status === "PENDENTE"
                                    ? "Aguardando resposta"
                                    : i.status === "ACEITO"
                                      ? "Aceito"
                                      : i.status === "RECUSADO"
                                        ? "Recusado"
                                        : "Cancelado"}{" "}
                                · até {dateTime(i.expiresAt)}
                              </p>
                            </div>
                            {invitePending(i) && (
                              <button
                                className="secondary"
                                onClick={() =>
                                  confirm(
                                    "Cancelar convite?",
                                    "O convite deixará de poder ser aceito.",
                                    "Cancelar convite",
                                    (s) => cancelInvite(s, actor, i.id),
                                  )
                                }
                              >
                                Cancelar convite
                              </button>
                            )}
                          </article>
                        ))}
                    </section>
                    <section className="panel">
                      <h2>Motoristas da empresa</h2>
                      {!members.length && (
                        <p>
                          Seus motoristas aparecerão aqui após aceitarem o
                          convite.
                        </p>
                      )}
                      {members.map((m) => {
                        const p = fleet.people.find(
                          (p) => p.id === m.driverId,
                        )!;
                        return (
                          <article className="fleet-member" key={m.id}>
                            <div>
                              <b>{p.name}</b>
                              <p>
                                {driverReady(p)
                                  ? "Cadastro aprovado na demonstração"
                                  : "Aguardando aprovação ou regularização do cadastro"}{" "}
                                · {m.activeSeat ? "Ativo" : "Inativo"}
                              </p>
                            </div>
                            <div className="actions">
                              <button
                                className="secondary"
                                disabled={
                                  busy || (!m.activeSeat && !driverReady(p))
                                }
                                onClick={() =>
                                  confirm(
                                    m.activeSeat
                                      ? "Desativar motorista?"
                                      : "Ativar motorista na demonstração?",
                                    "Os valores do plano estão a definir. Esta operação não gera cobrança. Serviços em aberto impedem desativação.",
                                    "Confirmar",
                                    (s) =>
                                      changeMember(
                                        s,
                                        actor,
                                        p.id,
                                        m.activeSeat
                                          ? "deactivate"
                                          : "activate",
                                      ),
                                  )
                                }
                              >
                                {m.activeSeat
                                  ? "Desativar"
                                  : "Ativar na demonstração"}
                              </button>
                              <button
                                className="danger"
                                onClick={() =>
                                  confirm(
                                    "Remover da equipe?",
                                    "O histórico será preservado. Resolva serviços em aberto antes de encerrar o vínculo.",
                                    "Remover vínculo",
                                    (s) =>
                                      changeMember(s, actor, p.id, "remove"),
                                  )
                                }
                              >
                                Remover vínculo
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </section>
                  </>
                )}
                {tab === "veiculos" && (
                  <VehicleBookView
                    companyMode
                    vehicles={fleet.vehicles}
                    onBack={() => setTab("equipe")}
                    onSave={(vehicles) =>
                      commit((s) => saveFleetVehicles(s, actor, vehicles))
                    }
                  />
                )}
                {tab === "plano" && (
                  <section className="panel">
                    <h2>Plano da empresa · valores a definir</h2>
                    <p>
                      A empresa será responsável pelo plano e pelas vagas de
                      motoristas ativos. Os funcionários não recebem uma segunda
                      cobrança.
                    </p>
                    <p>
                      Mensalidade base: <b>A definir</b>
                      <br />
                      Adicional por motorista: <b>A definir</b>
                      <br />
                      Motoristas ativos neste exemplo:{" "}
                      <b>{members.filter((m) => m.activeSeat).length}</b>
                    </p>
                    <p>
                      Nenhuma ativação neste protótipo cobra dinheiro ou cria
                      uma assinatura no Stripe. As regras financeiras ainda
                      dependem da decisão do grupo.
                    </p>
                  </section>
                )}
                {tab === "servicos" && (
                  <>
                    <section className="panel">
                      <h2>Disponibilizar serviço para um motorista</h2>
                      <p>
                        Selecione quem vai dirigir e o veículo. O motorista
                        confirma disponibilidade antes de a empresa enviar o
                        preço ao cliente.
                      </p>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (
                            await safe((s) =>
                              assignService(
                                s,
                                actor,
                                assignDriver,
                                assignVehicle,
                                assignFreight,
                              ),
                            )
                          ) {
                            setSuccess(
                              "Serviço disponibilizado. Aguarde o motorista aceitar para enviar a proposta ao cliente.",
                            );
                            setAssignFreight("");
                          }
                        }}
                      >
                        <div className="fleet-form-grid">
                          <label>
                            Motorista
                            <select
                              required
                              value={assignDriver}
                              onChange={(e) => setAssignDriver(e.target.value)}
                            >
                              <option value="">Selecione</option>
                              {members
                                .filter(
                                  (m) =>
                                    m.activeSeat &&
                                    driverReady(
                                      fleet.people.find(
                                        (p) => p.id === m.driverId,
                                      )!,
                                    ),
                                )
                                .map((m) => (
                                  <option key={m.id} value={m.driverId}>
                                    {
                                      fleet.people.find(
                                        (p) => p.id === m.driverId,
                                      )?.name
                                    }
                                  </option>
                                ))}
                            </select>
                          </label>
                          <label>
                            Veículo da empresa
                            <select
                              required
                              value={assignVehicle}
                              onChange={(e) => setAssignVehicle(e.target.value)}
                            >
                              <option value="">Selecione</option>
                              {fleet.vehicles.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {vehicleLabel(v)}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Solicitação na área
                            <select
                              required
                              value={assignFreight}
                              onChange={(e) => setAssignFreight(e.target.value)}
                            >
                              <option value="">Selecione</option>
                              {opportunities(
                                store,
                                store.operatingArea || defaultArea,
                              ).map(({ freight: f }) => (
                                <option key={f.id} value={f.id}>
                                  {f.title} · {f.vehicle}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <p className="muted">
                          Área usada:{" "}
                          {(store.operatingArea || defaultArea).label}, raio de{" "}
                          {(store.operatingArea || defaultArea).radiusKm} km.
                          Configure a área no início do aplicativo.
                        </p>
                        <button
                          className="primary"
                          disabled={
                            busy ||
                            !assignDriver ||
                            !assignVehicle ||
                            !assignFreight
                          }
                        >
                          Disponibilizar serviço
                        </button>
                      </form>
                    </section>
                    <h2>Serviços da empresa</h2>
                    {!fleet.dispatches.length && (
                      <p>Nenhum serviço disponibilizado.</p>
                    )}
                    {fleet.dispatches.slice().reverse().map(serviceCard)}
                  </>
                )}
              </>
            ) : (
              <>
                {person && (
                  <section className="panel fleet-code">
                    <div>
                      <h2>Meu código de motorista</h2>
                      <code>{person.code}</code>
                      <p>Compartilhe apenas esse código com o gestor.</p>
                    </div>
                    <button
                      className="secondary"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(person.code);
                          setCopied(true);
                        } catch {
                          setError(
                            "Não foi possível copiar. Selecione e copie o código exibido.",
                          );
                        }
                      }}
                    >
                      <Copy size={17} />
                      {copied ? "Código copiado" : "Copiar meu código"}
                    </button>
                  </section>
                )}
                <section className="panel">
                  <h2>Convites para participar de uma empresa</h2>
                  {!incoming.length && <p>Nenhum convite pendente.</p>}
                  {incoming.map((i) => (
                    <article className="fleet-member" key={i.id}>
                      <div>
                        <h3>{fleet.company.name}</h3>
                        <p>
                          Convidou você para fazer parte da equipe. Ao aceitar,
                          você não aprova documentos nem aceita um frete
                          específico.
                        </p>
                        <small>Expira em {dateTime(i.expiresAt)}</small>
                      </div>
                      <div className="actions">
                        <button
                          className="primary"
                          onClick={() =>
                            confirm(
                              "Aceitar convite da empresa?",
                              `Você será vinculado a ${fleet.company.name}. O plano é responsabilidade da empresa. Seu cadastro ainda precisa estar aprovado para operar.`,
                              "Aceitar convite",
                              (s) => answerInvite(s, actor, i.id, true),
                            )
                          }
                        >
                          Aceitar convite
                        </button>
                        <button
                          className="secondary"
                          onClick={() =>
                            confirm(
                              "Recusar convite?",
                              "Você não será vinculado à empresa.",
                              "Recusar convite",
                              (s) => answerInvite(s, actor, i.id, false),
                            )
                          }
                        >
                          Recusar convite
                        </button>
                      </div>
                    </article>
                  ))}
                </section>
                {membership && (
                  <section className="panel">
                    <h2>Minha empresa · {fleet.company.name}</h2>
                    <p>
                      {driverReady(person!)
                        ? "Cadastro aprovado na demonstração."
                        : "Cadastro aguardando análise ou regularização."}{" "}
                      {membership.activeSeat
                        ? "Seu acesso operacional foi ativado pela empresa."
                        : "Aguardando ativação pela empresa. Você não precisa pagar uma assinatura individual para estes serviços."}
                    </p>
                    <button
                      className="danger"
                      onClick={() =>
                        confirm(
                          "Sair da empresa?",
                          "Novas atribuições serão impedidas e o histórico será preservado. Serviços em aberto precisam ser resolvidos antes.",
                          "Encerrar meu vínculo",
                          (s) => changeMember(s, actor, actor, "leave"),
                        )
                      }
                    >
                      Sair da empresa
                    </button>
                  </section>
                )}
                <h2>Serviços disponibilizados para você</h2>
                <p>
                  Este feed mostra apenas as atribuições da sua empresa para sua
                  conta. Ele não oferece solicitações abertas de outros
                  clientes.
                </p>
                {!myJobs.length && (
                  <section className="panel">
                    <Truck size={30} />
                    <h3>Aguardando seu próximo serviço</h3>
                    <p>
                      Quando a empresa disponibilizar um frete para você, ele
                      aparecerá aqui.
                    </p>
                  </section>
                )}
                {myJobs.slice().reverse().map(serviceCard)}
              </>
            )}
            {allowedChat && chatProposal && (
              <section className="panel fleet-chat">
                <div className="section-head">
                  <h2>Conversa do serviço</h2>
                  <button className="secondary" onClick={() => setChat(null)}>
                    Fechar conversa
                  </button>
                </div>
                <p>
                  {
                    store.freights.find((f) => f.id === selectedChat.freightId)
                      ?.title
                  }
                </p>
                <div className="fleet-message-list">
                  {store.messages
                    .filter((m) => m.proposalId === chatProposal.id)
                    .map((m) => (
                      <article key={m.id}>
                        <b>
                          {m.senderName ||
                            (m.role === "cliente"
                              ? "Cliente"
                              : fleet.company.name)}
                        </b>
                        <p>{m.text}</p>
                        <small>{dateTime(m.createdAt)}</small>
                      </article>
                    ))}
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!message.trim()) return;
                    const text = message.trim();
                    if (
                      await safe((s) => {
                        const current = fleetState(s),
                          d = current?.dispatches.find(
                            (d) => d.id === selectedChat.id,
                          );
                        if (
                          !d ||
                          (!manager && d.driverId !== actor) ||
                          !d.proposalId
                        )
                          throw Error("Conversa indisponível.");
                        return {
                          ...s,
                          messages: [
                            ...s.messages,
                            {
                              id: crypto.randomUUID(),
                              freightId: d.freightId,
                              proposalId: d.proposalId,
                              role: "motorista",
                              actorId: actor,
                              senderName: manager
                                ? `${current!.company.name} · gestor`
                                : person!.name,
                              text,
                              createdAt: new Date().toISOString(),
                            },
                          ],
                        };
                      })
                    )
                      setMessage("");
                  }}
                >
                  <label>
                    Mensagem
                    <textarea
                      maxLength={2000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </label>
                  <button
                    className="primary"
                    disabled={busy || !message.trim()}
                  >
                    Enviar mensagem
                  </button>
                </form>
              </section>
            )}
          </>
        )}
      </main>
      <ConfirmDialog
        open={!!action}
        onClose={() => setAction(null)}
        title={action?.title || "Confirmar"}
        description={action?.description || ""}
        confirmLabel={action?.label || "Confirmar"}
        cancelLabel="Voltar"
        destructive={false}
        onConfirm={async () => {
          if (!action) return false;
          const ok = await commit(action.run);
          if (ok) {
            setAction(null);
            setSuccess("Ação registrada na demonstração.");
          }
          return ok;
        }}
      />
      <SuccessDialog
        open={!!success}
        title="Tudo certo!"
        description={success}
        onClose={() => setSuccess("")}
      />
      {job && fleet && (
        <ProposalFormDialog
          vehicles={[job.vehicle]}
          onManageVehicles={() => {
            setJob(null);
            setTab("veiculos");
          }}
          onClose={() => setJob(null)}
          onSubmit={async (offer) => {
            const ok = await commit((s) =>
              sendCompanyProposal(s, actor, job.id, offer),
            );
            if (ok)
              setSuccess(
                "Proposta enviada ao cliente com empresa, motorista e veículo identificados.",
              );
            return ok;
          }}
        />
      )}
    </div>
  );
}
