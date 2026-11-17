import { useState, type FormEvent } from "react";
import { ArrowLeft, Building2, Camera, Eye, X } from "lucide-react";
import type { CompanyProfile, Store } from "@/contracts";
import { prepareOnboardingPhoto } from "../onboarding/images";
import { useDiscardChanges } from "../../components/useDiscardChanges";
import { companyError } from "./rules";
export function CompanyProfileView({
  store,
  save,
  onBack,
  onPreview,
}: {
  store: Store;
  save: (store: Store) => Promise<boolean>;
  onBack: () => void;
  onPreview: () => void;
}) {
  const [draft, setDraft] = useState<CompanyProfile>(
    store.companyProfile || {
      tradeName: store.driverRegistration?.companyName || "",
      about: "",
      city: "",
      logo: "",
    },
  );
  const [busy, setBusy] = useState(false),
    [reading, setReading] = useState(false),
    [error, setError] = useState(""),
    [saved, setSaved] = useState(false);
  const baseline = store.companyProfile || {
    tradeName: store.driverRegistration?.companyName || "",
    about: "",
    city: "",
    logo: "",
  };
  const dirty = JSON.stringify(draft) !== JSON.stringify(baseline);
  const discard = useDiscardChanges(dirty);
  function change(patch: Partial<CompanyProfile>) {
    setDraft({ ...draft, ...patch });
    setSaved(false);
    setError("");
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || reading) return;
    const message = companyError(draft);
    if (message) {
      setError(message);
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (
        await save({
          ...store,
          companyProfile: {
            ...draft,
            tradeName: draft.tradeName.trim(),
            city: draft.city.trim(),
            about: draft.about.trim(),
          },
        })
      )
        setSaved(true);
      else setError("Não foi possível salvar a apresentação. Tente novamente.");
    } catch {
      setError("Não foi possível salvar a apresentação. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button className="back" onClick={() => discard.leave(onBack)}>
        <ArrowLeft size={18} /> Voltar ao meu perfil
      </button>
      <span className="eyebrow">A IDENTIDADE DO SEU NEGÓCIO</span>
      <h1>Minha empresa</h1>
      <a className="secondary" href="/empresa">
        Gerenciar equipe e frota
      </a>
      <p className="muted">
        A logo representa sua empresa. A foto e a identificação do motorista
        continuam separadas.
      </p>
      <section className="panel company-editor">
        <form onSubmit={submit}>
          <fieldset className="plain-fieldset" disabled={busy || reading}>
            <div className="company-logo-preview">
              {draft.logo ? (
                <img src={draft.logo} alt="Prévia da logo da empresa" />
              ) : (
                <Building2 size={44} />
              )}
            </div>
            <label className="photo-upload">
              <Camera size={18} />{" "}
              {reading ? "Preparando imagem…" : "Alterar logo"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  setReading(true);
                  setError("");
                  try {
                    if (file.size > 2 * 1024 * 1024)
                      throw new Error("Escolha uma logo de até 2 MB.");
                    const photo = await prepareOnboardingPhoto(file);
                    change({ logo: photo.dataUrl });
                  } catch (e) {
                    setError(
                      e instanceof Error
                        ? e.message
                        : "Não foi possível abrir a imagem.",
                    );
                  } finally {
                    setReading(false);
                  }
                }}
              />
            </label>
            <p className="muted">
              Logo opcional · JPG, PNG ou WebP · até 2 MB · mínimo 200 × 200
              pixels
            </p>
            {draft.logo && (
              <button
                type="button"
                className="remove-photo"
                onClick={() => change({ logo: "" })}
              >
                <X size={15} /> Remover logo
              </button>
            )}
            <label>
              Nome comercial
              <input
                maxLength={100}
                required
                value={draft.tradeName}
                onChange={(e) => change({ tradeName: e.target.value })}
                placeholder="Ex.: Reis Transportes"
              />
            </label>
            <label>
              Cidade de atendimento (opcional)
              <input
                maxLength={100}
                value={draft.city}
                onChange={(e) => change({ city: e.target.value })}
                placeholder="Ex.: Eunápolis, BA"
              />
            </label>
            <label>
              Apresentação da empresa (opcional)
              <textarea
                maxLength={600}
                value={draft.about}
                onChange={(e) => change({ about: e.target.value })}
                placeholder="Conte quais serviços sua empresa oferece…"
              />
            </label>
          </fieldset>
          {error && (
            <p className="alert" role="alert">
              {error}
            </p>
          )}
          {saved && (
            <p className="notice" role="status">
              Apresentação da empresa atualizada.
            </p>
          )}
          <div className="actions">
            <button
              type="button"
              className="secondary"
              disabled={busy || reading}
              onClick={() => discard.leave(onPreview)}
            >
              <Eye size={17} /> Ver perfil público salvo
            </button>
            <button className="primary" disabled={busy || reading}>
              {busy ? "Salvando…" : "Salvar apresentação"}
            </button>
          </div>
        </form>
      </section>
      <section className="panel provider-section">
        <h2>Motorista e veículos</h2>
        <p>
          {store.fleet ? (
            "Gerencie motoristas vinculados e veículos na área Equipe e frota. Cada proposta registra o motorista designado e o veículo daquele serviço."
          ) : (
            <>
              O responsável atual é{" "}
              {store.profile?.name ||
                store.driverRegistration?.fullName ||
                "o motorista cadastrado"}
              . Os veículos são gerenciados em “Meus veículos”. Cada proposta
              registra o motorista e o veículo do serviço.
            </>
          )}
        </p>
      </section>
      {discard.dialog}
    </>
  );
}
