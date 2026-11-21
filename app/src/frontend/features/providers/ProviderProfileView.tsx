import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  MessageCircle,
  Star,
  Truck,
  UserRound,
} from "lucide-react";
import type { PublicProviderProfile } from "@/contracts";
import { dateTime } from "../../lib/dates";
import { EmptyState } from "../../components/EmptyState";
export function ProviderProfileView({
  provider,
  onBack,
  onConversation,
  preview = false,
}: {
  provider: PublicProviderProfile | null;
  onBack: () => void;
  onConversation?: () => void;
  preview?: boolean;
}) {
  const [visible, setVisible] = useState(6);
  if (!provider)
    return (
      <EmptyState title="Perfil não encontrado">
        Este prestador não está disponível neste exemplo.
        <button className="secondary" onClick={onBack}>
          Voltar
        </button>
      </EmptyState>
    );
  return (
    <>
      <button className="back" onClick={onBack}>
        <ArrowLeft size={18} /> Voltar
      </button>
      <span className="eyebrow">
        {preview ? "PRÉVIA DO SEU PERFIL PÚBLICO" : "CONHEÇA QUEM VAI COM VOCÊ"}
      </span>
      <section className="panel provider-hero">
        <div
          className={`provider-avatar ${provider.kind === "empresa" ? "company-avatar" : ""}`}
        >
          {provider.photo ? (
            <img
              src={provider.photo}
              alt={
                provider.kind === "empresa"
                  ? `Logo de ${provider.name}`
                  : `Foto de ${provider.name}`
              }
            />
          ) : provider.kind === "empresa" ? (
            <Building2 size={42} />
          ) : (
            <UserRound size={42} />
          )}
        </div>
        <div>
          <span className="badge">
            {provider.kind === "empresa"
              ? "Empresa · um motorista responsável"
              : "Motorista autônomo"}
          </span>
          <h1>{provider.name}</h1>
          {provider.city && <p className="muted">{provider.city}</p>}
          <p className="muted">
            Perfil público com informações e avaliações recebidas em serviços concluídos.
          </p>
        </div>
        {onConversation && (
          <button className="primary" onClick={onConversation}>
            <MessageCircle size={18} /> Conversar
          </button>
        )}
      </section>
      <div className="provider-stats">
        <section className="panel">
          <Star size={22} />
          <b>
            {provider.rating === null
              ? "Novo por aqui"
              : provider.rating.toFixed(1).replace(".", ",")}
          </b>
          <span>
            {provider.reviewCount}{" "}
            {provider.reviewCount === 1 ? "avaliação" : "avaliações"}
          </span>
        </section>
        <section className="panel">
          <Truck size={22} />
          <b>{provider.completedCount}</b>
          <span>
            {provider.completedCount === 1
              ? "frete concluído"
              : "fretes concluídos"}
          </span>
        </section>
      </div>
      {provider.about && (
        <section className="panel provider-section">
          <h2>Sobre {provider.name}</h2>
          <p className="preserve-lines">{provider.about}</p>
        </section>
      )}
      {provider.kind === "empresa" && (
        <section className="panel provider-section">
          <h2>Motorista responsável</h2>
          <div className="provider-driver">
            {provider.driver.photo ? (
              <img
                className="avatar large"
                src={provider.driver.photo}
                alt={`Foto de ${provider.driver.name}`}
              />
            ) : (
              <span className="avatar large">
                {provider.driver.name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <div>
              <h3>{provider.driver.name}</h3>
              <p className="muted">
                A proposta informa o veículo e o motorista responsáveis por
                aquele serviço.
              </p>
            </div>
          </div>
        </section>
      )}
      <section className="panel provider-section">
        <h2>Veículos e capacidade</h2>
        <div className="provider-vehicles">
          {provider.vehicles.map((v, i) => (
            <article key={i}>
              <Truck size={22} />
              <div>
                <h3>
                  {v.category}
                  {v.model ? ` · ${v.model}` : ""}
                </h3>
                {v.capacityKg && <p>Capacidade informada: {v.capacityKg} kg</p>}
                {v.description && <p>{v.description}</p>}
              </div>
            </article>
          ))}
        </div>
        {!provider.vehicles.length && (
          <p className="muted">
            Os veículos ainda não foram informados neste perfil.
          </p>
        )}
      </section>
      <section className="panel provider-section">
        <h2>Avaliações de clientes</h2>
        {provider.reviews.slice(0, visible).map((r) => (
          <article key={r.id} className="public-review">
            <div>
              <b>Cliente</b>
              <span aria-label={`${r.score} de 5 estrelas`}>
                {"★".repeat(r.score)}
                {"☆".repeat(5 - r.score)}
              </span>
            </div>
            {r.comment ? (
              <p className="preserve-lines">{r.comment}</p>
            ) : (
              <p className="muted">Avaliação sem comentário público.</p>
            )}
            {r.date && <time>{dateTime(r.date)}</time>}
          </article>
        ))}
        {!provider.reviews.length && (
          <p className="muted">
            Este prestador ainda não recebeu avaliações de fretes concluídos
          </p>
        )}
        {visible < provider.reviews.length && (
          <button className="secondary" onClick={() => setVisible(visible + 6)}>
            Mostrar mais avaliações
          </button>
        )}
      </section>
    </>
  );
}
