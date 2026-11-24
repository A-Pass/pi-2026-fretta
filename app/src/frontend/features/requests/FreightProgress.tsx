import {
  Check,
  Clock3,
  Truck,
  PackageCheck,
  CalendarCheck,
} from "lucide-react";
import type { Freight } from "@/contracts";
import { dateTime } from "../../lib/dates";
const stages = [
  { status: "ABERTO", label: "Aguardando propostas", Icon: Clock3 },
  { status: "AGENDADO", label: "Agendado", Icon: CalendarCheck },
  { status: "EM_TRANSPORTE", label: "Em transporte", Icon: Truck },
  { status: "CONCLUIDO", label: "Concluído", Icon: PackageCheck },
];
export function FreightProgress({ freight }: { freight: Freight }) {
  const index = stages.findIndex((s) => s.status === freight.status);
  return (
    <section className="panel freight-progress">
      <h2>Acompanhe seu frete</h2>
      {freight.status === "CANCELADO" ? (
        <div className="freight-cancelled">
          <b>Frete cancelado</b>
          {freight.cancellation ? (
            <>
              <p>{freight.cancellation.reason}</p>
              <small>
                Cancelado pelo cliente em {dateTime(freight.cancellation.at)} ·
                Sem cobrança pela plataforma.
              </small>
            </>
          ) : (
            <p>Esta solicitação foi encerrada.</p>
          )}
        </div>
      ) : (
        <>
          <ol>
            {stages.map(({ status, label, Icon }, i) => (
              <li
                key={status}
                className={i < index ? "done" : i === index ? "current" : ""}
                aria-current={i === index ? "step" : undefined}
              >
                <span>
                  {i < index ? <Check size={18} /> : <Icon size={18} />}
                </span>
                <b>{label}</b>
              </li>
            ))}
          </ol>
          <p className="muted">
            {freight.status === "ABERTO"
              ? "Compare as propostas e escolha o prestador."
              : freight.status === "AGENDADO"
                ? "Tudo combinado. Aguarde o motorista iniciar o transporte."
                : freight.status === "EM_TRANSPORTE"
                  ? "Confirme a conclusão somente quando todos os itens forem entregues."
                  : "Entrega confirmada. Você já pode avaliar o serviço."}{" "}
            As etapas não representam rastreamento de localização ao vivo.
          </p>
        </>
      )}
    </section>
  );
}
