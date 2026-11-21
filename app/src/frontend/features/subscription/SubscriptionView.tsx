import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
export function SubscriptionView({ onBack }: { onBack: () => void }) {
  return (
    <>
      <button className="back" onClick={onBack}>
        <ArrowLeft size={18} /> Voltar ao meu perfil
      </button>
      <span className="eyebrow">MAIS CAMINHOS PARA SEU TRABALHO</span>
      <h1>Minha assinatura</h1>
      <section className="panel subscription-page">
        <ShieldCheck size={34} color="var(--orange)" />
        <h2>Plano do motorista</h2>
        <p className="plan-price">
          R$ 49,90 <small>/ mês</small>
        </p>
        <span className="badge">
          Assinatura inativa
        </span>
        <ul>
          <li>
            <Check size={16} /> Buscar solicitações na sua área
          </li>
          <li>
            <Check size={16} /> Enviar propostas e negociar no chat
          </li>
          <li>
            <Check size={16} /> Alterar a base para encontrar fretes de retorno
          </li>
        </ul>
        <p>Planos e valores serão informados quando a integração estiver disponível.</p>
        <button className="primary" disabled>
          Assinatura indisponível
        </button>
        <p className="muted">
          A ativação ficará disponível quando houver uma integração de pagamento
          e confirmação pelo servidor.
        </p>
      </section>
    </>
  );
}
