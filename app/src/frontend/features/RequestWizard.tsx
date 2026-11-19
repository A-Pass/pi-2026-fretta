import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Camera, Truck, X } from "lucide-react";
import type { FreightRequestDraft, SavedAddress, Schedule } from "@/contracts";
import { prepareFreightPhoto } from "./onboarding/images";
import { useDiscardChanges } from "../components/useDiscardChanges";
import { PhotoGallery } from "../components/PhotoGallery";
import { scheduleLabel } from "../lib/dates";
import {
  emptyRequest,
  decodeDraft,
  draftKey,
  type SavedDraft,
  type RequestWizardDraft,
} from "./requests/drafts";
import { AddressFields } from "./addresses/AddressFields";
import {
  emptyAddress,
  stepError,
  todayLocal,
  publicRegion,
} from "./addresses/rules";
const steps = ["Itens", "Retirada", "Entrega", "Veículo", "Quando", "Datas"];
const vehicles = [
  ["Utilitário", "Poucos itens e pequenos volumes"],
  ["Caminhão pequeno", "Móveis e pequenas mudanças"],
  ["Caminhão médio", "Mais espaço para sua mudança"],
  ["Caminhão grande", "Cargas e mudanças maiores"],
];
export function RequestWizard({
  addresses,
  onClose,
  onSubmit,
  initialDraft,
  editId,
  revision = 0,
  draftScope,
}: {
  addresses: SavedAddress[];
  initialDraft?: FreightRequestDraft;
  editId?: string;
  revision?: number;
  draftScope?: string;
  onClose: () => void;
  onSubmit: (draft: FreightRequestDraft) => Promise<boolean>;
}) {
  const [step, setStep] = useState(0),
    [draft, setDraft] = useState<RequestWizardDraft>(() =>
      structuredClone(initialDraft || emptyRequest()),
    ),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [reading, setReading] = useState(false);
  const dirty = initialDraft
    ? JSON.stringify(draft) !== JSON.stringify(initialDraft)
    : !!(
        draft.title ||
        draft.description ||
        draft.photos.length ||
        draft.vehicle ||
        draft.pickup.point ||
        draft.pickup.street ||
        draft.pickup.city ||
        draft.pickup.neighborhood ||
        draft.delivery.point ||
        draft.delivery.street ||
        draft.delivery.city ||
        draft.delivery.neighborhood ||
        draft.schedule !== null
      );
  const key = draftKey(editId, revision) + (draftScope ? `:${draftScope}` : "");
  const [recovery, setRecovery] = useState<SavedDraft | null>(null),
    [draftReady, setDraftReady] = useState(false),
    [draftNotice, setDraftNotice] = useState("");
  const skipSave = useRef(false);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(key);
      const saved = decodeDraft(raw);
      if (saved) setRecovery(saved);
      else if (raw) sessionStorage.removeItem(key);
    } catch {
      setDraftNotice(
        "O navegador não permitiu recuperar rascunhos. Mantenha esta janela aberta até publicar.",
      );
    }
    setDraftReady(true);
  }, [key]);
  useEffect(() => {
    if (!draftReady || recovery || skipSave.current || !dirty) return;
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(
          key,
          JSON.stringify({ draft, step, at: Date.now() }),
        );
        setDraftNotice(
          "Rascunho salvo nesta aba. Você pode recuperá-lo ao atualizar a página e abrir Solicitar frete. Expira em 24 horas ou ao sair da conta.",
        );
      } catch {
        setDraftNotice(
          "Não foi possível salvar o rascunho. O espaço pode estar cheio; mantenha esta janela aberta até publicar.",
        );
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [draft, step, draftReady, recovery, dirty, key]);
  useEffect(() => {
    const flush = () => {
      if (draftReady && dirty && !recovery && !skipSave.current) {
        try {
          sessionStorage.setItem(
            key,
            JSON.stringify({ draft, step, at: Date.now() }),
          );
        } catch {}
      }
    };
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
    };
  }, [draft, step, draftReady, dirty, recovery, key]);
  const discard = useDiscardChanges(dirty);
  const discardAndClose = () => {
    skipSave.current = true;
    try {
      sessionStorage.removeItem(key);
    } catch {}
    onClose();
  };
  const requestClose = () => {
    if (!busy && !reading) discard.leave(discardAndClose);
  };
  const keepDraft = () => {
    try {
      sessionStorage.setItem(
        key,
        JSON.stringify({ draft, step, at: Date.now() }),
      );
      skipSave.current = true;
      onClose();
    } catch {
      setDraftNotice(
        "Não foi possível salvar o rascunho. Libere espaço ou publique antes de fechar.",
      );
    }
  };
  const dialog = useRef<HTMLDialogElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    form = useRef<HTMLFormElement>(null),
    body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    return () => el?.close();
  }, []);
  useEffect(() => {
    heading.current?.focus();
    body.current?.scrollTo({ top: 0 });
  }, [step]);
  function update(p: Partial<RequestWizardDraft>) {
    setDraft((d) => ({ ...d, ...p }));
    setError("");
  }
  async function advance() {
    if (recovery) return;
    const message = stepError(draft, step);
    if (message) {
      setError(message);
      return;
    }
    if (!form.current?.reportValidity()) return;
    if (step < 5) {
      setStep(step + 1);
      setError("");
      return;
    }
    for (let i = 0; i < 6; i++) {
      const e = stepError(draft, i);
      if (e) {
        setStep(i);
        setError(e);
        return;
      }
    }
    setBusy(true);
    setError("");
    try {
      if (
        draft.schedule &&
        (await onSubmit({ ...draft, schedule: draft.schedule }))
      ) {
        skipSave.current = true;
        try {
          sessionStorage.removeItem(key);
        } catch {}
      } else
        setError(
          "Não foi possível salvar a solicitação. Confira o espaço disponível no navegador e tente novamente.",
        );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível publicar. Tente novamente.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <dialog
        ref={dialog}
        className="wizard-dialog"
        aria-labelledby="request-title"
        onCancel={(e) => {
          e.preventDefault();
          requestClose();
        }}
      >
        <form
          ref={form}
          className="request-wizard"
          onSubmit={(e) => {
            e.preventDefault();
            void advance();
          }}
        >
          <div className="wizard-header">
            <div>
              <span className="eyebrow">SEU FRETE, PASSO A PASSO</span>
              <h2 id="request-title">
                {editId ? "Editar solicitação" : "Vamos planejar seu frete"}
              </h2>
            </div>
            <button
              type="button"
              aria-label="Fechar solicitação"
              disabled={busy || reading || !!recovery}
              onClick={requestClose}
            >
              <X />
            </button>
          </div>
          <nav className="wizard-steps" aria-label="Etapas da solicitação">
            {steps.map((label, i) => (
              <button
                key={label}
                type="button"
                disabled={i >= step || busy || reading || !!recovery}
                aria-current={i === step ? "step" : undefined}
                className={i === step ? "current" : i < step ? "complete" : ""}
                onClick={() => {
                  setStep(i);
                  setError("");
                }}
              >
                <span>{i < step ? <Check size={15} /> : i + 1}</span>
                <b>{label}</b>
              </button>
            ))}
          </nav>
          {recovery && (
            <section
              className="draft-recovery"
              aria-label="Rascunho encontrado"
            >
              <h3>Você tem um rascunho salvo</h3>
              <p>
                Deseja continuar de onde parou? Os dados ficam somente nesta aba
                do navegador.
              </p>
              <div className="actions">
                <button
                  type="button"
                  className="primary"
                  onClick={() => {
                    setDraft(recovery.draft);
                    setStep(recovery.step);
                    setRecovery(null);
                  }}
                >
                  Retomar rascunho
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    try {
                      sessionStorage.removeItem(key);
                    } catch {}
                    setRecovery(null);
                  }}
                >
                  Descartar rascunho
                </button>
              </div>
            </section>
          )}
          <div className="wizard-body" ref={body} inert={!!recovery}>
            {editId && (
              <p className="alert">
                Ao salvar mudanças, as propostas anteriores serão encerradas. Os
                motoristas precisarão enviar novos valores. As conversas serão
                preservadas.
              </p>
            )}
            {draftNotice && (
              <p className="draft-notice" role="status">
                {draftNotice}
              </p>
            )}
            <span className="step-count">Etapa {step + 1} de 6</span>
            <h2 tabIndex={-1} ref={heading} className="step-heading">
              {
                [
                  "O que vamos transportar?",
                  "Onde vamos retirar?",
                  "Onde vamos entregar?",
                  "Qual veículo você precisa?",
                  "Quando você quer seu frete?",
                  draft.schedule?.kind === "combinar"
                    ? "Tudo pronto para combinar"
                    : draft.schedule?.kind === "fixa"
                      ? "Escolha a data do frete"
                      : "Escolha o início e o fim",
                ][step]
              }
            </h2>
            {error && (
              <p className="alert" role="alert">
                {error}
              </p>
            )}
            {step === 0 && (
              <>
                <label>
                  Título
                  <input
                    value={draft.title}
                    onChange={(e) => update({ title: e.target.value })}
                    required
                    maxLength={150}
                    placeholder="Ex.: Mudança para minha nova casa"
                  />
                </label>
                <label>
                  O que precisa transportar?
                  <textarea
                    value={draft.description}
                    onChange={(e) => update({ description: e.target.value })}
                    required
                    maxLength={2000}
                    placeholder="Liste os itens e conte se há escadas, elevador ou necessidade de ajuda."
                  />
                </label>
                <label className="item-photo-upload">
                  <Camera size={24} />
                  <b>Adicionar fotos dos itens</b>
                  <span>Até 4 imagens de 30 MB cada</span>
                  <input
                    type="file"
                    accept="image/*,.heic,.heif,.tif,.tiff"
                    multiple
                    disabled={reading}
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      e.target.value = "";
                      if (!files.length) return;
                      const available = 4 - draft.photos.length;
                      if (available <= 0) {
                        setError(
                          "Você já adicionou 4 fotos. Remova uma para escolher outra.",
                        );
                        return;
                      }
                      setReading(true);
                      setError("");
                      const photos: string[] = [];
                      const errors: string[] = [];
                      if (files.length > available)
                        errors.push(
                          `Só há espaço para mais ${available} foto(s).`,
                        );
                      try {
                        for (const file of files.slice(0, available)) {
                          try {
                            photos.push(
                              (await prepareFreightPhoto(file)).dataUrl,
                            );
                          } catch (error) {
                            errors.push(
                              `${file.name}: ${error instanceof Error ? error.message : "Não foi possível ler a imagem."}`,
                            );
                          }
                        }
                        setDraft((d) => ({
                          ...d,
                          photos: [...d.photos, ...photos],
                        }));
                        setError(errors.join(" "));
                      } finally {
                        setReading(false);
                      }
                    }}
                  />
                </label>
                {reading && <p role="status">Preparando fotos…</p>}
                <div className="wizard-photos">
                  {draft.photos.map((src, i) => (
                    <div key={i}>
                      <img src={src} alt={`Item a transportar ${i + 1}`} />
                      <button
                        type="button"
                        aria-label={`Remover foto ${i + 1}`}
                        onClick={() =>
                          update({
                            photos: draft.photos.filter((_, n) => n !== i),
                          })
                        }
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            {step === 1 && (
              <AddressFields
                key="pickup"
                value={draft.pickup}
                onChange={(pickup) => update({ pickup })}
                addresses={addresses}
                save={draft.savePickup}
                onSaveChange={(savePickup) => update({ savePickup })}
                privacyNotice
              />
            )}
            {step === 2 && (
              <AddressFields
                key="delivery"
                value={draft.delivery}
                onChange={(delivery) => update({ delivery })}
                addresses={addresses}
                save={draft.saveDelivery}
                onSaveChange={(saveDelivery) => update({ saveDelivery })}
              />
            )}
            {step === 3 && (
              <div className="wizard-options">
                {vehicles.map(([value, help]) => (
                  <label
                    className={
                      draft.vehicle === value ? "option selected" : "option"
                    }
                    key={value}
                  >
                    <input
                      type="radio"
                      name="vehicle"
                      value={value}
                      checked={draft.vehicle === value}
                      onChange={() => update({ vehicle: value })}
                      required
                    />
                    <Truck />
                    <span>
                      <b>{value}</b>
                      <small>{help}</small>
                    </span>
                  </label>
                ))}
              </div>
            )}
            {step === 4 && (
              <div className="wizard-options">
                {(
                  [
                    [
                      "fixa",
                      "Data fixa",
                      "Já sei em qual dia preciso do frete.",
                    ],
                    [
                      "intervalo",
                      "Intervalo de datas",
                      "Tenho um período disponível para o transporte.",
                    ],
                    [
                      "combinar",
                      "A combinar",
                      "Vou combinar a data com o motorista.",
                    ],
                  ] as const
                ).map(([kind, label, help]) => (
                  <label
                    className={
                      draft.schedule?.kind === kind
                        ? "option selected"
                        : "option"
                    }
                    key={kind}
                  >
                    <input
                      type="radio"
                      name="schedule"
                      checked={draft.schedule?.kind === kind}
                      onChange={() => update({ schedule: { kind } })}
                    />
                    <span>
                      <b>{label}</b>
                      <small>{help}</small>
                    </span>
                  </label>
                ))}
              </div>
            )}
            {step === 5 && (
              <>
                {draft.schedule?.kind === "combinar" ? (
                  <p className="muted">
                    A data será negociada com o motorista. Não é necessário
                    escolher um dia agora.
                  </p>
                ) : (
                  <div className="form-grid">
                    <label>
                      {draft.schedule?.kind === "fixa"
                        ? "Data do frete"
                        : "Início do intervalo"}
                      <input
                        type="date"
                        required
                        min={todayLocal()}
                        value={draft.schedule?.start || ""}
                        onChange={(e) =>
                          update({
                            schedule: {
                              ...draft.schedule!,
                              start: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                    {draft.schedule?.kind === "intervalo" && (
                      <label>
                        Fim do intervalo
                        <input
                          type="date"
                          required
                          min={draft.schedule?.start || todayLocal()}
                          value={draft.schedule?.end || ""}
                          onChange={(e) =>
                            update({
                              schedule: {
                                ...draft.schedule!,
                                end: e.target.value,
                              },
                            })
                          }
                        />
                      </label>
                    )}
                  </div>
                )}
                <div className="request-summary">
                  <h3>Confira sua solicitação</h3>
                  <dl>
                    <div>
                      <dt>Transporte</dt>
                      <dd>
                        {draft.title}
                        <p>{draft.description}</p>
                      </dd>
                    </div>
                    <div>
                      <dt>Retirada</dt>
                      <dd>
                        {draft.pickup.street}, {draft.pickup.number}
                        {draft.pickup.complement
                          ? ` · ${draft.pickup.complement}`
                          : ""}
                        <br />
                        {publicRegion(draft.pickup)}
                      </dd>
                    </div>
                    <div>
                      <dt>Entrega</dt>
                      <dd>
                        {draft.delivery.street}, {draft.delivery.number}
                        {draft.delivery.complement
                          ? ` · ${draft.delivery.complement}`
                          : ""}
                        <br />
                        {publicRegion(draft.delivery)}
                      </dd>
                    </div>
                    <div>
                      <dt>Veículo</dt>
                      <dd>{draft.vehicle}</dd>
                    </div>
                    <div>
                      <dt>Quando</dt>
                      <dd>
                        {draft.schedule ? scheduleLabel(draft.schedule) : ""}
                      </dd>
                    </div>
                    <div>
                      <dt>Fotos</dt>
                      <dd>{draft.photos.length} adicionadas</dd>
                    </div>
                  </dl>
                  <PhotoGallery photos={draft.photos} />
                  <p>
                    Os endereços completos acima são visíveis para você nesta
                    revisão.
                  </p>
                  <p>
                    Os prestadores verão apenas bairro e cidade antes da
                    contratação.
                  </p>
                </div>
              </>
            )}
          </div>
          <footer className="wizard-footer">
            <button
              type="button"
              className="secondary"
              disabled={busy || reading || !!recovery}
              onClick={() => {
                if (step === 0) requestClose();
                else {
                  setStep(step - 1);
                  setError("");
                }
              }}
            >
              <ArrowLeft size={17} />
              {step === 0 ? "Fechar" : "Voltar"}
            </button>
            {dirty && !recovery && (
              <button
                type="button"
                className="secondary"
                disabled={busy || reading}
                onClick={keepDraft}
              >
                Salvar e continuar depois
              </button>
            )}
            <button
              className="primary"
              disabled={busy || reading || !!recovery}
            >
              {busy
                ? "Publicando…"
                : step === 5
                  ? editId
                    ? "Salvar alterações"
                    : "Publicar solicitação"
                  : "Continuar"}
              {step < 5 && <ArrowRight size={17} />}
            </button>
          </footer>
        </form>
      </dialog>
      {discard.dialog}
    </>
  );
}
