import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Camera, Truck, X } from "lucide-react";
import type { FreightRequestDraft, SavedAddress, Schedule } from "@/contracts";
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
}: {
  addresses: SavedAddress[];
  onClose: () => void;
  onSubmit: (draft: FreightRequestDraft) => Promise<boolean>;
}) {
  const [step, setStep] = useState(0),
    [draft, setDraft] = useState<FreightRequestDraft>({
      title: "",
      description: "",
      photos: [],
      pickup: emptyAddress(),
      delivery: emptyAddress(),
      savePickup: false,
      saveDelivery: false,
      vehicle: "",
      schedule: { kind: "combinar" },
    }),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [reading, setReading] = useState(false);
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
  function update(p: Partial<FreightRequestDraft>) {
    setDraft((d) => ({ ...d, ...p }));
    setError("");
  }
  async function advance() {
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
      if (!(await onSubmit(draft)))
        setError(
          "Não foi possível salvar a solicitação. Confira o espaço disponível no navegador e tente novamente.",
        );
    } catch {
      setError("Não foi possível publicar. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <dialog
      ref={dialog}
      className="wizard-dialog"
      aria-labelledby="request-title"
      onCancel={(e) => {
        e.preventDefault();
        if (!busy && !reading) onClose();
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
            <h2 id="request-title">Vamos planejar seu frete</h2>
          </div>
          <button
            type="button"
            aria-label="Fechar solicitação"
            disabled={busy || reading}
            onClick={onClose}
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
                          (f) =>
                            new Promise<string>((resolve, reject) => {
                              const reader = new FileReader();
                              reader.onload = () =>
                                resolve(String(reader.result));
                              reader.onerror = reject;
                              reader.readAsDataURL(f);
                            }),
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
                  ["fixa", "Data fixa", "Já sei em qual dia preciso do frete."],
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
                    draft.schedule.kind === kind ? "option selected" : "option"
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
                  <label>
                    {draft.schedule.kind === "fixa"
                      ? "Data do frete"
                      : "Início do intervalo"}
                    <input
                      type="date"
                      required
                      min={todayLocal()}
                      value={draft.schedule.start || ""}
                      onChange={(e) =>
                        update({
                          schedule: {
                            ...draft.schedule,
                            start: e.target.value,
                          },
                        })
                      }
                    />
                  </label>
                  {draft.schedule.kind === "intervalo" && (
                    <label>
                      Fim do intervalo
                      <input
                        type="date"
                        required
                        min={draft.schedule.start || todayLocal()}
                        value={draft.schedule.end || ""}
                        onChange={(e) =>
                          update({
                            schedule: {
                              ...draft.schedule,
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
              if (step === 0) onClose();
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
  );
}
