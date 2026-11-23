"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Camera, Package, Truck } from "lucide-react";
import type { Role } from "@/contracts";
import { api } from "../api/client";
import { prepareOnboardingPhoto } from "../features/onboarding/images";
import { authClient } from "./client";
import { identityDocumentError, type IdentityDocument } from "./registration";

type Props = {
  name: string;
  email: string;
  image: string | null;
  role: Role;
};

export function AuthCompleteView({ name, email, image, role }: Props) {
  const [pending, setPending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState(name);
  const [documentType, setDocumentType] = useState<IdentityDocument>(
    role === "motorista" ? "cnh" : "cpf",
  );
  const [documentValue, setDocumentValue] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(image || "");
  const [readingPhoto, setReadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");

  async function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setReadingPhoto(true);
    setPhotoError("");
    try {
      const prepared = await prepareOnboardingPhoto(file);
      setProfilePhoto(prepared.dataUrl);
    } catch (failure) {
      setPhotoError(
        failure instanceof Error
          ? failure.message
          : "Não foi possível abrir a imagem.",
      );
    } finally {
      setReadingPhoto(false);
    }
  }

  async function completeRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const normalizedName = fullName.trim();
    if (!normalizedName || normalizedName.length > 120) {
      setError("Informe seu nome, com no máximo 120 caracteres.");
      return;
    }
    const documentValidation = identityDocumentError(
      role,
      documentType,
      documentValue,
    );
    if (documentValidation) {
      setError(documentValidation);
      return;
    }

    setSaving(true);
    try {
      const store = await api.load();
      await api.save({
        ...store,
        accountSetupComplete: true,
        profile: {
          id: store.profile?.id || "",
          name: normalizedName,
          photo: profilePhoto,
        },
      });
      setDocumentValue("");
      window.location.assign(`/${role}/inicio`);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Não foi possível concluir o cadastro. Tente novamente.",
      );
      setSaving(false);
    }
  }

  async function signOut() {
    setPending(true);
    setError("");
    try {
      const { error: signOutError } = await authClient.signOut();
      if (signOutError) {
        setError("Não foi possível encerrar a sessão. Tente novamente.");
        setPending(false);
        return;
      }
      window.location.assign("/");
    } catch {
      setError("Não foi possível encerrar a sessão. Tente novamente.");
      setPending(false);
    }
  }

  return (
    <main className="login-page">
      <div className="brand">
        <span>FRETTA</span>
        <span>•</span>
      </div>
      <section
        className="login-card auth-complete-card"
        aria-labelledby="auth-title"
      >
        <span className="eyebrow">SÓ MAIS UM PASSO</span>
        <h1 id="auth-title">Complete seu cadastro</h1>
        <p className="auth-account-email">{email}</p>
        <div className="auth-role">
          {role === "motorista" ? <Truck size={18} /> : <Package size={18} />}
          Perfil de <strong>{role}</strong>
        </div>
        {error && (
          <p className="login-notice" role="alert">
            {error}
          </p>
        )}
        <form
          className="login-form auth-complete-form"
          onSubmit={(event) => void completeRegistration(event)}
        >
          <label>
            Nome
            <input
              autoComplete="name"
              maxLength={120}
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </label>

          <div className="auth-photo-field">
            <span>Foto de perfil</span>
            <div className="auth-photo-preview">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={`Foto de ${fullName || "perfil"}`}
                />
              ) : (
                <span aria-label="Nenhuma foto selecionada">
                  {(fullName.trim().slice(0, 2) || "FR").toUpperCase()}
                </span>
              )}
            </div>
            <label className="photo-upload auth-photo-upload">
              <Camera size={17} />
              {readingPhoto ? "Preparando foto…" : "Escolher outra foto"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={readingPhoto || saving}
                onChange={(event) => void choosePhoto(event)}
              />
            </label>
            {photoError && (
              <p className="login-notice" role="alert">
                {photoError}
              </p>
            )}
            <small>JPG, PNG ou WebP · até 5 MB · mínimo 200 × 200 pixels</small>
          </div>

          <label>
            {role === "motorista" ? "Carteira de motorista (CNH)" : "Documento"}
            {role === "cliente" && (
              <select
                value={documentType}
                onChange={(event) =>
                  setDocumentType(event.target.value as IdentityDocument)
                }
              >
                <option value="cpf">CPF</option>
                <option value="rg">RG</option>
              </select>
            )}
            <input
              autoComplete="off"
              inputMode={documentType === "rg" ? "text" : "numeric"}
              maxLength={documentType === "rg" ? 20 : 18}
              required
              value={documentValue}
              onChange={(event) => setDocumentValue(event.target.value)}
            />
          </label>
          <p className="auth-privacy-note">
            Para sua segurança, o documento é validado somente neste navegador e
            não é enviado nem salvo. O envio privado de documentos ainda não
            está disponível.
          </p>
          <button
            className="primary auth-complete-submit"
            type="submit"
            disabled={saving || readingPhoto}
          >
            {saving ? "Salvando cadastro…" : "Concluir cadastro"}
          </button>
        </form>
        <button
          className="secondary auth-sign-out"
          type="button"
          disabled={pending || saving}
          onClick={() => void signOut()}
        >
          {pending ? "Encerrando sessão…" : "Encerrar sessão"}
        </button>
      </section>
      <footer>FRETTA · Conectando pessoas, movimentando histórias.</footer>
    </main>
  );
}
