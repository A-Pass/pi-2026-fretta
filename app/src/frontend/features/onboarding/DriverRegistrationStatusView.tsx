import { useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Clock3,
  LogOut,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
  Truck,
} from "lucide-react";
import type { Store } from "@/contracts";
import { driverCanPropose, licenseDateValid } from "./rules";
import { dateTime } from "../../lib/dates";
type Props = {
  store: Store;
  save: (store: Store) => Promise<boolean>;
  onUpdate: () => void;
  onHome: () => void;
  onProfile: () => void;
  onVehicles: () => void;
  onServices: () => void;
  onConversations: () => void;
  onBack: () => void;
  onClient?: () => void;
  onLogout: () => void;
};
export function DriverRegistrationStatusView({
  store,
  save,
  onUpdate,
  onHome,
  onProfile,
  onVehicles,
  onServices,
  onConversations,
  onBack,
  onClient,
  onLogout,
}: Props) {
  const registration = store.driverRegistration!;
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [registration.status]);
  const approved = driverCanPropose(store);
  const pending = registration.status === "EM_ANALISE";
  const rejected = registration.status === "AJUSTES_SOLICITADOS";
  const needsUpdate = registration.status === "APROVADO" && !approved;
  const title = approved
    ? "Seu cadastro está aprovado"
    : pending
      ? "Cadastro recebido. Agora vem a análise."
      : rejected
        ? "Precisamos de alguns ajustes"
        : "Vamos atualizar seu cadastro?";
  return (
    <div className="driver-onboarding-page">
      <header className="onboarding-header">
        <span className="brand">
          <Truck /> FRETTA<span>•</span>
        </span>
        <button className="back" onClick={onLogout}>
          <LogOut size={17} /> Sair
        </button>
      </header>
      <main className="onboarding-main">
        <button type="button" className="back onboarding-back" onClick={onBack}>
          <ArrowLeft size={17} aria-hidden="true" /> Voltar ao meu perfil
        </button>
        <section
          className={`panel onboarding-status ${approved ? "approved" : rejected || needsUpdate ? "attention" : "pending"}`}
        >
          <span className="onboarding-status-icon">
            {approved ? (
              <BadgeCheck size={38} />
            ) : rejected || needsUpdate ? (
              <TriangleAlert size={38} />
            ) : (
              <Clock3 size={38} />
            )}
          </span>
          <span className="eyebrow">CADASTRO DO MOTORISTA</span>
          <h1 ref={heading} tabIndex={-1}>
            {title}
          </h1>
          <p>
            {approved
              ? "Você já pode configurar sua área de operação, buscar oportunidades e enviar propostas sem precisar de assinatura."
              : pending
                ? "A documentação foi selecionada e os dados foram conferidos no formulário. O envio ainda não significa que sua identidade ou habilitação foram verificadas."
                : rejected
                  ? registration.feedback
                  : "Mantenha sua foto, a habilitação e pelo menos um veículo atualizados para enviar propostas."}
          </p>
          <div className="registration-summary">
            <div className="registration-profile">
              {store.profile?.photo && (
                <img
                  src={store.profile.photo}
                  alt={`Foto de ${registration.fullName}`}
                />
              )}
              <div>
                <h2>{registration.fullName}</h2>
                <p>
                  {registration.personType === "pj"
                    ? registration.companyName
                    : "Pessoa física"}
                </p>
              </div>
            </div>
            <dl className="onboarding-review-list">
              <div>
                <dt>CPF</dt>
                <dd>{registration.cpfMasked}</dd>
              </div>
              {registration.cnpjMasked && (
                <div>
                  <dt>CNPJ</dt>
                  <dd>{registration.cnpjMasked}</dd>
                </div>
              )}
              <div>
                <dt>Habilitação</dt>
                <dd>
                  Categoria {registration.license.category} · validade{" "}
                  {registration.license.expiresOn
                    .split("-")
                    .reverse()
                    .join("/")}
                </dd>
              </div>
              <div>
                <dt>Envio</dt>
                <dd>{dateTime(registration.submittedAt)}</dd>
              </div>
              <div>
                <dt>Situação</dt>
                <dd>
                  {pending
                    ? "Em análise"
                    : rejected
                      ? "Ajustes solicitados"
                      : approved
                        ? "Aprovado"
                        : "Atualização necessária"}
                </dd>
              </div>
            </dl>
          </div>
          {needsUpdate && (
            <div className="registration-requirements">
              {!store.profile?.photo && (
                <button className="secondary" onClick={onProfile}>
                  Adicionar foto de perfil
                </button>
              )}
              {!store.vehicles?.length && (
                <button className="secondary" onClick={onVehicles}>
                  Cadastrar veículo
                </button>
              )}
              {!licenseDateValid(registration.license.expiresOn) && (
                <p className="alert">
                  Atualize sua CNH antes de enviar novas propostas.
                </p>
              )}
            </div>
          )}
          <div className="onboarding-status-actions">
            {approved ? (
              <button className="primary" onClick={onHome}>
                Ir para o início <ArrowRight size={18} />
              </button>
            ) : (
              (rejected || needsUpdate) && (
                <button className="primary" onClick={onUpdate}>
                  <RefreshCw size={18} /> Corrigir cadastro
                </button>
              )
            )}
            {approved && (
              <button className="secondary" onClick={onUpdate}>
                Atualizar cadastro
              </button>
            )}
            {pending && (
              <button className="secondary" onClick={onUpdate}>
                Revisar e reenviar cadastro
              </button>
            )}
          </div>
          <p className="muted">
            Serviços já contratados e conversas continuam disponíveis enquanto
            você acompanha o cadastro.
          </p>
          <div className="registration-existing-links">
            <button className="secondary" onClick={onServices}>
              Meus serviços
            </button>
            <button className="secondary" onClick={onConversations}>
              Conversas
            </button>
            {onClient && (
              <button className="back" onClick={onClient}>
                Continuar como cliente
              </button>
            )}
          </div>
          <div className="onboarding-note">
            <ShieldCheck size={20} />
            <span>
              <b>Análise do cadastro</b> · Os documentos são tratados por um fluxo privado e só podem ser revisados por pessoas autorizadas.
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
