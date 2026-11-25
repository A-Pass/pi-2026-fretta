"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Camera } from "lucide-react";

type Props = {
  disabled: boolean;
  onPhoto: (file: File) => void;
};

export function ProfileCamera({ disabled, onPhoto }: Props) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={trigger}
        className="photo-upload profile-camera-trigger"
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <Camera size={18} /> Tirar foto com a câmera
      </button>
      {open && (
        <CameraDialog
          onClose={() => {
            setOpen(false);
            trigger.current?.focus();
          }}
          onPhoto={onPhoto}
        />
      )}
    </>
  );
}

function CameraDialog({
  onClose,
  onPhoto,
}: {
  onClose: () => void;
  onPhoto: Props["onPhoto"];
}) {
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const modal = dialog.current!;
    const preview = video.current!;
    modal.showModal();
    let active = true;
    let stream: MediaStream | undefined;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (active && modal.open) preview.srcObject = stream;
        else stream.getTracks().forEach((track) => track.stop());
      } catch {
        if (active)
          setError(
            "Não foi possível abrir a câmera. Verifique a permissão do navegador ou escolha uma foto do aparelho.",
          );
      }
    }

    void startCamera();
    return () => {
      active = false;
      stream?.getTracks().forEach((track) => track.stop());
      preview.srcObject = null;
    };
  }, []);

  function capture() {
    const preview = video.current;
    const modal = dialog.current;
    if (!preview?.videoWidth || !preview.videoHeight || !modal) return;

    const canvas = document.createElement("canvas");
    const scale = Math.min(
      1,
      1280 / Math.max(preview.videoWidth, preview.videoHeight),
    );
    canvas.width = Math.round(preview.videoWidth * scale);
    canvas.height = Math.round(preview.videoHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) {
      setError("Não foi possível tirar a foto.");
      return;
    }

    setError("");
    setCapturing(true);
    context.drawImage(preview, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!modal.isConnected || !modal.open) return;
        setCapturing(false);
        if (!blob) {
          setError("Não foi possível tirar a foto. Tente novamente.");
          return;
        }
        modal.close();
        onPhoto(new File([blob], "foto-de-perfil.jpg", { type: blob.type }));
      },
      "image/jpeg",
      0.85,
    );
  }

  return (
    <dialog
      ref={dialog}
      className="profile-camera-dialog"
      aria-labelledby={titleId}
      onClose={onClose}
    >
      <h2 id={titleId}>Câmera</h2>
      <video
        ref={video}
        autoPlay
        muted
        playsInline
        onPlaying={() => setReady(true)}
      />
      {error ? (
        <p role="alert">{error}</p>
      ) : (
        !ready && <p role="status">Aguardando acesso à câmera…</p>
      )}
      <div className="profile-camera-actions">
        <button
          type="button"
          className="secondary"
          autoFocus
          onClick={() => dialog.current?.close()}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="primary"
          disabled={!ready || capturing}
          onClick={capture}
        >
          Tirar foto
        </button>
      </div>
    </dialog>
  );
}
