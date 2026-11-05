import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  FileCheck2,
  LogOut,
  ShieldCheck,
  Sparkles,
  Truck,
  UserRound,
} from "lucide-react";
import type { Store } from "@/contracts";
import { ownProposal } from "../driver/rules";
import { vehicleCategories, vehicleLabel } from "../vehicles/rules";
import { todayLocal } from "../addresses/rules";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { OnboardingPhotoField } from "./OnboardingPhotoField";
import { demoPhoto } from "./images";
import {
  licenseCategories,
  maskDocument,
  onboardingError,
  type DriverOnboardingDraft,
} from "./rules";
const steps = ["Identificação", "Sua foto", "CNH", "Veículo", "Revisão"];
type Props = {
  store: Store;
  onSubmit: (draft: DriverOnboardingDraft) => Promise<boolean>;
  onClient: () => void;
  onLogout: () => void;
  onServices: () => void;
};
export function DriverOnboardingView({
  store,
  onSubmit,
  onClient,
  onLogout,
  onServices,
}: Props) {
  const [step, setStep] = useState(0),
    [busy, setBusy] = useState(false),
    [reading, setReading] = useState(false),
    [error, setError] = useState("");
  const [leave, setLeave] = useState<"client" | "logout" | null>(null);
  const [draft, setDraft] = useState<DriverOnboardingDraft>(() => ({
    fullName: store.driverRegistration?.fullName || store.profile?.name || "",
    personType: store.driverRegistration?.personType || "pf",
    cpf: "",
    cnpj: "",
    companyName: store.driverRegistration?.companyName || "",
    profilePhoto: null,
    licenseNumber: "",
    licenseCategory: store.driverRegistration?.license.category || "",
    licenseExpiresOn: store.driverRegistration?.license.expiresOn || "",
    licensePhoto: null,
    vehicleId: store.vehicles?.[0]?.id || "",
    vehicle: {
      id: crypto.randomUUID(),
      category: "Utilitário",
      model: "",
      plate: "",
      description: "",
    },
    confirmed: false,
  }));
  const heading = useRef<HTMLHeadingElement>(null),
    saving = useRef(false);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [step]);
  function update(patch: Partial<DriverOnboardingDraft>) {
    setDraft((d) => ({ ...d, ...patch, confirmed: false }));
    setError("");
  }
  function sample() {
    const date = new Date(`${todayLocal()}T12:00:00Z`);
    date.setUTCFullYear(date.getUTCFullYear() + 5);
    update({
      fullName: "Motorista Demonstração",
      personType: "pf",
      cpf: "12345678909",
      cnpj: "12ABC34501DE35",
      companyName: "Empresa de Exemplo",
      profilePhoto: demoPhoto("profile"),
      licenseNumber: "12345678901",
      licenseCategory: "B",
      licenseExpiresOn: date.toISOString().slice(0, 10),
      licensePhoto: demoPhoto("license"),
      vehicleId: store.vehicles?.[0]?.id || "",
      vehicle: {
        id: crypto.randomUUID(),
        category: "Utilitário",
        model: "Fiorino de demonstração",
        plate: "TST1A23",
        capacityKg: 600,
        description: "Veículo fictício para apresentação do projeto.",
      },
    });
    setStep(1);
  }
  async function advance(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || reading || saving.current) return;
    const validation = onboardingError(draft, step, store);
    if (validation) {
      setError(validation);
      return;
    }
    if (step < 5) {
      setStep(step + 1);
      setError("");
      return;
    }
    for (let i = 1; i <= 5; i++) {
      const e = onboardingError(draft, i, store);
      if (e) {
        setStep(i);
        setError(e);
        return;
      }
    }
    saving.current = true;
    setBusy(true);
    setError("");
    try {
      if (!(await onSubmit(draft)))
        setError(
          "Não foi possível enviar o cadastro. Seus dados continuam nesta tela para tentar novamente.",
        );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível enviar o cadastro.",
      );
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }
  const chosenVehicle = draft.vehicleId
    ? store.vehicles?.find((v) => v.id === draft.vehicleId)
    : draft.vehicle;
  return (
    <div className="driver-onboarding-page">
      <header className="onboarding-header">
        <span className="brand">
          <Truck /> FRETTA<span>•</span>
        </span>
        <button
          className="back"
          disabled={busy || reading}
          onClick={() => (step ? setLeave("logout") : onLogout())}
        >
          <LogOut size={17} /> Sair
        </button>
      </header>
      <main className="onboarding-main">
        <div className="onboarding-demo-note">
          <ShieldCheck size={20} />
          <span>
            <b>Cadastro de demonstração</b> · Use dados fictícios. Não envie
            documentos reais. As imagens da CNH e os números completos ficam
            apenas nesta tela e não são guardados ao finalizar ou sair.
          </span>
        </div>
        {step === 0 ? (
          <section className="onboarding-intro">
            <span className="eyebrow">SEU PRIMEIRO PASSO COM A FRETTA</span>
            <h1 ref={heading} tabIndex={-1}>
              {store.driverRegistration
                ? "Vamos atualizar seu cadastro?"
                : "Vamos preparar seu perfil de motorista?"}
            </h1>
            <p>
              Antes de começar a enviar propostas, precisamos conhecer você e o
              veículo que vai levar os planos dos nossos clientes.
            </p>
            <div className="onboarding-tour">
              {[
                [
                  UserRound,
                  "Seus dados",
                  "Nome completo e CPF. Se atuar como empresa, informe também o CNPJ e a razão social.",
                ],
                [
                  Camera,
                  "Sua foto",
                  "Uma foto de perfil obrigatória para que os clientes possam reconhecer você.",
                ],
                [
                  FileCheck2,
                  "Sua habilitação",
                  "Dados da CNH, validade e uma imagem legível do documento.",
                ],
                [
                  Truck,
                  "Seu veículo",
                  "Tipo, modelo e placa do veículo usado nos fretes.",
                ],
              ].map(([Icon, title, description]) => {
                const I = Icon as typeof Truck;
                return (
                  <article key={String(title)}>
                    <I size={25} />
                    <div>
                      <h2>{String(title)}</h2>
                      <p>{String(description)}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="onboarding-next-note">
              <ShieldCheck size={22} />
              <p>
                Depois da revisão, seu cadastro ficará em análise. Enviar o
                formulário não confirma a aprovação dos documentos.
              </p>
            </div>
            <div className="onboarding-intro-actions">
              <button className="primary" onClick={() => setStep(1)}>
                Começar cadastro <ArrowRight size={18} />
              </button>
              <button className="secondary" onClick={sample}>
                <Sparkles size={17} /> Preencher exemplo fictício
              </button>
            </div>
            <button className="back" onClick={onClient}>
              Continuar como cliente
            </button>
            {store.proposals.some((p) =>
              ownProposal(p, store.profile?.name || "Clayton"),
            ) && (
              <button className="back" onClick={onServices}>
                Acessar meus serviços existentes
              </button>
            )}
          </section>
        ) : (
          <>
            <div className="onboarding-progress-heading">
              <span className="eyebrow">CADASTRO DO MOTORISTA</span>
              <span>Etapa {step} de 5</span>
            </div>
            <nav className="onboarding-steps" aria-label="Etapas do cadastro">
              {steps.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  disabled={i + 1 >= step || busy || reading}
                  aria-current={step === i + 1 ? "step" : undefined}
                  className={
                    step === i + 1 ? "current" : i + 1 < step ? "complete" : ""
                  }
                  onClick={() => {
                    setStep(i + 1);
                    setError("");
                  }}
                >
                  <span>{i + 1 < step ? <Check size={16} /> : i + 1}</span>
                  {label}
                </button>
              ))}
            </nav>
            <form className="panel onboarding-form" onSubmit={advance}>
              <fieldset className="plain-fieldset" disabled={busy || reading}>
                <h1 ref={heading} tabIndex={-1}>
                  {
                    [
                      "",
                      "Vamos conhecer você",
                      "Uma foto para seu perfil",
                      "Sua carteira de motorista",
                      "Qual veículo vai com você?",
                      "Confira antes de enviar",
                    ][step]
                  }
                </h1>
                {step === 1 && (
                  <>
                    <p className="muted">
                      Informe os dados da pessoa que vai dirigir. O cadastro
                      como empresa também identifica o motorista pelo CPF.
                    </p>
                    <label>
                      Nome completo
                      <input
                        autoComplete="name"
                        value={draft.fullName}
                        maxLength={120}
                        onChange={(e) => update({ fullName: e.target.value })}
                        required
                        placeholder="Como aparece no documento"
                      />
                    </label>
                    <div
                      className="onboarding-person-type"
                      role="group"
                      aria-label="Forma de atuação"
                    >
                      <button
                        type="button"
                        aria-pressed={draft.personType === "pf"}
                        onClick={() => update({ personType: "pf" })}
                      >
                        Pessoa física
                      </button>
                      <button
                        type="button"
                        aria-pressed={draft.personType === "pj"}
                        onClick={() => update({ personType: "pj" })}
                      >
                        Pessoa jurídica
                      </button>
                    </div>
                    <label>
                      CPF do motorista
                      <input
                        inputMode="numeric"
                        autoComplete="off"
                        value={draft.cpf}
                        maxLength={14}
                        onChange={(e) =>
                          update({
                            cpf: e.target.value.replace(/[^\d.\-]/g, ""),
                          })
                        }
                        required
                        placeholder="000.000.000-00"
                      />
                    </label>
                    {draft.personType === "pj" && (
                      <div className="form-grid">
                        <label>
                          Razão social
                          <input
                            value={draft.companyName}
                            maxLength={150}
                            onChange={(e) =>
                              update({ companyName: e.target.value })
                            }
                            required
                          />
                        </label>
                        <label>
                          CNPJ da empresa
                          <input
                            autoCapitalize="characters"
                            autoComplete="off"
                            value={draft.cnpj}
                            maxLength={18}
                            onChange={(e) =>
                              update({
                                cnpj: e.target.value
                                  .toUpperCase()
                                  .replace(/[^A-Z0-9./-]/g, ""),
                              })
                            }
                            required
                            placeholder="00.000.000/0000-00"
                          />
                        </label>
                      </div>
                    )}
                    <p className="muted">
                      A conferência do formato ajuda a encontrar erros de
                      digitação. A análise da identidade acontece em uma etapa
                      separada.
                    </p>
                  </>
                )}
                {step === 2 && (
                  <>
                    <p className="muted">
                      Use uma foto individual, de frente, com o rosto visível e
                      sem óculos escuros. Ela será exibida no seu perfil.
                    </p>
                    <OnboardingPhotoField
                      label="Foto de perfil"
                      kind="profile"
                      value={draft.profilePhoto}
                      onChange={(photo) => update({ profilePhoto: photo })}
                      onReading={setReading}
                    />
                  </>
                )}
                {step === 3 && (
                  <>
                    <p className="muted">
                      Confira os dados na sua habilitação e selecione uma imagem
                      em que o documento apareça inteiro e legível.
                    </p>
                    <label>
                      Número de registro da CNH
                      <input
                        inputMode="numeric"
                        autoComplete="off"
                        value={draft.licenseNumber}
                        maxLength={11}
                        onChange={(e) =>
                          update({
                            licenseNumber: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        required
                        placeholder="11 números do registro"
                      />
                    </label>
                    <div className="form-grid">
                      <label>
                        Categoria da CNH
                        <select
                          value={draft.licenseCategory}
                          onChange={(e) =>
                            update({ licenseCategory: e.target.value })
                          }
                          required
                        >
                          <option value="" disabled>
                            Selecione a categoria
                          </option>
                          {licenseCategories.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Validade da CNH
                        <input
                          type="date"
                          min={todayLocal()}
                          value={draft.licenseExpiresOn}
                          onChange={(e) =>
                            update({ licenseExpiresOn: e.target.value })
                          }
                          required
                        />
                      </label>
                    </div>
                    <OnboardingPhotoField
                      label="Foto da CNH"
                      kind="license"
                      value={draft.licensePhoto}
                      onChange={(photo) => update({ licensePhoto: photo })}
                      onReading={setReading}
                    />
                    <p className="muted">
                      O documento não aparecerá para os clientes. A
                      compatibilidade da habilitação com o serviço fará parte da
                      análise.
                    </p>
                  </>
                )}
                {step === 4 && (
                  <>
                    <p className="muted">
                      Você poderá gerenciar outros veículos depois. Os dados
                      deste veículo serão usados nas suas propostas.
                    </p>
                    {!!store.vehicles?.length && (
                      <label>
                        Veículo para o cadastro
                        <select
                          value={draft.vehicleId}
                          onChange={(e) =>
                            update({ vehicleId: e.target.value })
                          }
                        >
                          <option value="">Cadastrar um novo veículo</option>
                          {store.vehicles.map((v) => (
                            <option key={v.id} value={v.id}>
                              {vehicleLabel(v)}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                    {draft.vehicleId && chosenVehicle ? (
                      <div className="onboarding-vehicle-summary">
                        <Truck size={27} />
                        <h2>{vehicleLabel(chosenVehicle)}</h2>
                        <p>Placa: {chosenVehicle.plate}</p>
                        <p>{chosenVehicle.description}</p>
                      </div>
                    ) : (
                      <>
                        <label>
                          Tipo de veículo
                          <select
                            value={draft.vehicle.category}
                            onChange={(e) =>
                              update({
                                vehicle: {
                                  ...draft.vehicle,
                                  category: e.target.value,
                                },
                              })
                            }
                          >
                            {vehicleCategories.map((v) => (
                              <option key={v}>{v}</option>
                            ))}
                          </select>
                        </label>
                        <div className="form-grid">
                          <label>
                            Marca e modelo
                            <input
                              value={draft.vehicle.model}
                              onChange={(e) =>
                                update({
                                  vehicle: {
                                    ...draft.vehicle,
                                    model: e.target.value,
                                  },
                                })
                              }
                              maxLength={80}
                              required
                              placeholder="Ex.: Fiat Fiorino"
                            />
                          </label>
                          <label>
                            Placa
                            <input
                              value={draft.vehicle.plate}
                              onChange={(e) =>
                                update({
                                  vehicle: {
                                    ...draft.vehicle,
                                    plate: e.target.value
                                      .toUpperCase()
                                      .replace(/[^A-Z0-9]/g, ""),
                                  },
                                })
                              }
                              maxLength={7}
                              autoCapitalize="characters"
                              required
                              placeholder="ABC1D23"
                            />
                          </label>
                        </div>
                        <label>
                          Capacidade em kg (opcional)
                          <input
                            type="number"
                            min="1"
                            max="100000"
                            step="1"
                            value={draft.vehicle.capacityKg ?? ""}
                            onChange={(e) =>
                              update({
                                vehicle: {
                                  ...draft.vehicle,
                                  capacityKg: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                },
                              })
                            }
                          />
                        </label>
                        <label>
                          Características do veículo (opcional)
                          <textarea
                            maxLength={600}
                            value={draft.vehicle.description}
                            onChange={(e) =>
                              update({
                                vehicle: {
                                  ...draft.vehicle,
                                  description: e.target.value,
                                },
                              })
                            }
                            placeholder="Carroceria fechada, mantas de proteção…"
                          />
                        </label>
                      </>
                    )}
                  </>
                )}
                {step === 5 && (
                  <>
                    <p className="muted">
                      Confira cada etapa. Se precisar, volte para corrigir antes
                      de enviar.
                    </p>
                    <div className="onboarding-review-profile">
                      {draft.profilePhoto && (
                        <img
                          src={draft.profilePhoto.dataUrl}
                          alt="Foto de perfil selecionada"
                        />
                      )}
                      <div>
                        <h2>{draft.fullName}</h2>
                        <p>
                          {draft.personType === "pj"
                            ? "Pessoa jurídica"
                            : "Pessoa física"}
                        </p>
                      </div>
                    </div>
                    <dl className="onboarding-review-list">
                      <div>
                        <dt>CPF do motorista</dt>
                        <dd>{maskDocument(draft.cpf, "cpf")}</dd>
                      </div>
                      {draft.personType === "pj" && (
                        <>
                          <div>
                            <dt>Razão social</dt>
                            <dd>{draft.companyName}</dd>
                          </div>
                          <div>
                            <dt>CNPJ da empresa</dt>
                            <dd>{maskDocument(draft.cnpj, "cnpj")}</dd>
                          </div>
                        </>
                      )}
                      <div>
                        <dt>Registro da CNH</dt>
                        <dd>{maskDocument(draft.licenseNumber, "cnh")}</dd>
                      </div>
                      <div>
                        <dt>Habilitação</dt>
                        <dd>
                          Categoria {draft.licenseCategory} · validade{" "}
                          {draft.licenseExpiresOn
                            .split("-")
                            .reverse()
                            .join("/")}
                        </dd>
                      </div>
                      <div>
                        <dt>Veículo</dt>
                        <dd>
                          {chosenVehicle && vehicleLabel(chosenVehicle)} ·{" "}
                          {chosenVehicle?.plate}
                        </dd>
                      </div>
                      <div>
                        <dt>Imagens</dt>
                        <dd>
                          <CheckCircle2 size={16} /> Foto de perfil e CNH
                          selecionadas
                        </dd>
                      </div>
                    </dl>
                    <div className="onboarding-next-note">
                      <FileCheck2 size={22} />
                      <p>
                        O próximo passo é a análise do cadastro. A aprovação não
                        é automática.
                      </p>
                    </div>
                    <label className="checkbox-line">
                      <input
                        type="checkbox"
                        checked={draft.confirmed}
                        onChange={(e) =>
                          setDraft({ ...draft, confirmed: e.target.checked })
                        }
                        required
                      />{" "}
                      Conferi os dados e as imagens deste cadastro.
                    </label>
                    <p className="muted">
                      Nesta demonstração, apenas a foto de perfil e o resumo com
                      números ocultos ficam salvos no navegador. Ao retomar um
                      envio incompleto, os documentos precisarão ser
                      selecionados novamente.
                    </p>
                  </>
                )}
              </fieldset>
              {error && (
                <p className="alert" role="alert">
                  {error}
                </p>
              )}
              <div className="onboarding-form-actions">
                <button
                  type="button"
                  className="secondary"
                  disabled={busy || reading}
                  onClick={() => {
                    setStep(step - 1);
                    setError("");
                  }}
                >
                  <ArrowLeft size={17} /> Voltar
                </button>
                <button className="primary" disabled={busy || reading}>
                  {busy
                    ? "Enviando cadastro…"
                    : step === 5
                      ? "Enviar para análise"
                      : "Continuar"}
                  <ArrowRight size={17} />
                </button>
              </div>
            </form>
            <button
              className="back"
              disabled={busy || reading}
              onClick={() => setLeave("client")}
            >
              Continuar como cliente
            </button>
          </>
        )}
      </main>
      <ConfirmDialog
        open={leave !== null}
        onClose={() => setLeave(null)}
        title="Sair deste cadastro?"
        description="Os dados e imagens deste envio ainda não foram salvos. Você poderá iniciar o cadastro novamente quando voltar."
        confirmLabel={
          leave === "logout" ? "Sair da conta" : "Continuar como cliente"
        }
        cancelLabel="Continuar cadastro"
        onConfirm={async () => {
          if (leave === "logout") onLogout();
          else onClient();
          return true;
        }}
      />
    </div>
  );
}
