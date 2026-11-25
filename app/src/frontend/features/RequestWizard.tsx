import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Camera, Truck, X } from "lucide-react";
import type { FreightRequestDraft, SavedAddress, Schedule } from "@/contracts";
import { prepareOnboardingPhoto } from "./onboarding/images";
import { useDiscardChanges } from "../components/useDiscardChanges";
import { DateField } from "../components/DateField";
import { AddressFields } from "./addresses/AddressFields";
import {
  emptyAddress,
  stepError,
  todayLocal,
  publicRegion,
} from "./addresses/rules";
import { decodeDraft, draftKey } from "./requests/drafts";
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
  const storageKey =
    draftKey(editId, revision) + (draftScope ? `:${draftScope}` : "");
  const [step, setStep] = useState(0),
    [draft, setDraft] = useState<FreightRequestDraft>(() =>
      structuredClone(
        initialDraft ?? {
          title: "",
          description: "",
          photos: [],
          pickup: emptyAddress(),
          delivery: emptyAddress(),
          savePickup: false,
          saveDelivery: false,
          vehicle: "",
          schedule: { kind: "combinar" },
        },
      ),
    ),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [reading, setReading] = useState(false),
    [draftReady, setDraftReady] = useState(false),
    [closing, setClosing] = useState(false);
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
        draft.schedule.kind !== "combinar"
      );
  const discard = useDiscardChanges(dirty);
  const dialog = useRef<HTMLDialogElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    form = useRef<HTMLFormElement>(null),
    body = useRef<HTMLDivElement>(null);
  const exitAnimation = useRef<Animation | null>(null);
  function close() {
    const panel = dialog.current;
    if (!panel || exitAnimation.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }
    setClosing(true);
    const animation = panel.animate(
      [
        { transform: window.getComputedStyle(panel).transform },
        { transform: "translateY(100dvh)" },
      ],
      {
        duration: 240,
        easing: "cubic-bezier(.45, 0, .8, 1)",
        fill: "forwards",
      },
    );
    exitAnimation.current = animation;
    void animation.finished.then(onClose, () => {});
  }
  const requestClose = () => {
    if (!busy && !reading && !closing) discard.leave(close);
  };
  useEffect(() => {
    try {
      const saved = decodeDraft(sessionStorage.getItem(storageKey));
      if (!initialDraft && saved && saved.draft.schedule !== null) {
        setDraft({
          ...saved.draft,
          schedule: saved.draft.schedule,
        });
        setStep(saved.step);
      }
    } catch {
      setError("O navegador não permitiu recuperar o rascunho.");
    }
    setDraftReady(true);
  }, [initialDraft, storageKey]);
  useEffect(() => {
    if (!draftReady) return;
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ draft, step, at: Date.now() }),
      );
    } catch {
      setError("O navegador não permitiu salvar o rascunho.");
    }
  }, [draft, draftReady, step, storageKey]);
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    return () => {
      exitAnimation.current?.cancel();
      el?.close();
    };
  }, []);
  useEffect(() => {
    heading.current?.focus();
    body.current?.scrollTo({ top: 0 });
  }, [step]);
  function update(p: Partial<FreightRequestDraft>) {
    setDraft((d) => ({ ...d, ...p }));
    setError("");
  }
  async function advance() {
    if (closing) return;
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
      const submitted = await onSubmit(draft);
      if (!submitted) {
        setError("Não foi possível publicar. Tente novamente.");
      } else {
        try {
          sessionStorage.removeItem(storageKey);
        } catch {
          setError("A solicitação foi salva, mas o rascunho não foi removido.");
        }
      }
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
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
        data-closing={closing || undefined}
        aria-labelledby="request-title"
        onCancel={(e) => {
          e.preventDefault();
          requestClose();
        }}
      >
        <form
          ref={form}
          className="request-wizard"
          inert={closing}
          onSubmit={(e) => {
            e.preventDefault();
            void advance();
          }}
        >
          <div className="wizard-header">
            <div>
              <span className="eyebrow">SEU FRETE, PASSO A PASSO</span>
              <h2 id="request-title">Vamos planejar seu frete</h2>
            </div>
            <button
              type="button"
              aria-label="Fechar solicitação"
              disabled={busy || reading}
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
                disabled={i >= step || busy || reading}
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
          <div className="wizard-body" ref={body}>
            <span className="step-count">Etapa {step + 1} de 6</span>
            <h2 tabIndex={-1} ref={heading} className="step-heading">
              {
                [
                  "O que vamos transportar?",
                  "Onde vamos retirar?",
                  "Onde vamos entregar?",
                  "Qual veículo você precisa?",
                  "Quando você quer seu frete?",
                  draft.schedule.kind === "combinar"
                    ? "Tudo pronto para combinar"
                    : draft.schedule.kind === "fixa"
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
                  <span>Até 4 fotos JPG, PNG ou WebP de 1 MB cada</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    disabled={reading}
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      e.target.value = "";
                      if (!files.length) return;
                      if (
                        files.length + draft.photos.length > 4 ||
                        files.some(
                          (f) =>
                            f.size > 1000000 ||
                            !["image/jpeg", "image/png", "image/webp"].includes(
                              f.type,
                            ),
                        )
                      ) {
                        setError(
                          "Adicione até 4 fotos de até 1 MB cada, em JPG, PNG ou WebP.",
                        );
                        return;
                      }
                      setReading(true);
                      setError("");
                      try {
                        const photos = await Promise.all(
                          files.map(
                            async (file) =>
                              (await prepareOnboardingPhoto(file)).dataUrl,
                          ),
                        );
                        setDraft((d) => ({
                          ...d,
                          photos: [...d.photos, ...photos],
                        }));
                      } catch {
                        setError(
                          "Não foi possível ler uma das fotos. Tente outra imagem.",
                        );
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
                privacyNotice
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
                      draft.schedule.kind === kind
                        ? "option selected"
                        : "option"
                    }
                    key={kind}
                  >
                    <input
                      type="radio"
                      name="schedule"
                      checked={draft.schedule.kind === kind}
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
                {draft.schedule.kind === "combinar" ? (
                  <p className="muted">
                    A data será negociada com o motorista. Não é necessário
                    escolher um dia agora.
                  </p>
                ) : (
                  <div className="form-grid">
                    <DateField
                      label={
                        draft.schedule.kind === "fixa"
                          ? "Data do frete"
                          : "Início do intervalo"
                      }
                      required
                      min={todayLocal()}
                      value={draft.schedule.start || ""}
                      onChange={(start) =>
                        update({
                          schedule: {
                            ...draft.schedule,
                            start,
                          },
                        })
                      }
                    />
                    {draft.schedule.kind === "intervalo" && (
                      <DateField
                        label="Fim do intervalo"
                        required
                        min={draft.schedule.start || todayLocal()}
                        value={draft.schedule.end || ""}
                        onChange={(end) =>
                          update({
                            schedule: {
                              ...draft.schedule,
                              end,
                            },
                          })
                        }
                      />
                    )}
                  </div>
                )}
                <div className="request-summary">
                  <h3>Confira sua solicitação</h3>
                  <dl>
                    <div>
                      <dt>Transporte</dt>
                      <dd>{draft.title}</dd>
                    </div>
                    <div>
                      <dt>Retirada</dt>
                      <dd>{publicRegion(draft.pickup)}</dd>
                    </div>
                    <div>
                      <dt>Entrega</dt>
                      <dd>{publicRegion(draft.delivery)}</dd>
                    </div>
                    <div>
                      <dt>Veículo</dt>
                      <dd>{draft.vehicle}</dd>
                    </div>
                    <div>
                      <dt>Fotos</dt>
                      <dd>{draft.photos.length} adicionadas</dd>
                    </div>
                  </dl>
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
              disabled={busy || reading}
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
            <button className="primary" disabled={busy || reading}>
              {busy
                ? "Publicando…"
                : step === 5
                  ? "Publicar solicitação"
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
