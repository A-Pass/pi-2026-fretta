import { useState, type FormEvent } from "react";
import { ArrowLeft, Pencil, Plus, Trash2, Truck } from "lucide-react";
import type { Vehicle } from "@/contracts";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { validateVehicle, vehicleCategories, vehicleLabel } from "./rules";
type Props = {
  vehicles: Vehicle[];
  onSave: (vehicles: Vehicle[]) => Promise<boolean>;
  onBack: () => void;
};
export function VehicleBookView({ vehicles, onSave, onBack }: Props) {
  const [draft, setDraft] = useState<Vehicle | null>(null);
  const [removing, setRemoving] = useState<Vehicle | null>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  function edit(vehicle?: Vehicle) {
    setError("");
    setDraft(
      vehicle
        ? { ...vehicle }
        : {
            id: crypto.randomUUID(),
            category: "Utilitário",
            model: "",
            plate: "",
            description: "",
          },
    );
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft || busy) return;
    const clean = {
      ...draft,
      model: draft.model.trim(),
      description: draft.description.trim(),
    };
    const validation = validateVehicle(clean, vehicles);
    if (validation) {
      setError(validation);
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (await onSave([...vehicles.filter((v) => v.id !== clean.id), clean]))
        setDraft(null);
      else setError("Não foi possível salvar o veículo. Tente novamente.");
    } catch {
      setError("Não foi possível salvar o veículo. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button className="back" onClick={onBack}>
        <ArrowLeft size={18} /> Voltar ao meu perfil
      </button>
      <div className="section-head">
        <div>
          <span className="eyebrow">PRONTO PARA A PRÓXIMA VIAGEM</span>
          <h1>Meus veículos</h1>
        </div>
        {!draft && (
          <button className="primary" onClick={() => edit()}>
            <Plus size={18} /> Adicionar veículo
          </button>
        )}
      </div>
      <p className="muted">
        Escolha um veículo cadastrado ao enviar uma proposta. A placa não
        aparece nos cards públicos.
      </p>
      {draft ? (
        <section className="panel vehicle-editor">
          <h2>
            {vehicles.some((v) => v.id === draft.id)
              ? "Editar veículo"
              : "Novo veículo"}
          </h2>
          <form onSubmit={submit}>
            <fieldset className="plain-fieldset" disabled={busy}>
              <label>
                Categoria
                <select
                  value={draft.category}
                  onChange={(e) =>
                    setDraft({ ...draft, category: e.target.value })
                  }
                >
                  {vehicleCategories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                Marca e modelo
                <input
                  autoFocus
                  value={draft.model}
                  maxLength={80}
                  placeholder="Ex.: Fiat Fiorino"
                  onChange={(e) =>
                    setDraft({ ...draft, model: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Placa
                <input
                  value={draft.plate}
                  maxLength={8}
                  placeholder="ABC1D23"
                  autoCapitalize="characters"
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      plate: e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, ""),
                    })
                  }
                  required
                />
              </label>
              <label>
                Capacidade em kg (opcional)
                <input
                  type="number"
                  min="1"
                  step="1"
                  max="100000"
                  value={draft.capacityKg ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      capacityKg: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </label>
              <label>
                Características (opcional)
                <textarea
                  maxLength={600}
                  value={draft.description}
                  onChange={(e) =>
                    setDraft({ ...draft, description: e.target.value })
                  }
                  placeholder="Carroceria fechada, mantas de proteção…"
                />
              </label>
            </fieldset>
            {error && (
              <p className="alert" role="alert">
                {error}
              </p>
            )}
            <div className="actions">
              <button
                type="button"
                className="secondary"
                disabled={busy}
                onClick={() => setDraft(null)}
              >
                Descartar alterações
              </button>
              <button className="primary" disabled={busy}>
                {busy ? "Salvando…" : "Salvar veículo"}
              </button>
            </div>
          </form>
        </section>
      ) : (
        <div className="cards vehicle-cards">
          {vehicles.map((v) => (
            <article className="panel" key={v.id}>
              <Truck color="var(--orange)" />
              <h2>{vehicleLabel(v)}</h2>
              <p>Placa: {v.plate}</p>
              {v.capacityKg && <p>Capacidade: {v.capacityKg} kg</p>}
              <p>{v.description}</p>
              <div className="actions">
                <button className="secondary" onClick={() => edit(v)}>
                  <Pencil size={16} /> Editar
                </button>
                <button
                  className="secondary profile-logout"
                  onClick={() => setRemoving(v)}
                >
                  <Trash2 size={16} /> Excluir
                </button>
              </div>
            </article>
          ))}
          {!vehicles.length && (
            <section className="panel empty">
              <Truck />
              <h2>Cadastre seu primeiro veículo</h2>
              <p>Ele será usado para apresentar suas propostas aos clientes.</p>
              <button className="primary" onClick={() => edit()}>
                Adicionar veículo
              </button>
            </section>
          )}
        </div>
      )}
      <ConfirmDialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title="Excluir este veículo?"
        description={`O veículo ${removing?.model ?? ""} será removido do cadastro. Propostas e acordos anteriores manterão as informações originais.`}
        cancelLabel="Manter veículo"
        confirmLabel="Excluir veículo"
        onConfirm={async () => {
          if (!removing) return false;
          const ok = await onSave(vehicles.filter((v) => v.id !== removing.id));
          if (ok) setRemoving(null);
          return ok;
        }}
      />
    </>
  );
}
