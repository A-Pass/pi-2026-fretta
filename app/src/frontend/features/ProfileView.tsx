import { useState } from "react";
import { ArrowLeft, Camera, LogOut, Pencil, User, X } from "lucide-react";
import { ProfileCamera } from "../components/ProfileCamera";
import type { Role, DriverRegistration } from "@/contracts";
import { prepareOnboardingPhoto } from "./onboarding/images";
import { useDiscardChanges } from "../components/useDiscardChanges";
type Props = {
  onAddresses: () => void;
  onRegistration: () => void;
  registration?: DriverRegistration;
  photoRequired: boolean;
  name: string;
  onSaveProfile: (profile: { name: string; photo: string }) => Promise<boolean>;
  editing: boolean;
  onEdit: () => void;
  onVehicles: () => void;
  onPublicProfile: () => void;
  onCompany: () => void;
  onSubscription: () => void;
  photo: string;
  role: Role;
  setEntered: (b: boolean) => void;
};
export function ProfileView({
  onAddresses,
  onRegistration,
  registration,
  photoRequired,
  name,
  onSaveProfile,
  editing,
  onEdit,
  onVehicles,
  onPublicProfile,
  onCompany,
  onSubscription,
  photo,
  role,
  setEntered,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [draftName, setDraftName] = useState(name),
    [draftPhoto, setDraftPhoto] = useState(photo),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const discard = useDiscardChanges(
    editing && (draftName !== name || draftPhoto !== photo),
  );
  async function choosePhoto(file: File) {
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 2000000
    ) {
      setError("Escolha uma foto JPG, PNG ou WebP de até 2 MB.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const image = await prepareOnboardingPhoto(file);
      setDraftPhoto(image.dataUrl);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível abrir a foto.",
      );
    } finally {
      setLoading(false);
    }
  }
  if (editing)
    return (
      <>
        <button className="back" onClick={() => discard.leave(onEdit)}>
          <ArrowLeft size={18} /> Voltar ao meu perfil
        </button>
        <span className="eyebrow">DO SEU JEITO</span>
        <h1>Editar perfil</h1>
        <section className="panel profile profile-editor">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const n = draftName.trim();
              if (!n) {
                setError("Informe seu nome de exibição.");
                return;
              }
              setSaving(true);
              try {
                if (await onSaveProfile({ name: n, photo: draftPhoto }))
                  onEdit();
                else
                  setError(
                    "Não foi possível salvar o perfil. Tente novamente.",
                  );
              } catch {
                setError("Não foi possível salvar o perfil. Tente novamente.");
              } finally {
                setSaving(false);
              }
            }}
          >
            <div className="profile-photo-preview">
              {draftPhoto ? (
                <img
                  className="profile-photo"
                  src={draftPhoto}
                  alt="Prévia da foto de perfil"
                />
              ) : (
                <span className="avatar large">
                  {draftName.trim().slice(0, 2).toUpperCase() || <User />}
                </span>
              )}
            </div>
            <label className="photo-upload">
              <Camera size={18} /> Escolher foto de perfil
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={loading || saving}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) void choosePhoto(file);
                }}
              />
            </label>
            <ProfileCamera disabled={loading || saving} onPhoto={choosePhoto} />
            <p className="muted photo-help">JPG, PNG ou WebP · até 2 MB</p>
            {draftPhoto && !photoRequired && (
              <button
                className="remove-photo"
                type="button"
                onClick={() => setDraftPhoto("")}
              >
                <X size={14} /> Remover foto
              </button>
            )}
            {photoRequired && (
              <p className="muted">
                A foto é obrigatória para o cadastro do motorista. Ao trocar a
                imagem, o cadastro volta para análise.
              </p>
            )}
            <label>
              Nome de exibição
              <input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                maxLength={80}
                required
                autoComplete="nickname"
              />
            </label>
            {error && (
              <p className="alert" role="alert">
                {error}
              </p>
            )}
            <div className="actions">
              <button
                type="button"
                disabled={saving}
                className="secondary"
                onClick={() => discard.leave(onEdit)}
              >
                Descartar alterações
              </button>
              <button className="primary" disabled={loading || saving}>
                {saving
                  ? "Salvando…"
                  : loading
                    ? "Carregando foto…"
                    : "Salvar alterações"}
              </button>
            </div>
          </form>
        </section>
        {discard.dialog}
      </>
    );
  return (
    <>
      <div className="profile-page-heading">
        <span className="eyebrow">DO SEU JEITO</span>
        <h1>Meu perfil</h1>
      </div>
      <section className="panel profile profile-overview">
        {photo ? (
          <img className="profile-photo" src={photo} alt={`Foto de ${name}`} />
        ) : (
          <div className="avatar large">{name.slice(0, 2).toUpperCase()}</div>
        )}
        <h2>{name}</h2>
        <p>{role === "cliente" ? "Cliente" : "Motorista"} · Conta FRETTA</p>
        <button
          className="primary"
          onClick={() => {
            setDraftName(name);
            setDraftPhoto(photo);
            setError("");
            onEdit();
          }}
        >
          <Pencil size={17} /> Editar perfil
        </button>
        <button className="secondary profile-return" onClick={onAddresses}>
          Meus Endereços{" "}
          <ArrowLeft size={16} style={{ transform: "rotate(180deg)" }} />
        </button>
        {role === "motorista" && (
          <div className="profile-driver-links">
            <button className="secondary" onClick={onPublicProfile}>
              Ver meu perfil público
            </button>
            {registration?.personType === "pj" && (
              <button className="secondary" onClick={onCompany}>
                Minha empresa · nome e logo
              </button>
            )}
            <button className="secondary" onClick={onRegistration}>
              Cadastro do motorista ·{" "}
              {registration?.status === "APROVADO"
                ? "Aprovado"
                : registration?.status === "EM_ANALISE"
                  ? "Em análise"
                  : registration?.status === "AJUSTES_SOLICITADOS"
                    ? "Ajustes solicitados"
                    : "Completar cadastro"}
            </button>
            <button className="secondary" onClick={onVehicles}>
              Meus veículos{" "}
              <ArrowLeft size={16} style={{ transform: "rotate(180deg)" }} />
            </button>
            <button className="secondary" onClick={onSubscription}>
              Minha assinatura · Demonstração{" "}
              <ArrowLeft size={16} style={{ transform: "rotate(180deg)" }} />
            </button>
          </div>
        )}
        <button
          className="secondary profile-return profile-logout"
          onClick={() => setEntered(false)}
        >
          <LogOut size={18} /> Sair da conta
        </button>
      </section>
    </>
  );
}
