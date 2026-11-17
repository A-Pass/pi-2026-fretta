import { useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, MapPin } from "lucide-react";
import type { Address, SavedAddress } from "@/contracts";
import { AddressFields } from "./AddressFields";
import { addressError, emptyAddress } from "./rules";
import { ConfirmDialog } from "../../components/ConfirmDialog";
export function AddressBookView({
  addresses,
  onSave,
  onBack,
}: {
  addresses: SavedAddress[];
  onSave: (addresses: SavedAddress[]) => Promise<boolean>;
  onBack: () => void;
}) {
  const [editing, setEditing] = useState(false),
    [id, setId] = useState<string | null>(null),
    [draft, setDraft] = useState<Address>(emptyAddress()),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [removing, setRemoving] = useState<string | null>(null);
  function edit(a?: SavedAddress) {
    setId(a?.id || null);
    setDraft(
      a ? { ...a, point: a.point ? { ...a.point } : null } : emptyAddress(),
    );
    setError("");
    setEditing(true);
  }
  return (
    <>
      <button
        className="back"
        onClick={() => (editing ? setEditing(false) : onBack())}
        disabled={busy}
      >
        <ArrowLeft size={18} />
        {editing ? "Voltar aos endereços" : "Voltar ao meu perfil"}
      </button>
      <span className="eyebrow">SEUS LUGARES</span>
      <div className="section-head">
        <div>
          <h1>
            {editing
              ? id
                ? "Editar endereço"
                : "Novo endereço"
              : "Meus Endereços"}
          </h1>
          <p className="muted">
            {editing
              ? "Confira o ponto no mapa e preencha o endereço."
              : "Guarde seus locais para agilizar as próximas solicitações."}
          </p>
        </div>
        {!editing && (
          <button className="primary" onClick={() => edit()}>
            <Plus size={18} /> Adicionar endereço
          </button>
        )}
      </div>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      {editing ? (
        <section className="panel address-editor">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const message = addressError(draft, true);
              if (message) {
                setError(message);
                return;
              }
              setBusy(true);
              setError("");
              const next = { ...draft, id: id || crypto.randomUUID() };
              try {
                if (
                  await onSave(
                    id
                      ? addresses.map((a) => (a.id === id ? next : a))
                      : [...addresses, next],
                  )
                )
                  setEditing(false);
                else
                  setError(
                    "Não foi possível salvar o endereço. Tente novamente.",
                  );
              } catch {
                setError("Não foi possível salvar o endereço.");
              } finally {
                setBusy(false);
              }
            }}
          >
            <fieldset disabled={busy} className="plain-fieldset">
              <AddressFields
                value={draft}
                onChange={(a) => {
                  setDraft(a);
                  setError("");
                }}
                editingSaved
              />
              <div className="actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setEditing(false)}
                >
                  Descartar alterações
                </button>
                <button className="primary">
                  {busy ? "Salvando…" : "Salvar endereço"}
                </button>
              </div>
            </fieldset>
          </form>
        </section>
      ) : (
        <div className="address-cards">
          {addresses.map((a) => (
            <article className="panel saved-address" key={a.id}>
              <span className="type-icon">
                <MapPin />
              </span>
              <h2>{a.label}</h2>
              <p>
                {a.street}, {a.number}
                {a.complement ? ` · ${a.complement}` : ""}
                <br />
                {a.neighborhood}, {a.city} · {a.state}
              </p>
              <div className="actions">
                <button className="secondary" onClick={() => edit(a)}>
                  <Pencil size={16} /> Editar
                </button>
                <button className="danger" onClick={() => setRemoving(a.id)}>
                  <Trash2 size={16} /> Excluir
                </button>
              </div>
            </article>
          ))}
          {!addresses.length && (
            <section className="panel empty">
              <MapPin />
              <h2>Seus endereços ficam aqui</h2>
              <p>Adicione sua casa, seu trabalho ou outro local frequente.</p>
              <button className="primary" onClick={() => edit()}>
                Adicionar primeiro endereço
              </button>
            </section>
          )}
        </div>
      )}
      <ConfirmDialog
        open={!!removing}
        onClose={() => setRemoving(null)}
        title="Excluir este endereço?"
        description="O endereço será removido da sua lista. As solicitações já criadas continuarão com seus endereços originais."
        cancelLabel="Manter endereço"
        confirmLabel="Excluir endereço"
        onConfirm={async () => {
          const ok = await onSave(addresses.filter((a) => a.id !== removing));
          if (ok) setRemoving(null);
          return ok;
        }}
      />
    </>
  );
}
