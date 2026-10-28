import { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
type Props = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
};
export function SuccessDialog({ open, title, description, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className="success-dialog"
      aria-labelledby="success-title"
      aria-describedby="success-description"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <button
        className="success-close"
        aria-label="Fechar confirmação de sucesso"
        onClick={onClose}
      >
        <X size={20} />
      </button>
      <div className="success-check" aria-hidden="true">
        <Check size={36} strokeWidth={2.8} />
      </div>
      <span className="success-eyebrow">TUDO CERTO!</span>
      <h2 id="success-title">{title}</h2>
      <p id="success-description">{description}</p>
      <button autoFocus className="success-button" onClick={onClose}>
        Entendi
      </button>
    </dialog>
  );
}
