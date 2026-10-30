import { useEffect, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { Proposal, ProposalOffer } from "@/contracts";

type Props = {
  proposal: Proposal;
  onClose: () => void;
  onSubmit: (offer: ProposalOffer) => Promise<boolean>;
};
export function ProposalFormDialog({ proposal, onClose, onSubmit }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    return () => el?.close();
  }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setPending(true);
    setError("");
    try {
      const ok = await onSubmit({
        id: crypto.randomUUID(),
        priceCents: Math.round(Number(data.get("price")) * 100),
        vehicle: String(data.get("vehicle")).trim(),
        availableAt: String(data.get("date")),
        message: String(data.get("message")).trim(),
        createdAt: new Date().toISOString(),
        status: "PENDENTE",
      });
      if (ok) onClose();
      else setError("Não foi possível enviar. Tente novamente.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível enviar.");
    } finally {
      setPending(false);
    }
  }
  return (
    <dialog
      ref={dialog}
      className="confirm-dialog proposal-form-dialog"
      aria-labelledby="new-proposal-title"
      onCancel={(e) => {
        e.preventDefault();
        if (!pending) onClose();
      }}
    >
      <div className="section-head">
        <h2 id="new-proposal-title">Nova proposta</h2>
        <button
          aria-label="Fechar nova proposta"
          disabled={pending}
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <p className="muted">
        A proposta anterior continuará no histórico. Somente esta poderá ser
        aceita.
      </p>
      <form onSubmit={submit}>
        <label>
          Valor (R$)
          <input
            autoFocus
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            defaultValue={proposal.priceCents / 100}
            required
          />
        </label>
        <label>
          Veículo
          <input
            name="vehicle"
            defaultValue={proposal.vehicle}
            maxLength={120}
            required
          />
        </label>
        <label>
          Disponibilidade
          <input name="date" type="datetime-local" required />
        </label>
        <label>
          Comentário
          <textarea
            name="message"
            placeholder="Explique o que está incluído e os detalhes combinados…"
            maxLength={2000}
            required
          />
        </label>
        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        <div className="confirm-actions">
          <button
            type="button"
            className="secondary"
            disabled={pending}
            onClick={onClose}
          >
            Voltar
          </button>
          <button className="primary" disabled={pending}>
            {pending ? "Enviando…" : "Enviar proposta"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
