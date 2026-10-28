"use client";
import { SuccessDialog } from "../components/SuccessDialog";
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

import { useEffect, useState, type FormEvent } from "react";
import {
  Truck,
  Home,
  Package,
  MessageCircle,
  User,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Plus,
  Star,
  Bell,
  Check,
  Search,
  X,
} from "lucide-react";
import type {
  Role,
  Store,
  Freight,
  Proposal,
  FreightRequestDraft,
} from "@/contracts";
import { api, resetDemo } from "../api/client";
import { acceptProposal, money } from "./freights/rules";
import { statusLabels as labels, StatusBadge } from "../components/StatusBadge";
import { EmptyState } from "../components/EmptyState";
export function FrettaApp() {
  const [store, setStore] = useState<Store | null>(null),
    [role, setRole] = useState<Role>("cliente"),
    [entered, setEntered] = useState(false),
    [loginRequested, setLoginRequested] = useState(false),
    [tab, setTab] = useState("inicio"),
    [selected, setSelected] = useState<string | null>(null),
    [modal, setModal] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [success, setSuccess] = useState<"proposal" | "request" | null>(null),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("TODOS"),
    [chatId, setChatId] = useState(""),
    [subscription, setSubscription] = useState(true),
    [name, setName] = useState("Clayton"),
    [profilePhoto, setProfilePhoto] = useState("");
  useEffect(() => {
    api
      .load()
      .then(setStore)
      .catch((e) => setError(e.message));
  }, []);
  async function save(next: Store) {
    try {
      await api.save(next);
      setStore(next);
      setError("");
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao salvar");
      return false;
    }
  }
  function flash(s: string) {
    setNotice(s);
  }
  const f = store?.freights.find((f) => f.id === selected);
  const proposals =
    store?.proposals.filter(
      (p) =>
        p.freightId === selected &&
        (role === "cliente" || ownProposal(p, name)),
    ) || [];
  const accepted = proposals.find((p) => p.status === "ACEITA");
  async function createRequest(draft: FreightRequestDraft): Promise<boolean> {
    if (!store) return false;
    const next = buildRequest(store, draft);
    const id = next.freights[0].id;
    const ok = await save(next);
    if (ok) {
      setModal("");
      setSelected(id);
      setTab("fretes");
      setNotice("");
      setSuccess("request");
    }
    return ok;
  }
  async function propose(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!store || !f) return;
    const d = new FormData(e.currentTarget);
    const price = Math.round(Number(d.get("price")) * 100);
    if (new Date(String(d.get("date"))).getTime() < Date.now()) {
      setError("Escolha uma disponibilidade futura.");
      return;
    }
    if (!Number.isSafeInteger(price) || price <= 0) {
      setError("Informe um valor positivo.");
      return;
    }
    if (
      store.proposals.some(
        (p) =>
          p.freightId === f.id &&
          ownProposal(p, name) &&
          p.status === "PENDENTE",
      )
    ) {
      setError("Você já enviou uma proposta para este frete.");
      return;
    }
    const p: Proposal = {
      id: crypto.randomUUID(),
      freightId: f.id,
      driver: name,
      driverId: "demo-driver",
      rating: 0,
      vehicle: "Veículo de demonstração",
      priceCents: price,
      availableAt: String(d.get("date")),
      message: String(d.get("message")),
      status: "PENDENTE",
    };
    if (await save({ ...store, proposals: [...store.proposals, p] })) {
      setModal("");
      setNotice("");
      setSuccess("proposal");
    }
  }
  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!store) return;
    const form = e.currentTarget,
      d = new FormData(form),
      text = String(d.get("text")).trim(),
      p = store.proposals.find((p) => p.id === chatId);
    if (!text || !p) return;
    if (
      await save({
        ...store,
        messages: [
          ...store.messages,
          {
            id: crypto.randomUUID(),
            freightId: p.freightId,
            proposalId: p.id,
            role,
            text,
            createdAt: new Date().toISOString(),
          },
        ],
      })
    )
      form.reset();
  }
  const schedule = (f: Freight) =>
    f.schedule.kind === "combinar"
      ? "Data a combinar"
      : f.schedule.kind === "intervalo"
        ? `${f.schedule.start} a ${f.schedule.end}`
        : f.schedule.start;
  function nav(id: string) {
    setTab(id);
    setChatId("");
    setSelected(null);
    setQuery("");
    setFilter("TODOS");
  }
  if (!entered && loginRequested)
    return (
      <LoginView
        role={role}
        onBack={() => setLoginRequested(false)}
        onContinue={() => {
          nav("inicio");
          setName("Clayton");
          setEntered(true);
        }}
      />
    );
  if (!entered)
    return (
      <WelcomeView
        role={role}
        setRole={setRole}
        onEnter={() => setLoginRequested(true)}
      />
    );
  if (!store)
    return (
      <main className="loading">
        <Truck />
        <h1>
          {error ? "Não foi possível carregar" : "Preparando seu caminho…"}
        </h1>
        {error && (
          <>
            <p role="alert">{error}</p>
            <button onClick={resetDemo}>Restaurar demonstração</button>
          </>
        )}
      </main>
    );
  let list = store.freights.filter(
    (x) =>
      (role === "cliente" || x.status === "ABERTO" || tab === "fretes") &&
      `${x.title} ${x.origin} ${x.destination}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === "TODOS" || x.status === filter),
  );
  return (
    <div className="shell">
      <aside>
        <button className="brand" onClick={() => nav("inicio")}>
          <Truck /> FRETTA<span>•</span>
        </button>
        <p className="sidebar-label">SEU PRÓXIMO CAMINHO</p>
        <nav>
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
            return (
              <button
                className={
                  tab === id || (id === "perfil" && tab === "enderecos")
                    ? "active"
                    : ""
                }
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
            onClick={() => {
              setRole(role === "cliente" ? "motorista" : "cliente");
              nav("inicio");
            }}
          >
            Alternar perfil
          </button>
        </div>
      </aside>
      <div className="content">
        <header>
          <span>
            <MapPin size={16} />{" "}
            {role === "motorista"
              ? (store.operatingArea || defaultArea).label
              : "Eunápolis, Bahia"}
          </span>
          <div>
            <span className="demo">DEMONSTRAÇÃO</span>
            <button
              aria-label="Notificações"
              onClick={() => setModal("notificacoes")}
            >
              <Bell size={20} />
            </button>
          </div>
        </header>
        <main>
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
          {f ? (
            <FreightDetailsView
              f={f}
              role={role}
              store={store}
              proposals={proposals}
              accepted={accepted}
              subscription={subscription}
              setModal={setModal}
              setSelected={setSelected}
              setChatId={setChatId}
              setTab={setTab}
              save={save}
              setError={setError}
              schedule={schedule}
            />
          ) : tab === "enderecos" ? (
            <AddressBookView
              addresses={store.addresses || []}
              onSave={(addresses) => save({ ...store, addresses })}
              onBack={() => setTab("perfil")}
            />
          ) : tab === "perfil" ? (
            <ProfileView
              name={name}
              setName={setName}
              onAddresses={() => setTab("enderecos")}
              photo={profilePhoto}
              setPhoto={setProfilePhoto}
              role={role}
              subscription={subscription}
              setSubscription={setSubscription}
              flash={flash}
              setEntered={(value) => {
                setEntered(value);
                if (!value) setLoginRequested(false);
              }}
            />
          ) : tab === "chat" ? (
            <ChatView
              store={store}
              role={role}
              chatId={chatId}
              setChatId={setChatId}
              send={send}
            />
          ) : role === "motorista" && tab === "inicio" ? (
            <DriverHomeView
              store={store}
              name={name}
              subscription={subscription}
              save={save}
              onSelect={setSelected}
              onProfile={() => nav("perfil")}
              schedule={schedule}
            />
          ) : role === "motorista" && tab === "fretes" ? (
            <DriverServicesView
              store={store}
              name={name}
              onSelect={setSelected}
              onExplore={() => nav("inicio")}
              schedule={schedule}
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
              schedule={schedule}
            />
          )}
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
      {modal && modal !== "pedido" && (
        <div className="overlay" onClick={() => setModal("")}>
          <section
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="section-head">
              <h2 id="modal-title">
                {modal === "pedido"
                  ? "Vamos planejar seu frete"
                  : modal === "proposta"
                    ? "Sua proposta"
                    : "Notificações"}
              </h2>
              <button
                autoFocus
                aria-label="Fechar"
                onClick={() => setModal("")}
              >
                <X />
              </button>
            </div>
            {error && (
              <p role="alert" className="alert">
                {error}
              </p>
            )}
            {modal === "proposta" ? (
              <form onSubmit={propose}>
                <label>
                  Seu valor em reais
                  <input
                    name="price"
                    type="number"
                    min="0.01"
                    max="1000000"
                    step="0.01"
                    required
                    placeholder="0,00"
                  />
                </label>
                <p className="muted">
                  Defina livremente quanto deseja cobrar pelo serviço.
                </p>
                <label>
                  Data e horário disponíveis
                  <input
                    name="date"
                    type="datetime-local"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </label>
                <label>
                  Mensagem para o cliente
                  <textarea
                    name="message"
                    maxLength={2000}
                    placeholder="Conte como pode ajudar"
                  />
                </label>
                <button className="primary">Enviar proposta</button>
              </form>
            ) : (
              <>
                <p className="muted">
                  Atualizações calculadas a partir dos dados locais.
                </p>
                {store.freights
                  .filter((f) => f.status === "ABERTO")
                  .map((f) => (
                    <div className="proposal" key={f.id}>
                      <b>{f.title}</b>
                      <p>
                        {
                          store.proposals.filter((p) => p.freightId === f.id)
                            .length
                        }{" "}
                        propostas recebidas
                      </p>
                      <button
                        className="card-link"
                        onClick={() => {
                          setSelected(f.id);
                          setModal("");
                        }}
                      >
                        Ver solicitação <ArrowRight size={16} />
                      </button>
                    </div>
                  ))}
              </>
            )}
          </section>
        </div>
      )}
      <SuccessDialog
        open={success !== null}
        title={
          success === "request" ? "Solicitação publicada!" : "Proposta enviada!"
        }
        description={
          success === "request"
            ? "Sua solicitação foi criada na demonstração. Agora você pode acompanhar as propostas recebidas."
            : "Sua proposta foi registrada na demonstração. Acompanhe a resposta em Meus serviços."
        }
        onClose={() => setSuccess(null)}
      />
    </div>
  );
}
