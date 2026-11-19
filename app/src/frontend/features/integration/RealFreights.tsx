"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Plus,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  Address,
  FreightRequestDraft,
  FreightStatus,
  Role,
  SavedAddress,
  Vehicle,
} from "@/contracts";
import { createHttpTransport } from "../../api/http";
import { createBackendClient } from "../../api/backend";
import { LocationPicker } from "../../components/LocationPicker";
import { ProposalFormDialog } from "../../components/ProposalFormDialog";
import { SuccessDialog } from "../../components/SuccessDialog";
import { scheduleLabel } from "../../lib/dates";
import { StatusBadge } from "../../components/StatusBadge";
import { RequestWizard } from "../RequestWizard";
import { defaultArea } from "../driver/rules";

const http = createHttpTransport();
const backend = createBackendClient();
type Summary = {
  id: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  status: FreightStatus;
  ownRequest?: boolean;
  proposalCount?: number;
  vehicle: string;
};
type Detail = Summary & {
  owner: boolean;
  hired: boolean;
  reviewed: boolean;
  updatedAt: string;
  schedule: FreightRequestDraft["schedule"];
  clientName: string;
  photos: string[];
  addresses?: { pickup: Address; delivery: Address };
  proposals: {
    id: string;
    driver: string;
    status: string;
    conversationId?: string;
    offers: {
      id: string;
      priceCents: number;
      availableAt: string;
      message: string;
      vehicle: string;
      status: string;
    }[];
  }[];
};
const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function RealFreights({
  role,
  tab,
  name,
  selected,
  vehicles,
  canOffer,
  userId,
}: {
  role: Role;
  tab: "inicio" | "fretes";
  name: string;
  selected: string | null;
  vehicles: Vehicle[];
  canOffer: boolean;
  userId: string;
}) {
  const router = useRouter();
  const root = `/${role}/fretes`;
  const [items, setItems] = useState<Summary[]>([]);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [wizard, setWizard] = useState(false);
  const [published, setPublished] = useState(false);
  const [proposalSent, setProposalSent] = useState(false);
  const [offer, setOffer] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [cancel, setCancel] = useState(false);
  const [reason, setReason] = useState("");
  const areaKey = `fretta:operating-area:${userId}`;
  const [area, setOperatingArea] = useState({
    base: defaultArea.center,
    radius: 25,
  });
  const [restoredArea, setRestoredArea] = useState<string | null>(null);
  const { base, radius } = area;
  useEffect(() => {
    if (role !== "motorista") return;
    let restored = { base: defaultArea.center, radius: 25 };
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
      )
        restored = {
          base: { lat: value.base.lat, lng: value.base.lng },
          radius: value.radius,
        };
    } catch {}
    setOperatingArea(restored);
    setRestoredArea(areaKey);
  }, [areaKey, role]);
  const areaReady = role !== "motorista" || restoredArea === areaKey;
  function saveArea(next: typeof area) {
    clearAreaResults();
    setOperatingArea(next);
    try {
      localStorage.setItem(areaKey, JSON.stringify(next));
    } catch {}
  }
  const searchVersion = useRef(0);
  function clearAreaResults() {
    searchVersion.current += 1;
    setItems([]);
    setCursor(null);
  }
  const path = `/freights/${encodeURIComponent(selected ?? "")}`;
  useEffect(() => {
    if (!areaReady) return;
    const controller = new AbortController();
    setDetail(null);
    setWizard(false);
    setOffer(false);
    setCancel(false);
    setReason("");
    setError("");
    setCursor(null);
    setItems([]);
    if (selected) {
      void http
        .request<Detail>(path, { signal: controller.signal })
        .then(setDetail)
        .catch(report);
    } else {
      void page(null, controller.signal).catch(report);
    }
    function report(e: Error) {
      if (!controller.signal.aborted) setError(e.message);
    }
    return () => controller.abort();
  }, [selected, role, tab, base, radius, canOffer, path, areaReady]);

  async function page(after: string | null, signal?: AbortSignal) {
    const version = searchVersion.current;
    const query = new URLSearchParams({ role });
    if (role === "motorista" && (!canOffer || tab !== "inicio"))
      query.set("scope", "services");
    if (role === "motorista" && base) {
      query.set("lat", String(base.lat));
      query.set("lng", String(base.lng));
      query.set("radius", String(radius));
    }
    if (after) query.set("cursor", after);
    const result = await http.request<{
      items: Summary[];
      nextCursor: string | null;
    }>(`/freights?${query}`, { signal });
    if (!signal?.aborted && version === searchVersion.current) {
      setItems((previous) =>
        after ? [...previous, ...result.items] : result.items,
      );
      setCursor(result.nextCursor);
    }
  }

  async function publish(draft: FreightRequestDraft) {
    const editing = detail?.owner && selected === detail.id ? detail : null;
    const prefix = `/api/v1/freights/${editing?.id}/photo/`;
    const uploads = await Promise.all(
      draft.photos.map(async (image, index) => {
        if (
          editing &&
          image.startsWith(prefix) &&
          editing.photos.includes(image.slice(prefix.length))
        )
          return { id: image.slice(prefix.length) };
        const blob = await (await fetch(image)).blob();
        return backend.upload(
          new File([blob], `foto-${index}`, { type: blob.type }),
          "freight",
        );
      }),
    );
    const { photos, ...fields } = draft;
    const result = await http.request<Detail>(
      editing ? `${path}/edit` : "/freights",
      {
        method: "POST",
        body: {
          ...fields,
          expectedUpdatedAt: editing?.updatedAt,
          photoIds: uploads.map((upload) => upload.id),
        },
      },
    );
    setWizard(false);
    if (editing) setDetail(result);
    else {
      setItems((current) => [
        result,
        ...current.filter((item) => item.id !== result.id),
      ]);
      setPublished(true);
    }
    return true;
  }

  async function change(action: string, body: Record<string, unknown> = {}) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      setDetail(
        await http.request<Detail>(`${path}/${action}`, {
          method: "POST",
          body,
        }),
      );
      setCancel(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const clientOwnsRequest = role === "cliente" && detail?.owner === true;
  const canSendProposal =
    role === "motorista" &&
    canOffer &&
    detail?.status === "ABERTO" &&
    !detail.owner;
  const addressText = (a: Address) =>
    [a.street, a.number, a.complement, a.neighborhood, a.city, a.state]
      .filter(Boolean)
      .join(", ");
  return (
    <>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      {!selected && (
        <>
          <div className="section-head">
            <div>
              {tab === "inicio" && (
                <span className="eyebrow">
                  {role === "cliente"
                    ? "BOM TER VOCÊ POR AQUI"
                    : "NOVAS ROTAS, NOVAS OPORTUNIDADES"}
                </span>
              )}
              <h1>
                {tab === "inicio"
                  ? `Olá, ${name.split(" ")[0]} 👋`
                  : role === "cliente"
                    ? "Meus fretes"
                    : "Meus serviços"}
              </h1>
            </div>
          </div>
          {tab === "inicio" && role === "cliente" && (
            <section className="hero">
              <div>
                <span className="eyebrow">A GENTE CONECTA. VOCÊ SEGUE.</span>
                <h2>
                  Mudou de planos?
                  <br />A gente ajuda a levar.
                </h2>
                <p>
                  Conte o que precisa transportar e compare propostas de
                  motoristas.
                </p>
              </div>
              <Truck className="hero-truck" strokeWidth={1} />
            </section>
          )}
          {role === "cliente" && tab === "inicio" ? (
            <div className="home-request-action">
              <button
                className="primary"
                onClick={async () => {
                  try {
                    setAddresses(
                      await http.request<SavedAddress[]>("/freights/addresses"),
                    );
                    setWizard(true);
                  } catch (e) {
                    setError((e as Error).message);
                  }
                }}
              >
                <Plus size={18} /> Solicitar frete
              </button>
            </div>
          ) : role === "motorista" &&
            tab === "inicio" &&
            canOffer &&
            areaReady ? (
            <>
              <LocationPicker
                value={base}
                followMap
                onChange={(point) => {
                  if (point) saveArea({ base: point, radius });
                }}
                radiusKm={radius}
              />
              <label>
                Raio para buscar retiradas · {radius} km
                <input
                  type="range"
                  min={1}
                  max={300}
                  value={radius}
                  onChange={(e) => {
                    saveArea({ base, radius: Number(e.target.value) });
                  }}
                />
              </label>
            </>
          ) : role === "motorista" && tab === "inicio" ? (
            <p>
              A busca de fretes está indisponível. Confira a situação do seu
              cadastro, veículo e acesso.
            </p>
          ) : null}
          <div className="real-freight-list">
            {items.map((f) => (
              <article key={f.id} className="freight-card real-freight-card">
                <div className="freight-card-status">
                  <StatusBadge status={f.status} />
                  {role === "cliente" && !!f.proposalCount && (
                    <span className="proposal-count">
                      {f.proposalCount}{" "}
                      {f.proposalCount === 1 ? "proposta" : "propostas"}
                    </span>
                  )}
                </div>
                {role === "motorista" && f.ownRequest && (
                  <p className="muted">Solicitação da sua conta</p>
                )}
                <h2>{f.title}</h2>
                <p className="real-freight-route">
                  <MapPin size={17} aria-hidden="true" />
                  <span>
                    {f.origin} → {f.destination}
                  </span>
                </p>
                <p className="muted">{f.vehicle}</p>
                <Link
                  className="secondary real-freight-link"
                  href={`${root}/${f.id}`}
                  aria-label={`Ver detalhes de ${f.title}`}
                >
                  Ver detalhes <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
          {cursor && (
            <button
              onClick={() =>
                void page(cursor).catch((e) => setError(e.message))
              }
            >
              Carregar mais
            </button>
          )}
        </>
      )}
      {wizard && (
        <RequestWizard
          addresses={addresses}
          draftScope={userId}
          editId={detail?.id}
          revision={detail ? Date.parse(detail.updatedAt) : 0}
          initialDraft={
            detail?.addresses
              ? {
                  title: detail.title,
                  description: detail.description ?? "",
                  photos: detail.photos.map(
                    (id) => `/api/v1/freights/${detail.id}/photo/${id}`,
                  ),
                  pickup: detail.addresses.pickup,
                  delivery: detail.addresses.delivery,
                  savePickup: false,
                  saveDelivery: false,
                  vehicle: detail.vehicle,
                  schedule: detail.schedule,
                }
              : undefined
          }
          onClose={() => setWizard(false)}
          onSubmit={publish}
        />
      )}
      {selected && (
        <Link
          href={
            role === "motorista" && detail?.status === "ABERTO"
              ? "/motorista/inicio"
              : root
          }
          className="secondary real-freight-link real-freight-back"
        >
          <ArrowLeft size={17} aria-hidden="true" />{" "}
          {role === "cliente"
            ? "Voltar para Meus fretes"
            : detail?.status === "ABERTO"
              ? "Voltar às solicitações"
              : "Voltar para Meus serviços"}
        </Link>
      )}
      {detail && (
        <>
          <h1>{detail.title}</h1>
          {clientOwnsRequest &&
            detail.status === "ABERTO" &&
            detail.addresses?.pickup?.point &&
            detail.addresses.delivery?.point && (
              <button
                className="secondary"
                onClick={async () => {
                  try {
                    setAddresses(
                      await http.request<SavedAddress[]>("/freights/addresses"),
                    );
                    setWizard(true);
                  } catch (e) {
                    setError((e as Error).message);
                  }
                }}
              >
                Editar solicitação
              </button>
            )}
          <p>{detail.description}</p>
          {role === "motorista" && (
            <p>
              <b>Quando:</b> {scheduleLabel(detail.schedule)}
            </p>
          )}
          <p>
            {detail.origin} → {detail.destination} · {detail.vehicle}
          </p>
          <p>
            <StatusBadge status={detail.status} />
          </p>
          {detail.photos.map((id) => (
            <img
              key={id}
              width={200}
              alt="Item do frete"
              src={`/api/v1/freights/${detail.id}/photo/${id}`}
            />
          ))}
          {detail.addresses &&
            (clientOwnsRequest || (role === "motorista" && detail.hired)) && (
              <div>
                <p>
                  <b>Retirada</b> {addressText(detail.addresses.pickup)}
                </p>
                <p>
                  <b>Entrega</b> {addressText(detail.addresses.delivery)}
                </p>
              </div>
            )}
          {canSendProposal && (
            <div className="opportunity-action real-opportunity-action">
              <button
                type="button"
                className="primary"
                onClick={() => setOffer(true)}
              >
                {detail.proposals.length
                  ? "Enviar nova proposta"
                  : "Enviar proposta"}
              </button>
            </div>
          )}
          {role === "motorista" && detail.owner && (
            <p className="muted">
              Esta solicitação foi publicada pela sua conta.
            </p>
          )}
          {detail.proposals.map((p) => (
            <article key={p.id} className="panel">
              <h2>
                {p.driver} · {p.status}
              </h2>
              {p.offers.map((o) => (
                <div key={o.id}>
                  <p>
                    <b>{money.format(o.priceCents / 100)}</b> · {o.vehicle} ·{" "}
                    {o.status}
                  </p>
                  {o.availableAt && (
                    <p>
                      Retirada em{" "}
                      {new Date(o.availableAt).toLocaleString("pt-BR", {
                        timeZone: "America/Bahia",
                      })}
                    </p>
                  )}
                  <p>{o.message}</p>
                  {clientOwnsRequest &&
                    detail.status === "ABERTO" &&
                    o.status === "PENDENTE" && (
                      <div className="proposal-actions">
                        <button
                          className="primary"
                          disabled={busy}
                          onClick={() =>
                            void change(`accept/${p.id}`, { offerId: o.id })
                          }
                        >
                          Aceitar proposta
                        </button>
                        <button
                          className="secondary"
                          disabled={busy}
                          onClick={() =>
                            void change(`decline/${p.id}`, { offerId: o.id })
                          }
                        >
                          Recusar proposta
                        </button>
                      </div>
                    )}
                </div>
              ))}
              {p.conversationId && (
                <Link
                  className="secondary real-freight-link proposal-chat-link"
                  href={`/${role}/chat/${encodeURIComponent(p.conversationId)}`}
                >
                  Conversar
                </Link>
              )}
            </article>
          ))}
          {detail.hired && detail.status === "AGENDADO" && (
            <button disabled={busy} onClick={() => void change("start")}>
              Iniciar transporte
            </button>
          )}
          {clientOwnsRequest && detail.status === "EM_TRANSPORTE" && (
            <button disabled={busy} onClick={() => void change("complete")}>
              Concluir frete
            </button>
          )}
          {clientOwnsRequest &&
            ["ABERTO", "AGENDADO"].includes(detail.status) && (
              <button
                type="button"
                className="primary real-freight-cancel"
                disabled={busy}
                onClick={() => setCancel(true)}
              >
                <XCircle size={18} aria-hidden="true" /> Cancelar solicitação
              </button>
            )}
          {cancel && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void change("cancel", { reason });
              }}
            >
              <label>
                Motivo do cancelamento
                <textarea
                  required
                  minLength={10}
                  maxLength={1000}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </label>
              <div className="real-cancel-actions">
                <button
                  type="button"
                  className="secondary"
                  disabled={busy}
                  onClick={() => setCancel(false)}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="primary real-cancel-confirm"
                  disabled={busy}
                >
                  {busy ? "Cancelando…" : "Confirmar cancelamento"}
                </button>
              </div>
            </form>
          )}
          {detail.status === "CONCLUIDO" &&
            (clientOwnsRequest || (role === "motorista" && detail.hired)) &&
            (detail.reviewed ? (
              <p>Avaliação registrada.</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fields = new FormData(e.currentTarget);
                  void change("reviews", {
                    score: Number(fields.get("score")),
                    comment: fields.get("comment"),
                  });
                }}
              >
                <label>
                  Nota
                  <select name="score" defaultValue="5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Comentário privado
                  <textarea name="comment" maxLength={1000} />
                </label>
                <button className="primary" disabled={busy}>
                  Enviar avaliação
                </button>
              </form>
            ))}
          {offer && canSendProposal && (
            <ProposalFormDialog
              vehicles={vehicles}
              onManageVehicles={() => router.push("/motorista/veiculos")}
              onClose={() => setOffer(false)}
              onSubmit={async (offer) => {
                setDetail(
                  await http.request<Detail>(`${path}/propose`, {
                    method: "POST",
                    body: { ...offer, expectedUpdatedAt: detail.updatedAt },
                  }),
                );
                setProposalSent(true);
                return true;
              }}
            />
          )}
        </>
      )}
      <SuccessDialog
        open={proposalSent}
        title="Proposta enviada!"
        description="O cliente pode ver o valor e sua mensagem na proposta."
        onClose={() => setProposalSent(false)}
      />
      <SuccessDialog
        open={published}
        title="Frete publicado!"
        description="Você pode acompanhar a solicitação e as propostas em Meus fretes."
        actionLabel="Ir para Meus fretes"
        onClose={() => setPublished(false)}
        onAction={() => {
          setPublished(false);
          router.push(root);
        }}
      />
    </>
  );
}
