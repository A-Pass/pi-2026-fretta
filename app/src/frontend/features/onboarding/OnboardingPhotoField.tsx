import { useState } from "react";
import { Camera, Check, ImagePlus, Trash2 } from "lucide-react";
import { ProfileCamera } from "../../components/ProfileCamera";
import { prepareOnboardingPhoto } from "./images";
import type { PreparedPhoto } from "./rules";
export function OnboardingPhotoField({
  label,
  kind,
  value,
  onChange,
  onReading,
}: {
  label: string;
  kind: "profile" | "license";
  value: PreparedPhoto | null;
  onChange: (photo: PreparedPhoto | null) => void;
  onReading: (reading: boolean) => void;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function choosePhoto(file: File) {
    setBusy(true);
    setError("");
    onReading(true);
    try {
      onChange(await prepareOnboardingPhoto(file));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível abrir a imagem.",
      );
    } finally {
      setBusy(false);
      onReading(false);
    }
  }
  return (
    <div className={`onboarding-photo-field ${kind}`}>
      {value ? (
        <div className="onboarding-photo-preview">
          <img
            src={value.dataUrl}
            alt={
              kind === "profile"
                ? "Prévia da foto de perfil"
                : "Prévia da imagem da CNH selecionada"
            }
          />
          <span>
            <Check size={16} /> Imagem selecionada
          </span>
        </div>
      ) : (
        <div className="onboarding-photo-placeholder">
          {kind === "profile" ? <Camera size={44} /> : <ImagePlus size={44} />}
          <p>
            {kind === "profile"
              ? "Seu rosto, de frente e bem iluminado"
              : "Documento inteiro, legível e sem reflexos"}
          </p>
        </div>
      )}
      <label className="photo-upload onboarding-upload">
        <Camera size={18} />{" "}
        {busy
          ? "Preparando imagem…"
          : value
            ? `Trocar ${label.toLowerCase().replace("cnh", "CNH")}`
            : `Adicionar ${label.toLowerCase().replace("cnh", "CNH")}`}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={busy}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void choosePhoto(file);
          }}
        />
      </label>
      {kind === "profile" && (
        <ProfileCamera disabled={busy} onPhoto={choosePhoto} />
      )}
      <p className="muted">
        JPG, PNG ou WebP · até 5 MB · mínimo de 200 × 200 pixels
      </p>
      {value && (
        <button
          className="remove-photo"
          type="button"
          disabled={busy}
          onClick={() => {
            onChange(null);
            setError("");
          }}
        >
          <Trash2 size={15} /> Remover imagem
        </button>
      )}
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
