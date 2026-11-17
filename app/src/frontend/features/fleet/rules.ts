import type {
  Store,
  FleetState,
  FleetPerson,
  FleetDispatch,
  ProposalOffer,
  Vehicle,
} from "@/contracts";
import { licenseDateValid } from "../onboarding/rules";
import { vehicleLabel, validateVehicle } from "../vehicles/rules";
export const MANAGER = "demo-fleet-manager";
const registration = (name: string, status: "APROVADO" | "EM_ANALISE") => ({
  mode: "demo" as const,
  status,
  fullName: name,
  personType: "pf" as const,
  cpfMasked: "***.***.***-09",
  license: {
    numberMasked: "*********01",
    category: "B",
    expiresOn: "2031-12-31",
  },
  documentsSubmitted: true,
  submittedAt: "2026-11-17T12:00:00Z",
});
export function fleetState(store: Store): FleetState | null {
  if (!store.fleet) return null;
  return {
    ...store.fleet,
    company: {
      ...store.fleet.company,
      name: store.companyProfile?.tradeName || store.fleet.company.name,
      logo: store.companyProfile?.logo || store.fleet.company.logo,
    },
    people: store.fleet.people.map((p) =>
      p.id === "demo-driver"
        ? {
            ...p,
            name: store.profile?.name || p.name,
            photo: store.profile?.photo || p.photo,
            registration: store.driverRegistration || {
              ...p.registration,
              status: "EM_ANALISE",
              documentsSubmitted: false,
            },
          }
        : p,
    ),
  };
}
export function createDemoCompany(store: Store, name: string): Store {
  if (store.fleet) throw Error("A empresa de demonstração já existe.");
  if (name.trim().length < 3 || name.trim().length > 100)
    throw Error("Informe um nome de 3 a 100 caracteres.");
  const people: FleetPerson[] = [
    {
      id: "demo-driver",
      code: "FRT-C7L2T9",
      name: store.profile?.name || "Cleiton",
      photo: store.profile?.photo || "",
      registration:
        store.driverRegistration || registration("Cleiton", "EM_ANALISE"),
    },
    {
      id: "fleet-carlos",
      code: "FRT-7K9P2X",
      name: "Carlos Almeida · exemplo",
      photo: "/admin-avatar-example.svg",
      registration: registration("Carlos Almeida · exemplo", "APROVADO"),
    },
    {
      id: "fleet-marina",
      code: "FRT-4M8N6Q",
      name: "Marina Souza · exemplo",
      photo: "/admin-avatar-example.svg",
      registration: registration("Marina Souza · exemplo", "EM_ANALISE"),
    },
  ];
  return {
    ...store,
    companyProfile: {
      tradeName: name.trim(),
      logo: store.companyProfile?.logo || "",
      about: store.companyProfile?.about || "",
      city: store.companyProfile?.city || "",
    },
    fleet: {
      company: {
        id: "demo-company",
        managerId: MANAGER,
        name: name.trim(),
        logo: "",
      },
      people,
      vehicles: [],
      invites: [],
      members: [],
      dispatches: [],
    },
  };
}
function required(store: Store, actor: string, manager = false) {
  const fleet = fleetState(store);
  if (!fleet || (manager && actor !== fleet.company.managerId))
    throw Error("Você não tem permissão para esta operação.");
  return fleet;
}
const put = (store: Store, fleet: FleetState): Store => ({ ...store, fleet });
export function lookupDriver(store: Store, code: string) {
  const fleet = fleetState(store);
  const p = fleet?.people.find((p) => p.code === code.trim().toUpperCase());
  return p ? { id: p.id, code: p.code, name: p.name, photo: p.photo } : null;
}
export const invitePending = (
  i: FleetState["invites"][number],
  now = Date.now(),
) => i.status === "PENDENTE" && Date.parse(i.expiresAt) > now;
export function inviteDriver(
  store: Store,
  actor: string,
  driverId: string,
  now = Date.now(),
): Store {
  const fleet = required(store, actor, true);
  if (!fleet.people.some((p) => p.id === driverId) || actor === driverId)
    throw Error("Motorista não encontrado.");
  if (fleet.members.some((m) => m.driverId === driverId && !m.leftAt))
    throw Error("Este motorista já participa de uma empresa.");
  if (
    fleet.invites.some(
      (i) =>
        i.driverId === driverId &&
        i.companyId === fleet.company.id &&
        invitePending(i, now),
    )
  )
    throw Error("Já existe um convite pendente para este motorista.");
  return put(store, {
    ...fleet,
    invites: [
      ...fleet.invites,
      {
        id: crypto.randomUUID(),
        companyId: fleet.company.id,
        driverId,
        createdAt: new Date(now).toISOString(),
        expiresAt: new Date(now + 7 * 86400000).toISOString(),
        status: "PENDENTE",
      },
    ],
  });
}
export function answerInvite(
  store: Store,
  actor: string,
  id: string,
  accept: boolean,
  now = Date.now(),
): Store {
  const fleet = required(store, actor),
    invite = fleet.invites.find((i) => i.id === id);
  if (!invite || invite.driverId !== actor || !invitePending(invite, now))
    throw Error("Este convite não está disponível para sua conta ou expirou.");
  if (accept && fleet.members.some((m) => m.driverId === actor && !m.leftAt))
    throw Error("Você já participa de uma empresa.");
  return put(store, {
    ...fleet,
    invites: fleet.invites.map((i) =>
      i.id === id
        ? {
            ...i,
            status: accept ? "ACEITO" : "RECUSADO",
            respondedAt: new Date(now).toISOString(),
          }
        : i,
    ),
    members: accept
      ? [
          ...fleet.members,
          {
            id: crypto.randomUUID(),
            companyId: invite.companyId,
            driverId: actor,
            joinedAt: new Date(now).toISOString(),
            activeSeat: false,
          },
        ]
      : fleet.members,
  });
}
export function cancelInvite(store: Store, actor: string, id: string): Store {
  const fleet = required(store, actor, true);
  if (!fleet.invites.some((i) => i.id === id && invitePending(i)))
    throw Error("Convite indisponível.");
  return put(store, {
    ...fleet,
    invites: fleet.invites.map((i) =>
      i.id === id ? { ...i, status: "CANCELADO" } : i,
    ),
  });
}
export function driverReady(p: FleetPerson) {
  return (
    p.registration.status === "APROVADO" &&
    p.registration.documentsSubmitted &&
    licenseDateValid(p.registration.license.expiresOn) &&
    !!p.photo
  );
}
export function dispatchLive(store: Store, d: FleetDispatch) {
  const f = store.freights.find((f) => f.id === d.freightId),
    p = store.proposals.find((p) => p.id === d.proposalId);
  return (
    !["RECUSADA", "CANCELADA"].includes(d.status) &&
    !!f &&
    !["CANCELADO", "CONCLUIDO"].includes(f.status) &&
    (f.revision || 0) === d.requestRevision &&
    (f.status === "ABERTO" ||
      (!!d.proposalId && f.acceptedProposalId === d.proposalId)) &&
    (!d.proposalId || (!!p && p.status !== "ENCERRADA"))
  );
}
export function changeMember(
  store: Store,
  actor: string,
  driverId: string,
  action: "activate" | "deactivate" | "remove" | "leave",
): Store {
  const fleet = required(store, actor, action !== "leave");
  if (action === "leave" && actor !== driverId)
    throw Error("Você só pode encerrar o próprio vínculo.");
  const member = fleet.members.find(
      (m) => m.driverId === driverId && !m.leftAt,
    ),
    person = fleet.people.find((p) => p.id === driverId);
  if (!member || !person) throw Error("Vínculo não encontrado.");
  if (action === "activate" && !driverReady(person))
    throw Error(
      "O motorista precisa de cadastro aprovado, foto e CNH válida antes da ativação.",
    );
  if (
    action !== "activate" &&
    fleet.dispatches.some(
      (d) => d.driverId === driverId && dispatchLive(store, d),
    )
  )
    throw Error(
      "Resolva os serviços e atribuições em aberto antes de desativar ou encerrar o vínculo.",
    );
  return put(store, {
    ...fleet,
    members: fleet.members.map((m) =>
      m.id === member.id
        ? {
            ...m,
            activeSeat: action === "activate",
            ...(["remove", "leave"].includes(action)
              ? { leftAt: new Date().toISOString() }
              : {}),
          }
        : m,
    ),
  });
}
export function saveFleetVehicles(
  store: Store,
  actor: string,
  vehicles: Vehicle[],
): Store {
  const fleet = required(store, actor, true);
  for (const v of vehicles) {
    const error = validateVehicle(
      v,
      vehicles.filter((x) => x.id !== v.id),
    );
    if (error) throw Error(error);
  }
  for (const d of fleet.dispatches.filter((d) => dispatchLive(store, d))) {
    const v = vehicles.find((v) => v.id === d.vehicle.id);
    if (
      !v ||
      JSON.stringify(v) !==
        JSON.stringify(fleet.vehicles.find((x) => x.id === v.id))
    )
      throw Error(
        "Não altere um veículo que já participa de uma atribuição em aberto.",
      );
  }
  return put(store, { ...fleet, vehicles });
}
export function assignService(
  store: Store,
  actor: string,
  driverId: string,
  vehicleId: string,
  freightId: string,
): Store {
  const fleet = required(store, actor, true),
    p = fleet.people.find((p) => p.id === driverId),
    member = fleet.members.find((m) => m.driverId === driverId && !m.leftAt),
    v = fleet.vehicles.find((v) => v.id === vehicleId),
    f = store.freights.find((f) => f.id === freightId);
  if (
    !p ||
    !member?.activeSeat ||
    !driverReady(p) ||
    !v ||
    !f ||
    f.status !== "ABERTO"
  )
    throw Error(
      "Selecione motorista aprovado e ativo, veículo e solicitação aberta.",
    );
  if (v.category !== f.vehicle)
    throw Error("Escolha um veículo da categoria solicitada pelo cliente.");
  if (
    fleet.dispatches.some(
      (d) =>
        dispatchLive(store, d) &&
        (d.driverId === driverId ||
          d.vehicle.id === vehicleId ||
          d.freightId === freightId),
    )
  )
    throw Error(
      "Já há uma atribuição em aberto para esse motorista, veículo ou solicitação.",
    );
  return put(store, {
    ...fleet,
    dispatches: [
      ...fleet.dispatches,
      {
        id: crypto.randomUUID(),
        companyId: fleet.company.id,
        driverId,
        vehicle: structuredClone(v),
        freightId,
        requestRevision: f.revision || 0,
        createdAt: new Date().toISOString(),
        status: "PENDENTE",
      },
    ],
  });
}
export function answerService(
  store: Store,
  actor: string,
  id: string,
  accept: boolean,
): Store {
  const fleet = required(store, actor),
    d = fleet.dispatches.find((d) => d.id === id);
  if (
    !d ||
    d.driverId !== actor ||
    d.status !== "PENDENTE" ||
    !dispatchLive(store, d)
  )
    throw Error("Atribuição indisponível para esta conta.");
  return put(store, {
    ...fleet,
    dispatches: fleet.dispatches.map((d) =>
      d.id === id ? { ...d, status: accept ? "ACEITA" : "RECUSADA" } : d,
    ),
  });
}
export function sendCompanyProposal(
  store: Store,
  actor: string,
  id: string,
  offer: ProposalOffer,
): Store {
  const fleet = required(store, actor, true),
    d = fleet.dispatches.find((d) => d.id === id),
    person = fleet.people.find((p) => p.id === d?.driverId),
    member = fleet.members.find((m) => m.driverId === d?.driverId && !m.leftAt);
  if (
    !d ||
    d.status !== "ACEITA" ||
    d.proposalId ||
    !dispatchLive(store, d) ||
    !person ||
    !driverReady(person) ||
    !member?.activeSeat
  )
    throw Error(
      "O motorista deve aceitar uma atribuição válida antes de enviar a proposta.",
    );
  if (
    offer.vehicleId !== d.vehicle.id ||
    !Number.isSafeInteger(offer.priceCents) ||
    offer.priceCents <= 0 ||
    Date.parse(offer.availableAt) <= Date.now() ||
    !Number.isFinite(Date.parse(offer.availableAt)) ||
    !offer.message.trim() ||
    offer.message.length > 2000
  )
    throw Error("Confira veículo, preço, disponibilidade futura e comentário.");
  const proposalId = crypto.randomUUID();
  return {
    ...store,
    fleet: {
      ...fleet,
      dispatches: fleet.dispatches.map((x) =>
        x.id === id ? { ...x, proposalId } : x,
      ),
    },
    proposals: [
      ...store.proposals,
      {
        ...offer,
        id: proposalId,
        freightId: d.freightId,
        companyId: fleet.company.id,
        providerName: fleet.company.name,
        providerLogo: fleet.company.logo,
        providerKind: "empresa",
        driverId: person.id,
        driver: person.name,
        requestRevision: d.requestRevision,
        rating: 0,
        vehicle: vehicleLabel(d.vehicle),
        offers: [{ ...offer, vehicle: vehicleLabel(d.vehicle) }],
        status: "PENDENTE",
      },
    ],
  };
}
export function employeeServices(store: Store, actor: string) {
  return (fleetState(store)?.dispatches || []).filter(
    (d) => d.driverId === actor,
  );
}
export function startCompanyTransport(
  store: Store,
  actor: string,
  id: string,
): Store {
  const fleet = required(store, actor),
    d = fleet.dispatches.find((d) => d.id === id),
    f = store.freights.find((f) => f.id === d?.freightId),
    p = fleet.people.find((p) => p.id === actor);
  if (
    !d ||
    d.driverId !== actor ||
    !f ||
    f.status !== "AGENDADO" ||
    f.acceptedProposalId !== d.proposalId ||
    !p ||
    !driverReady(p)
  )
    throw Error(
      "Somente o motorista designado e regular pode iniciar o frete contratado.",
    );
  return {
    ...store,
    freights: store.freights.map((x) =>
      x.id === f.id ? { ...x, status: "EM_TRANSPORTE" } : x,
    ),
  };
}

export function cancelDispatch(store: Store, actor: string, id: string): Store {
  const fleet = required(store, actor, true),
    d = fleet.dispatches.find((d) => d.id === id);
  if (!d || d.proposalId || !dispatchLive(store, d))
    throw Error("Não é possível retirar esta atribuição.");
  return put(store, {
    ...fleet,
    dispatches: fleet.dispatches.map((d) =>
      d.id === id ? { ...d, status: "CANCELADA" } : d,
    ),
  });
}
