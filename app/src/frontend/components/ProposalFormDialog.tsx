import { useEffect, useRef, useState, type FormEvent } from "react";
import { fromLocalDateTime, localDateTime } from "../lib/dates";
import { vehicleLabel } from "../features/vehicles/rules";
import { X } from "lucide-react";
import type { Proposal, ProposalOffer, Vehicle } from "@/contracts";

type Props = {
  proposal?: Proposal;
  vehicles: Vehicle[];
  onManageVehicles: () => void;
  onClose: () => void;
  onSubmit: (offer: ProposalOffer) => Promise<boolean>;
};
export function ProposalFormDialog({
  proposal,
  vehicles,
  onManageVehicles,
  onClose,
  onSubmit,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const priceInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    priceInput.current?.focus();
    return () => el?.close();
  }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const vehicle = vehicles.find((v) => v.id === data.get("vehicle"));
      if (!vehicle) throw new Error("Selecione um veículo cadastrado.");
      const availableAt = fromLocalDateTime(String(data.get("date")));
      if (Date.parse(availableAt) <= Date.now())
        throw new Error("Escolha uma disponibilidade futura.");
      const priceCents = Math.round(Number(data.get("price")) * 100);
      if (
        !Number.isSafeInteger(priceCents) ||
        priceCents <= 0 ||
        priceCents > 100000000
      )
        throw new Error("Informe um valor entre R$ 0,01 e R$ 1.000.000.");
      const ok = await onSubmit({
        id: crypto.randomUUID(),
        priceCents,
        vehicle: vehicleLabel(vehicle),
        vehicleId: vehicle.id,
        availableAt,
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
        <h2 id="new-proposal-title">
          {proposal ? "Nova proposta" : "Sua proposta"}
        </h2>
        <button
          aria-label="Fechar nova proposta"
          disabled={pending}
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <p className="muted">
        {proposal
          ? "A proposta anterior continuará no histórico. Somente esta poderá ser aceita."
          : "Informe o valor, o veículo e como você pode ajudar."}
      </p>
      {!vehicles.length ? (
        <div className="empty">
          <p>Cadastre um veículo para enviar sua proposta.</p>
          <button className="primary" onClick={onManageVehicles}>
            Cadastrar veículo
          </button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <fieldset className="plain-fieldset" disabled={pending}>
            <label>
              Valor (R$)
              <input
                ref={priceInput}
                autoFocus
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                defaultValue={proposal ? proposal.priceCents / 100 : undefined}
                max="1000000"
                required
              />
            </label>
            <label>
              Veículo
              <select
                name="vehicle"
                defaultValue={proposal?.vehicleId || ""}
                required
              >
                <option value="" disabled>
                  Selecione seu veículo
                </option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {vehicleLabel(v)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Disponibilidade
              <input
                name="date"
                type="datetime-local"
                min={localDateTime()}
                defaultValue={
                  proposal
                    ? localDateTime(new Date(proposal.availableAt))
                    : undefined
                }
                required
              />
            </label>
            <label>
              Comentário
              <textarea
                name="message"
                placeholder="Explique o que está incluído e os detalhes combinados…"
                maxLength={2000}
                defaultValue={proposal?.message}
                required
              />
            </label>
          </fieldset>
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
      )}
    </dialog>
  );
}
