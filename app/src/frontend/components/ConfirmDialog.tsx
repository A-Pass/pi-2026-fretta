import { useEffect, useId, useRef, useState } from "react";
import { CircleAlert, X } from "lucide-react";
type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  pendingLabel?: string;
  destructive?: boolean;
  onConfirm: () => Promise<boolean>;
};
export function ConfirmDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  cancelLabel = "Manter solicitação",
  pendingLabel = "Processando…",
  destructive = true,
  onConfirm,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [pending, setPending] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    if (open) {
      setError("");
      dialog.current?.showModal();
    } else dialog.current?.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className="confirm-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(e) => {
        e.preventDefault();
        if (!pending) onClose();
      }}
    >
      <div className="section-head">
        <span className="confirm-symbol">
          <CircleAlert size={27} />
        </span>
        <button
          aria-label="Fechar confirmação"
          disabled={pending}
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <h2 id={titleId}>{title}</h2>
      <p id={descriptionId} className="muted">
        {description}
      </p>
      {error && (
        <p role="alert" className="alert">
          {error}
        </p>
      )}
      <div className="confirm-actions">
        <button
          className="secondary"
          autoFocus
          disabled={pending}
          onClick={onClose}
        >
          {cancelLabel}
        </button>
        <button
          className={destructive ? "primary cancel-confirm" : "primary"}
          disabled={pending}
          onClick={async () => {
            setPending(true);
            try {
              if (!(await onConfirm()))
                setError("Não foi possível concluir. Tente novamente.");
            } catch {
              setError("Não foi possível concluir. Tente novamente.");
            } finally {
              setPending(false);
            }
          }}
        >
          {pending ? pendingLabel : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
