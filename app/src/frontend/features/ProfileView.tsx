import { useState } from "react";
import { ArrowLeft, Camera, Pencil, User, X } from "lucide-react";
import type { Role } from "@/contracts";
import { resetDemo } from "../api/client";
type Props = {
  onAddresses: () => void;
  name: string;
  setName: (s: string) => void;
  photo: string;
  setPhoto: (s: string) => void;
  role: Role;
  subscription: boolean;
  setSubscription: (b: boolean) => void;
  flash: (s: string) => void;
  setEntered: (b: boolean) => void;
};
export function ProfileView({
  onAddresses,
  name,
  setName,
  photo,
  setPhoto,
  role,
  subscription,
  setSubscription,
  flash,
  setEntered,
}: Props) {
  const [editing, setEditing] = useState(false),
    [draftName, setDraftName] = useState(name),
    [draftPhoto, setDraftPhoto] = useState(photo),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  if (editing)
    return (
      <>
        <button className="back" onClick={() => setEditing(false)}>
          <ArrowLeft size={18} /> Voltar ao meu perfil
        </button>
        <span className="eyebrow">DO SEU JEITO</span>
        <h1>Editar perfil</h1>
        <section className="panel profile profile-editor">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = draftName.trim();
              if (!n) {
                setError("Informe seu nome de exibição.");
                return;
              }
              setName(n);
              setPhoto(draftPhoto);
              setEditing(false);
              flash("Perfil atualizado nesta sessão.");
            }}
          >
            <div className="profile-photo-preview">
              {draftPhoto ? (
                <img
                  className="profile-photo"
                  src={draftPhoto}
                  alt="Prévia da foto de perfil"
                />
              ) : (
                <span className="avatar large">
                  {draftName.trim().slice(0, 2).toUpperCase() || <User />}
                </span>
              )}
            </div>
            <label className="photo-upload">
              <Camera size={18} /> Alterar foto de perfil
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={loading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  if (
                    !["image/jpeg", "image/png", "image/webp"].includes(
                      file.type,
                    ) ||
                    file.size > 2000000
                  ) {
                    setError("Escolha uma foto JPG, PNG ou WebP de até 2 MB.");
                    return;
                  }
                  setLoading(true);
                  setError("");
                  const reader = new FileReader();
                  reader.onload = () => {
                    setDraftPhoto(String(reader.result));
                    setLoading(false);
                  };
                  reader.onerror = () => {
                    setError("Não foi possível abrir a foto.");
                    setLoading(false);
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            <p className="muted photo-help">JPG, PNG ou WebP · até 2 MB</p>
            {draftPhoto && (
              <button
                className="remove-photo"
                type="button"
                onClick={() => setDraftPhoto("")}
              >
                <X size={14} /> Remover foto
              </button>
            )}
            <label>
              Nome de exibição
              <input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                maxLength={80}
                required
                autoComplete="nickname"
              />
            </label>
            {error && (
              <p className="alert" role="alert">
                {error}
              </p>
            )}
            <div className="actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setEditing(false)}
              >
                Descartar alterações
              </button>
              <button className="primary" disabled={loading}>
                {loading ? "Carregando foto…" : "Salvar alterações"}
              </button>
            </div>
          </form>
        </section>
      </>
    );
  return (
    <>
      <span className="eyebrow">DO SEU JEITO</span>
      <h1>Meu perfil</h1>
      <section className="panel profile">
        {photo ? (
          <img className="profile-photo" src={photo} alt={`Foto de ${name}`} />
        ) : (
          <div className="avatar large">{name.slice(0, 2).toUpperCase()}</div>
        )}
        <h2>{name}</h2>
        <p>
          {role === "cliente" ? "Cliente" : "Motorista"} · Conta de demonstração
        </p>
        <button
          className="primary"
          onClick={() => {
            setDraftName(name);
            setDraftPhoto(photo);
            setError("");
            setEditing(true);
          }}
        >
          <Pencil size={17} /> Editar perfil
        </button>
        <button className="secondary profile-return" onClick={onAddresses}>
          Meus Endereços{" "}
          <ArrowLeft size={16} style={{ transform: "rotate(180deg)" }} />
        </button>
        {role === "motorista" && (
          <div className="subscription">
            <h3>Assinatura do motorista</h3>
            <p>R$ 49,90/mês · cobrança real pendente de integração.</p>
            <button
              className="secondary"
              onClick={() => setSubscription(!subscription)}
            >
              {subscription
                ? "Simular assinatura vencida"
                : "Simular assinatura ativa"}
            </button>
            <p>
              {subscription
                ? "Ativa na demonstração"
                : "Vencida na demonstração"}
            </p>
          </div>
        )}
        <button
          className="secondary profile-return"
          onClick={() => setEntered(false)}
        >
          Voltar à seleção de perfil
        </button>
        <button
          className="danger"
          onClick={() => {
            if (confirm("Apagar os dados locais e restaurar os exemplos?"))
              resetDemo();
          }}
        >
          Restaurar demonstração
        </button>
      </section>
    </>
  );
}
