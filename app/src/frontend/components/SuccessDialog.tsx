import { useEffect, useRef, useId } from "react";
import { Check, X } from "lucide-react";
type Props = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
};
export function SuccessDialog({ open, title, description, onClose }: Props) {
  const titleId = useId(),
    descriptionId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const confirmButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      confirmButton.current?.focus();
    } else dialog.current?.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className="success-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
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
      <h2 id={titleId}>{title}</h2>
      <p id={descriptionId}>{description}</p>
      <button
        ref={confirmButton}
        autoFocus
        className="success-button"
        onClick={onClose}
      >
        Entendi
      </button>
    </dialog>
  );
}
