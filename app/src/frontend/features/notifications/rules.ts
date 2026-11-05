import type { AppNotification, Role, Store } from "@/contracts";
import { ownProposal } from "../driver/rules";
import { proposalOffers } from "../freights/negotiation";
/** Demo events only: production recipients must be derived and authorized by the server. */
export function withNotifications(previous: Store, next: Store): Store {
  const notifications = [...(next.notifications || [])];
  function add(
    id: string,
    role: Role,
    title: string,
    body: string,
    freightId: string,
    proposalId?: string,
  ) {
    if (!notifications.some((n) => n.id === id))
      notifications.unshift({
        id,
        role,
        title,
        body,
        freightId,
        proposalId,
        read: false,
        createdAt: new Date().toISOString(),
      });
  }
  for (const p of next.proposals) {
    const old = previous.proposals.find((x) => x.id === p.id);
    const latest = proposalOffers(p).at(-1)!;
    const oldLatest = old && proposalOffers(old).at(-1);
    if (!old || latest.id !== oldLatest?.id)
      add(
        `proposal:${latest.id}`,
        "cliente",
        old ? "Nova proposta na conversa" : "Nova proposta recebida",
        `${p.driver} enviou uma proposta.`,
        p.freightId,
        p.id,
      );
    if (
      ownProposal(p, next.profile?.name || "Clayton") &&
      latest.status !== oldLatest?.status
    ) {
      if (latest.status === "RECUSADA")
        add(
          `declined:${latest.id}`,
          "motorista",
          "Proposta recusada",
          "Você pode continuar a conversa e enviar uma nova proposta.",
          p.freightId,
          p.id,
        );
      if (latest.status === "ACEITA")
        add(
          `accepted:${latest.id}`,
          "motorista",
          "Sua proposta foi aceita!",
          "Consulte o acordo e os endereços do serviço.",
          p.freightId,
          p.id,
        );
      if (latest.status === "ENCERRADA")
        add(
          `closed:${latest.id}`,
          "motorista",
          "Proposta encerrada",
          "A solicitação foi cancelada ou outra proposta foi escolhida.",
          p.freightId,
          p.id,
        );
    }
  }
  for (const m of next.messages) {
    if (previous.messages.some((x) => x.id === m.id)) continue;
    const p = next.proposals.find((p) => p.id === m.proposalId);
    if (!p) continue;
    const role: Role = m.role === "cliente" ? "motorista" : "cliente";
    if (
      role === "motorista" &&
      !ownProposal(p, next.profile?.name || "Clayton")
    )
      continue;
    add(
      `message:${m.id}`,
      role,
      "Nova mensagem",
      m.text.slice(0, 140),
      m.freightId,
      m.proposalId,
    );
  }
  for (const f of next.freights) {
    const old = previous.freights.find((x) => x.id === f.id);
    if (old?.status === f.status) continue;
    if (f.status === "EM_TRANSPORTE")
      add(
        `started:${f.id}`,
        "cliente",
        "Seu frete está em transporte",
        f.title,
        f.id,
      );
    const p = next.proposals.find((p) => p.id === f.acceptedProposalId);
    if (
      f.status === "CONCLUIDO" &&
      p &&
      ownProposal(p, next.profile?.name || "Clayton")
    )
      add(
        `completed:${f.id}`,
        "motorista",
        "Frete concluído",
        "O cliente confirmou a conclusão. Você já pode avaliar o serviço.",
        f.id,
      );
  }
  return { ...next, notifications };
}
export function unreadNotifications(
  store: Store,
  role: Role,
): AppNotification[] {
  return (store.notifications || []).filter((n) => n.role === role && !n.read);
}
