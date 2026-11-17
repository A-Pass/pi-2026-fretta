import type { FreightStatus } from "@/contracts";
export const statusLabels: Record<FreightStatus, string> = {
  ABERTO: "Aguardando propostas",
  AGENDADO: "Agendado",
  EM_TRANSPORTE: "Em transporte",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
};
export function StatusBadge({ status }: { status: FreightStatus }) {
  return <span className={"badge " + status}>{statusLabels[status]}</span>;
}
