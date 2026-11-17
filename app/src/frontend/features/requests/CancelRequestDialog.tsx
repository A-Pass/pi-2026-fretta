import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Freight } from "@/contracts";
import { ConfirmDialog } from "../../components/ConfirmDialog";
export function CancelRequestDialog({
  freight,
  onClose,
  onConfirm,
}: {
  freight: Freight;
  onClose: () => void;
  onConfirm: (
    reason: string,
    expectedStatus: Freight["status"],
  ) => Promise<boolean>;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    [reason, setReason] = useState(""),
    [confirm, setConfirm] = useState(false),
    [status] = useState(freight.status);
  useEffect(() => {
    dialog.current?.showModal();
    return () => dialog.current?.close();
  }, []);
  return (
    <>
      <dialog
        ref={dialog}
        className="confirm-dialog cancel-request-dialog"
        aria-labelledby="cancel-request-title"
        onCancel={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <div className="section-head">
          <h2 id="cancel-request-title">Cancelar frete</h2>
          <button aria-label="Fechar cancelamento" onClick={onClose}>
            <X />
          </button>
        </div>
        <p>
          {status === "AGENDADO"
            ? "Este frete já foi combinado com um prestador. O cancelamento será registrado e os envolvidos serão avisados."
            : "As propostas serão encerradas e a solicitação deixará de receber ofertas."}{" "}
          Não haverá cobrança pela plataforma.
        </p>
        <label>
          Motivo do cancelamento
          <textarea
            value={reason}
            maxLength={1000}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explique o motivo sem incluir dados pessoais."
          />
        </label>
        <small>{reason.length}/1000 caracteres · mínimo de 10.</small>
        <div className="actions">
          <button className="secondary" onClick={onClose}>
            Manter frete
          </button>
          <button
            className="primary cancel-confirm"
            disabled={reason.trim().length < 10}
            onClick={() => setConfirm(true)}
          >
            Continuar cancelamento
          </button>
        </div>
      </dialog>
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Confirmar cancelamento do frete?"
        description={`Motivo: ${reason.trim()}. O histórico e as conversas serão preservados. Esta ação não reabre propostas anteriores.`}
        confirmLabel="Confirmar cancelamento"
        cancelLabel="Voltar"
        onConfirm={async () => {
          const ok = await onConfirm(reason, status);
          if (ok) setConfirm(false);
          return ok;
        }}
      />
    </>
  );
}
