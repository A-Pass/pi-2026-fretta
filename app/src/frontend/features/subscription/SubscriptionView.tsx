import { useState } from "react";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { ConfirmDialog } from "../../components/ConfirmDialog";
export function SubscriptionView({
  active,
  onChange,
  onBack,
}: {
  active: boolean;
  onChange: (active: boolean) => Promise<boolean>;
  onBack: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
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
          {active ? "Assinatura ativa" : "Assinatura inativa"}
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
        <p>
          Seu histórico e o atendimento de fretes já contratados continuam
          acessíveis quando a assinatura está inativa.
        </p>
        <button className="primary" onClick={() => setConfirm(true)}>
          {active ? "Registrar vencimento" : "Solicitar ativação"}
        </button>
        <p className="muted">
          A confirmação de pagamento é processada pelo servidor. Nenhuma cobrança ocorre nesta tela.
        </p>
      </section>
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title={
          active
            ? "Alterar para assinatura inativa?"
            : "Solicitar ativação da assinatura?"
        }
        description={
          active
            ? "Você poderá conferir a experiência com a assinatura vencida, preservando os serviços contratados."
            : "A ativação depende da confirmação do pagamento pelo servidor."
        }
        confirmLabel={active ? "Alterar status" : "Solicitar ativação"}
        cancelLabel="Voltar"
        destructive={false}
        onConfirm={async () => {
          const ok = await onChange(!active);
          if (ok) setConfirm(false);
          return ok;
        }}
      />
    </>
  );
}
