import { listScheduledPickups } from "./pickups";
import { distanceKm } from "@/contracts/distance";
import { approvedDriver } from "../companies/service";
import type { Address } from "@/contracts";
import type { Prisma } from "@/server/generated/prisma/client";
import { randomUUID } from "node:crypto";

export class FreightError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function requireValue(
  condition: unknown,
  message: string,
  status = 422,
): asserts condition {
  if (!condition) throw new FreightError(status, message);
}

function field(value: unknown, max: number, min = 1) {
  const result = typeof value === "string" ? value.trim() : "";
  requireValue(
    result.length >= min && result.length <= max,
    "Confira os campos informados.",
  );
  return result;
}

function point(lat: unknown, lng: unknown) {
  requireValue(
    typeof lat === "number" &&
      typeof lng === "number" &&
      Math.abs(lat) <= 90 &&
      Math.abs(lng) <= 180,
    "Confirme uma localização válida.",
  );
  return { lat, lng };
}

function address(value: unknown): Address {
  requireValue(value && typeof value === "object", "Preencha o endereço.");
  const a = value as Partial<Address>;
  return {
    label: field(a.label, 80, 0),
    city: field(a.city, 100),
    state: field(a.state, 2, 2),
    neighborhood: field(a.neighborhood, 100),
    street: field(a.street, 150),
    number: field(a.number, 20),
    complement: field(a.complement, 150, 0),
    point: point(a.point?.lat, a.point?.lng),
  };
}

function region(value: Prisma.JsonValue) {
  const a = value as Partial<Address> & {
    bairro?: string;
    cidade?: string;
    uf?: string;
  };
  return [a?.neighborhood ?? a?.bairro, a?.city ?? a?.cidade, a?.state ?? a?.uf]
    .filter(Boolean)
    .join(", ");
}

export async function driverCanOffer(
  tx: Prisma.TransactionClient,
  userId: string,
) {
  const [driver, subscription] = await Promise.all([
    tx.motorista.findFirst({
      where: {
        user_id: userId,
        ...approvedDriver(),
        vinculo_empresa: null,
      },
      select: { user_id: true },
    }),
    tx.vinculo_assinatura.findFirst({
      where: {
        motorista_id: userId,
        status: "ATIVA",
        inicio_em: { lte: new Date() },
        fim_em: { gt: new Date() },
      },
      select: { id: true },
    }),
  ]);
  return Boolean(
    driver && subscription,
  );
}

const include = {
  cliente: { include: { user: { select: { name: true } } } },
  avaliacao: { select: { avaliador_id: true } },
  frete_foto: { orderBy: { ordem: "asc" } },
  endereco_frete_endereco_origem_idToendereco: true,
  endereco_frete_endereco_destino_idToendereco: true,
  proposta: {
    include: {
      motorista: { include: { user: { select: { name: true } } } },
      empresa: { select: { gestor_id: true, nome: true } },
      atribuicao_empresa: { select: { status: true, veiculo_id: true } },
      ofertas: { orderBy: [{ createdAt: "desc" }, { id: "desc" }] },
    },
  },
} satisfies Prisma.freteInclude;

type Row = Prisma.freteGetPayload<{ include: typeof include }>;
type FreightAddress = Row["endereco_frete_endereco_origem_idToendereco"];

function listing(f: Row) {
  return {
    id: f.id,
    title: f.titulo,
    description: f.descricao,
    origin: `${f.endereco_frete_endereco_origem_idToendereco.bairro ?? ""}, ${f.endereco_frete_endereco_origem_idToendereco.cidade}, ${f.endereco_frete_endereco_origem_idToendereco.estado}`.replace(/^, /, ""),
    destination: `${f.endereco_frete_endereco_destino_idToendereco.bairro ?? ""}, ${f.endereco_frete_endereco_destino_idToendereco.cidade}, ${f.endereco_frete_endereco_destino_idToendereco.estado}`.replace(/^, /, ""),
    vehicle: f.categoria_porte,
    status: f.status_frete_enum === "ACEITO" ? "AGENDADO" : f.status_frete_enum,
  };
}

async function detail(
  tx: Prisma.TransactionClient,
  f: Row,
  userId: string,
) {
  const owner = f.cliente_id === userId;
  const hired = f.proposta.some(
    (p) => p.id === f.proposta_aceita_id && p.motorista_id === userId,
  );
  const contracted = f.proposta.find((p) => p.id === f.proposta_aceita_id);
  const pickupAt = contracted?.ofertas.find(
    (offer) => offer.status === "ACEITA",
  )?.disponivelEm;
  const conversations = await tx.conversa.findMany({
    where: { proposta_id: { in: f.proposta.map((proposal) => proposal.id) } },
    select: { id: true, proposta_id: true },
  });
  const conversationByProposal = new Map(
    conversations.map((conversation) => [
      conversation.proposta_id,
      conversation.id,
    ]),
  );
  const reviewed = f.avaliacao.some((r) => r.avaliador_id === userId);
  const origin = f.endereco_frete_endereco_origem_idToendereco;
  const destination = f.endereco_frete_endereco_destino_idToendereco;
  const addressFromRow = (a: typeof origin): Address => ({
    label: "",
    street: a.logradouro,
    number: a.numero ?? "",
    complement: a.complemento ?? "",
    neighborhood: a.bairro ?? "",
    city: a.cidade,
    state: a.estado,
    point:
      a.latitude !== null && a.longitude !== null
        ? { lat: Number(a.latitude), lng: Number(a.longitude) }
        : null,
  });
  return {
    ...listing(f),
    owner,
    hired,
    updatedAt: f.atualizado_em.toISOString(),
    schedule: {
      kind:
        f.tipo_agendamento_enum === "FIXA"
          ? "fixa"
          : f.tipo_agendamento_enum === "INTERVALO"
            ? "intervalo"
            : "combinar",
      start: f.data_coleta_prevista?.toISOString().slice(0, 10),
      end: f.data_entrega_prevista?.toISOString().slice(0, 10),
    },
    reviewed,
    completion:
      (owner || hired) && contracted && pickupAt
        ? {
            conversationId: conversationByProposal.get(contracted.id),
            pickupAt: pickupAt.toISOString(),
            reviewed,
            awaitingOther:
              f.avaliacao.length > 0 && f.status_frete_enum !== "CONCLUIDO",
          }
        : undefined,
    clientName: f.cliente.user.name,
    photos: f.frete_foto.map((photo) => photo.url),
    addresses:
      owner || hired
        ? {
            pickup: addressFromRow(origin),
            delivery: addressFromRow(destination),
          }
        : undefined,
    proposals: f.proposta
      .filter(
        (p) =>
          owner || p.motorista_id === userId || p.empresa?.gestor_id === userId,
      )
      .map((p) => ({
        id: p.id,
        driver: p.motorista.user.name,
        companyName: p.empresa?.nome,
        status: p.status_proposta,
        conversationId: conversationByProposal.get(p.id),
        offers: p.ofertas.map((o) => ({
          id: o.id,
          createdAt: o.createdAt.toISOString(),
          priceCents: o.valorCentavos,
          availableAt: o.disponivelEm,
          message: o.mensagem,
          vehicle: o.veiculoLabel,
          status: o.status,
        })),
      })),
  };
}

export async function freightOperation(
  tx: Prisma.TransactionClient,
  userId: string,
  method: string,
  segments: string[],
  query: URLSearchParams,
  body: Record<string, unknown>,
) {
  const [id, action, proposalId] = segments;
  if (id === "pickups" && method === "GET" && !action)
    return { pickups: await listScheduledPickups(tx, userId) };
  if (id === "addresses" && method === "POST" && !proposalId) {
    requireValue(
      await tx.cliente.findUnique({ where: { user_id: userId } }),
      "Ative seu perfil de cliente para salvar endereços.",
      403,
    );
    if (action === "remove") {
      const result = await tx.endereco_salvos.deleteMany({
        where: { id: field(body.id, 100), user_id: userId },
      });
      requireValue(result.count === 1, "Endereço indisponível.", 404);
    } else if (action === "save") {
      const a = address(body.address);
      const data = {
        label: field(a.label, 80),
        logradouro: a.street,
        numero: a.number,
        complemento: a.complement,
        bairro: a.neighborhood,
        cidade: a.city,
        estado: a.state,
        cep: "",
        latitude: a.point!.lat,
        longitude: a.point!.lng,
        atualizado_em: new Date(),
      };
      if (body.id) {
        const result = await tx.endereco_salvos.updateMany({
          where: { id: field(body.id, 100), user_id: userId },
          data,
        });
        requireValue(result.count === 1, "Endereço indisponível.", 404);
      } else
        await tx.endereco_salvos.create({
          data: { ...data, id: randomUUID(), user_id: userId },
        });
    } else throw new FreightError(404, "Operação indisponível.");
    return { saved: true };
  }
  if (id === "addresses" && !action && method === "GET") {
    const rows = await tx.endereco_salvos.findMany({
      where: { user_id: userId },
      orderBy: { criado_em: "desc" },
      take: 100,
    });
    return rows.map((a) => ({
      id: a.id,
      label: a.label,
      street: a.logradouro,
      number: a.numero,
      complement: a.complemento ?? "",
      city: a.cidade,
      state: a.estado,
      neighborhood: a.bairro,
      point: { lat: Number(a.latitude), lng: Number(a.longitude) },
    }));
  }
  if (!id && method === "GET") {
    const driver = query.get("role") === "motorista";
    const feed = driver && query.get("scope") !== "services";
    requireValue(
      !feed || (await driverCanOffer(tx, userId)),
      "Cadastro aprovado, veículo ativo e acesso vigente são necessários.",
      403,
    );
    const center = feed
      ? point(Number(query.get("lat") ?? NaN), Number(query.get("lng") ?? NaN))
      : null;
    const radius = Number(query.get("radius"));
    requireValue(
      !feed || (radius >= 1 && radius <= 1000),
      "Informe um raio de 1 a 1000 km.",
    );
    const cursor = query.get("cursor");
    const where: Prisma.freteWhereInput = feed
      ? { status_frete_enum: "ABERTO" }
      : driver
        ? { proposta: { some: { motorista_id: userId } } }
        : { cliente_id: userId };
    const rows = await tx.frete.findMany({
      where: { ...where, ...(cursor ? { id: { gt: cursor } } : {}) },
      orderBy: { id: "asc" },
      take: 51,
      include,
    });
    const items = rows.slice(0, 50).filter((f) => {
      if (!center) return true;
      const pickup = f.endereco_frete_endereco_origem_idToendereco.latitude &&
        f.endereco_frete_endereco_origem_idToendereco.longitude
        ? {
            lat: Number(f.endereco_frete_endereco_origem_idToendereco.latitude),
            lng: Number(f.endereco_frete_endereco_origem_idToendereco.longitude),
          }
        : null;
      return pickup && distanceKm(center, pickup) <= radius;
    });
    const conversations = await tx.conversa.findMany({
      where: {
        proposta_id: {
          in: items.flatMap((freight) =>
            freight.proposta.map((proposal) => proposal.id),
          ),
        },
      },
      select: { id: true, proposta_id: true },
    });
    const conversationByProposal = new Map(
      conversations.map((conversation) => [
        conversation.proposta_id,
        conversation.id,
      ]),
    );
    return {
      items: items.map((f) => ({
        ...listing(f),
        ownRequest: f.cliente_id === userId,
        proposalCount: !driver ? f.proposta.length : undefined,
        ...(f.cliente_id === userId &&
        ["ACEITO", "EM_TRANSPORTE", "CONCLUIDO"].includes(
          f.status_frete_enum,
        ) &&
        f.proposta_aceita_id
          ? (() => {
              const proposal = f.proposta.find(
                (p) => p.id === f.proposta_aceita_id,
              );
              const offer = proposal?.ofertas.find(
                (o) => o.status === "ACEITA",
              );
              return proposal && offer
                ? {
                    agreement: {
                      driver: proposal.motorista.user.name,
                      priceCents: offer.valorCentavos,
                      pickupAt: offer.disponivelEm,
                      conversationId: conversationByProposal.get(proposal.id),
                    },
                  }
                : {};
            })()
          : {}),
      })),
      nextCursor: rows.length > 50 ? rows[49].id : null,
    };
  }
  if (method === "POST" && (!id || (action === "edit" && !proposalId))) {
    const previous = id
      ? await tx.frete.findFirst({ where: { id, cliente_id: userId }, include })
      : null;
    if (id) {
      requireValue(previous, "Frete indisponível.", 404);
      requireValue(
        previous.status_frete_enum === "ABERTO" &&
          previous.atualizado_em.toISOString() === body.expectedUpdatedAt,
        "O frete mudou. Atualize antes de editar.",
        409,
      );
    }
    requireValue(
      await tx.cliente.findUnique({ where: { user_id: userId } }),
      "Ative o perfil de cliente.",
      403,
    );
    const pickup = address(body.pickup),
      delivery = address(body.delivery);
    const schedule = body.schedule as {
      kind?: string;
      start?: string;
      end?: string;
    } | null;
    requireValue(
      schedule &&
        ["fixa", "intervalo", "combinar"].includes(schedule.kind ?? ""),
      "Informe a agenda.",
    );
    const today = new Date().toLocaleDateString("sv-SE", {
      timeZone: "America/Bahia",
    });
    function date(value: unknown) {
      requireValue(
        typeof value === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(value) &&
          value >= today,
        "Informe uma data futura ou de hoje.",
      );
      const parsed = new Date(value);
      requireValue(
        Number.isFinite(+parsed) && parsed.toISOString().slice(0, 10) === value,
        "Data inválida.",
      );
      return parsed;
    }
    const start = schedule.kind === "combinar" ? null : date(schedule.start);
    const end = schedule.kind === "intervalo" ? date(schedule.end) : start;
    requireValue(!start || !end || end >= start, "O intervalo está invertido.");
    const ids = body.photoIds ?? [];
    requireValue(
      Array.isArray(ids) &&
        ids.length <= 6 &&
        ids.every((x) => typeof x === "string") &&
        new Set(ids).size === ids.length,
      "Fotos inválidas.",
    );
    requireValue(
      (await tx.arquivo_upload.count({
        where: {
          id: { in: ids },
          usuario_id: userId,
          finalidade: "freight",
        },
      })) === ids.length,
      "Fotos indisponíveis.",
    );
    async function save(a: Address) {
      return (
        await tx.endereco.create({
          data: {
            id: randomUUID(),
            logradouro: a.street,
            numero: a.number,
            complemento: a.complement,
            bairro: a.neighborhood,
            cidade: a.city,
            estado: a.state,
            cep: "",
            pais: "Brasil",
            latitude: a.point!.lat,
            longitude: a.point!.lng,
          },
        })
      ).id;
    }
    requireValue(
      typeof body.title === "string" &&
        body.title.trim().length >= 3 &&
        body.title.trim().length <= 150,
      "Digite um título com 3 a 150 caracteres.",
    );
    const category = field(body.vehicle, 100).toUpperCase();
    const vehicleCategory =
      category === "PEQUENO" || category.includes("PEQUENO")
        ? ("PEQUENO" as const)
        : category === "MEDIO" ||
            category === "MÉDIO" ||
            category.includes("MEDIO") ||
            category.includes("MÉDIO")
          ? ("MEDIO" as const)
          : ("GRANDE" as const);
    const content = {
      titulo: body.title.trim(),
      descricao: field(body.description, 2000),
      categoria_porte: vehicleCategory,
      tipo_agendamento_enum:
        schedule.kind === "fixa"
          ? ("FIXA" as const)
          : schedule.kind === "intervalo"
            ? ("INTERVALO" as const)
            : ("COMBINAR" as const),
      data_coleta_prevista: start,
      data_entrega_prevista: end,
    };
    const frete_foto = ids.map((photoId, ordem) => ({
      id: randomUUID(),
      url: photoId,
      ordem,
    }));
    function sameAddress(
      a: FreightAddress,
      b: Address,
    ) {
      return (
        a.logradouro === b.street &&
        a.cidade === b.city &&
        a.estado === b.state &&
        a.bairro === b.neighborhood &&
        a.numero === b.number &&
        a.complemento === (b.complement || null) &&
        Number(a.latitude) === b.point?.lat &&
        Number(a.longitude) === b.point?.lng
      );
    }
    const changed =
      previous &&
      (previous.titulo !== content.titulo ||
        previous.descricao !== content.descricao ||
        previous.categoria_porte !== content.categoria_porte ||
        previous.tipo_agendamento_enum !== content.tipo_agendamento_enum ||
        +(previous.data_coleta_prevista ?? 0) !== +(start ?? 0) ||
        +(previous.data_entrega_prevista ?? 0) !== +(end ?? 0) ||
        !sameAddress(
          previous.endereco_frete_endereco_origem_idToendereco,
          pickup,
        ) ||
        !sameAddress(
          previous.endereco_frete_endereco_destino_idToendereco,
          delivery,
        ) ||
        previous.frete_foto.map((photo) => photo.url).join(",") !==
          ids.join(","));
    if (
      previous &&
      !changed &&
      body.savePickup !== true &&
      body.saveDelivery !== true
    )
      return detail(tx, previous, userId);
    const data = {
      ...content,
      endereco_origem_id:
        body.savePickup === true || !previous
          ? await save(pickup)
          : previous.endereco_origem_id,
      endereco_destino_id:
        body.saveDelivery === true || !previous
          ? await save(delivery)
          : previous.endereco_destino_id,
    };
    if (previous && !changed) {
      const updated = await tx.frete.update({
        where: { id: previous.id },
        include,
        data: {
          atualizado_em: new Date(),
          endereco_origem_id: data.endereco_origem_id,
          endereco_destino_id: data.endereco_destino_id,
        },
      });
      return detail(tx, updated, userId);
    }
    if (previous) {
      await tx.atribuicao_empresa.updateMany({
        where: {
          frete_id: previous.id,
          status: { in: ["PENDENTE", "CONFIRMADA"] },
        },
        data: { status: "CANCELADA" },
      });
      await tx.proposta.updateMany({
        where: {
          frete_id: previous.id,
          status_proposta: "PENDENTE",
        },
        data: { status_proposta: "CANCELADA" },
      });
      await tx.ofertaProposta.updateMany({
        where: {
          proposta: { frete_id: previous.id },
          status: "PENDENTE",
        },
        data: { status: "SUBSTITUIDA" },
      });
      const recipients = previous.proposta.map((p) => ({
        id: randomUUID(),
        destinatario_id: p.motorista_id,
        papel_destinatario: "motorista",
        evento: "FRETE_EDITADO",
        titulo: "Solicitação atualizada",
        corpo: content.titulo,
        frete_id: previous.id,
      }));
      if (recipients.length)
        await tx.notificacao.createMany({ data: recipients });
      const updated = await tx.frete.update({
        where: { id: previous.id },
        include,
        data: {
          ...data,
          atualizado_em: new Date(),
          frete_foto: { deleteMany: {}, create: frete_foto },
        },
      });
      return detail(tx, updated, userId);
    }
    const f = await tx.frete.create({
      data: {
        id: randomUUID(),
        ...data,
        cliente_id: userId,
        atualizado_em: new Date(),
        frete_foto: { create: frete_foto },
      },
      include,
    });
    return detail(tx, f, userId);
  }
  requireValue(id && segments.length <= 3, "Operação indisponível.", 404);
  const f = await tx.frete.findUnique({ where: { id }, include });
  requireValue(f, "Frete indisponível.", 404);
  const owner = f.cliente_id === userId;
  const own = f.proposta.find((p) => p.motorista_id === userId);
  const hired = Boolean(own && own.id === f.proposta_aceita_id);
  const managed = f.proposta.some((p) => p.empresa?.gestor_id === userId);
  const assigned =
    method === "GET" &&
    !owner &&
    !own &&
    !managed &&
    Boolean(
      await tx.atribuicao_empresa.findFirst({
        where: {
          frete_id: id,
          OR: [{ motorista_id: userId }, { empresa: { gestor_id: userId } }],
          status: { in: ["PENDENTE", "CONFIRMADA"] },
        },
        select: { id: true },
      }),
    );
  if (method === "GET" && action === "photo" && proposalId) {
    requireValue(
      owner ||
        own ||
        managed ||
        assigned ||
        (f.status_frete_enum === "ABERTO" &&
          (await driverCanOffer(tx, userId))),
      "Foto indisponível.",
      404,
    );
    requireValue(
      f.frete_foto.some((photo) => photo.url === proposalId),
      "Foto indisponível.",
      404,
    );
    return { photoOwner: f.cliente_id };
  }
  if (method === "GET" && !action) {
    requireValue(
      owner ||
        own ||
        managed ||
        assigned ||
        (f.status_frete_enum === "ABERTO" &&
          (await driverCanOffer(tx, userId))),
      "Frete indisponível.",
      404,
    );
    return detail(tx, f, userId);
  }
  requireValue(method === "POST", "Operação indisponível.", 404);
  if ((action === "propose" || action === "company-propose") && !proposalId) {
    const assignment =
      action === "company-propose"
        ? await tx.atribuicao_empresa.findFirst({
            where: {
              id: field(body.assignmentId, 100),
              frete_id: id,
              frete_versao: f.atualizado_em,
              status: "CONFIRMADA",
              empresa: {
                gestor_id: userId,
                cadastro_status: "APROVADO",
                plano_ate: { gt: new Date() },
                vagas: { gt: 0 },
              },
              motorista: {
                ...approvedDriver(),
                vinculo_empresa: { empresa: { gestor_id: userId } },
              },
              veiculo: { ativo: true },
            },
            include: { empresa: true },
          })
        : null;
    requireValue(
      !owner &&
        (action === "company-propose"
          ? assignment
          : await driverCanOffer(tx, userId)),
      "Você não pode enviar proposta para este frete.",
      403,
    );
    const driverId = assignment?.motorista_id ?? userId;
    requireValue(
      f.cliente_id !== driverId,
      "O motorista não pode propor para seu próprio frete.",
      403,
    );
    const existing = f.proposta.find((p) => p.motorista_id === driverId);
    requireValue(
      !existing ||
        (existing.empresa_id === (assignment?.empresa_id ?? null) &&
          (!assignment || assignment.proposta_id === existing.id)),
      "Este motorista já tem uma negociação vinculada a outro perfil.",
      409,
    );
    requireValue(
      f.status_frete_enum === "ABERTO",
      "O frete foi encerrado.",
      409,
    );
    requireValue(
      f.atualizado_em.toISOString() === body.expectedUpdatedAt,
      "O frete mudou. Atualize antes de propor.",
      409,
    );
    const price = body.priceCents;
    requireValue(
      typeof price === "number" &&
        Number.isInteger(price) &&
        price > 0 &&
        price <= 2147483647,
      "Informe um valor válido.",
    );
    const availability = field(body.availableAt, 40);
    requireValue(
      /T.*(?:Z|[+-]\d\d:\d\d)$/.test(availability) &&
        Date.parse(availability) > Date.now(),
      "Informe um horário futuro.",
    );
    const requestedDay = new Date(availability).toLocaleDateString("sv-SE", {
      timeZone: "America/Bahia",
    });
    requireValue(
      !f.data_coleta_prevista ||
        requestedDay >= f.data_coleta_prevista.toISOString().slice(0, 10),
      "Escolha um horário dentro da agenda.",
    );
    requireValue(
      !f.data_entrega_prevista ||
        requestedDay <= f.data_entrega_prevista.toISOString().slice(0, 10),
      "Escolha um horário dentro da agenda.",
    );
    const vehicle = await tx.veiculo.findFirst({
      where: {
        id: assignment?.veiculo_id ?? field(body.vehicleId, 100),
        motorista_id: driverId,
        ativo: true,
      },
    });
    requireValue(vehicle, "Escolha um veículo ativo da sua conta.");
    const proposal = existing
      ? await tx.proposta.update({
          where: { id: existing.id },
          data: {
            status_proposta: "PENDENTE",
            atualizado_em: new Date(),
          },
        })
      : await tx.proposta.create({
          data: {
            id: randomUUID(),
            frete_id: id,
            motorista_id: driverId,
            valor_proposto: price / 100,
            empresa_id: assignment?.empresa_id,
            atualizado_em: new Date(),
          },
        });
    const conversation = await tx.conversa.findFirst({
      where: { proposta_id: proposal.id },
    });
    if (conversation)
      await tx.conversa.update({
        where: { id: conversation.id },
        data: { atualizado_em: new Date() },
      });
    else
      await tx.conversa.create({
        data: {
          id: randomUUID(),
          proposta_id: proposal.id,
          atualizado_em: new Date(),
        },
      });
    if (assignment && !assignment.proposta_id) {
      await tx.atribuicao_empresa.update({
        where: { id: assignment.id },
        data: { proposta_id: proposal.id },
      });
    }
    await tx.ofertaProposta.updateMany({
      where: { propostaId: proposal.id, status: "PENDENTE" },
      data: { status: "SUBSTITUIDA" },
    });
    await tx.ofertaProposta.create({
      data: {
        id: randomUUID(),
        propostaId: proposal.id,
        valorCentavos: price,
        disponivelEm: new Date(availability),
        mensagem: field(body.message, 1000, 0),
        veiculoId: vehicle.id,
        veiculoLabel: [vehicle.categoria, vehicle.modelo].join(" · "),
        status: "PENDENTE",
      },
    });
    await tx.notificacao.create({
      data: {
        id: randomUUID(),
        destinatario_id: f.cliente_id,
        papel_destinatario: "cliente",
        evento: "PROPOSTA",
        titulo: "Nova proposta",
        corpo: f.titulo,
        frete_id: id,
        proposta_id: proposal.id,
      },
    });
  } else if ((action === "accept" || action === "decline") && proposalId) {
    requireValue(
      owner,
      "Somente o cliente pode decidir sobre a proposta.",
      403,
    );
    const proposal = f.proposta.find((p) => p.id === proposalId);
    requireValue(proposal, "Proposta indisponível.", 404);
    if (
      action === "accept" &&
      f.proposta_aceita_id === proposalId &&
      proposal.ofertas.some(
        (o) => o.id === body.offerId && o.status === "ACEITA",
      )
    )
      return detail(tx, f, userId);
    const offer = proposal.ofertas.find(
      (o) => o.id === body.offerId && o.status === "PENDENTE",
    );
    requireValue(
      f.status_frete_enum === "ABERTO" &&
        proposal.status_proposta === "PENDENTE" &&
        offer,
      "A oferta mudou. Atualize antes de decidir.",
      409,
    );
    requireValue(
      action === "decline" ||
        (offer.disponivelEm &&
          +offer.disponivelEm > Date.now() &&
          (proposal.empresa_id
            ? await tx.atribuicao_empresa.findFirst({
                where: {
                  proposta_id: proposal.id,
                  status: "CONFIRMADA",
                  empresa_id: proposal.empresa_id,
                  frete_versao: f.atualizado_em,
                  empresa: {
                    cadastro_status: "APROVADO",
                    plano_ate: { gt: new Date() },
                    vagas: { gt: 0 },
                  },
                  motorista: {
                    ...approvedDriver(),
                    vinculo_empresa: { empresa_id: proposal.empresa_id },
                  },
                  veiculo_id: offer.veiculoId ?? "",
                  veiculo: { ativo: true },
                },
                select: { id: true },
              })
            : await driverCanOffer(tx, proposal.motorista_id)) &&
          (await tx.veiculo.findFirst({
            where: {
              id: offer.veiculoId ?? "",
              motorista_id: proposal.motorista_id,
              ativo: true,
            },
          }))),
      "A oferta perdeu a validade.",
      409,
    );
    await tx.ofertaProposta.update({
      where: { id: offer.id },
      data: { status: action === "accept" ? "ACEITA" : "RECUSADA" },
    });
    await tx.proposta.update({
      where: { id: proposalId },
      data: {
        status_proposta: action === "accept" ? "ACEITA" : "REJEITADA",
        atualizado_em: new Date(),
      },
    });
    if (action === "accept") {
      await tx.frete.update({
        where: { id },
        data: {
          status_frete_enum: "ACEITO",
          proposta_aceita_id: proposalId,
          motorista_selecionado_id: proposal.motorista_id,
          atualizado_em: new Date(),
        },
      });
      await tx.proposta.updateMany({
        where: {
          frete_id: id,
          id: { not: proposalId },
          status_proposta: "PENDENTE",
        },
        data: { status_proposta: "CANCELADA", atualizado_em: new Date() },
      });
      await tx.ofertaProposta.updateMany({
        where: {
          proposta: { frete_id: id, id: { not: proposalId } },
          status: "PENDENTE",
        },
        data: { status: "SUBSTITUIDA" },
      });
      await tx.acordoFrete.create({
        data: {
          freteId: id,
          propostaId: proposal.id,
          ofertaId: offer.id,
          motoristaId: proposal.motorista_id,
          nomeMotorista: proposal.motorista.user.name,
          nomePrestador: proposal.empresa?.nome,
          tipoPrestador: proposal.empresa ? "empresa" : "autonomo",
          valorCentavos: offer.valorCentavos,
          veiculo: offer.veiculoLabel,
          disponivelEm: offer.disponivelEm,
          mensagem: offer.mensagem,
          aceitoEm: new Date(),
        },
      });
    }
    await tx.notificacao.create({
      data: {
        id: randomUUID(),
        destinatario_id: proposal.motorista_id,
        papel_destinatario: "motorista",
        evento: action === "accept" ? "ACEITE" : "RECUSA",
        titulo: action === "accept" ? "Proposta aceita" : "Proposta recusada",
        corpo: f.titulo,
        frete_id: id,
        proposta_id: proposalId,
      },
    });
    if (
      proposal.empresa &&
      proposal.empresa.gestor_id !== proposal.motorista_id
    ) {
      await tx.notificacao.create({
        data: {
          id: randomUUID(),
          destinatario_id: proposal.empresa.gestor_id,
          papel_destinatario: "motorista",
          evento: action === "accept" ? "ACEITE" : "RECUSA",
          titulo:
            action === "accept"
              ? "Proposta da empresa aceita"
              : "Proposta da empresa recusada",
          corpo: f.titulo,
          frete_id: id,
          proposta_id: proposalId,
        },
      });
    }
  } else if (!proposalId && (action === "reviews" || action === "complete")) {
    requireValue(owner || hired, "Somente participantes podem avaliar.", 403);
    const contracted = f.proposta.find((p) => p.id === f.proposta_aceita_id);
    const reviewed = f.avaliacao.some((r) => r.avaliador_id === userId);
    const closing = action === "complete";
    if (
      closing &&
      reviewed &&
      ["ACEITO", "EM_TRANSPORTE", "CONCLUIDO"].includes(f.status_frete_enum)
    )
      return detail(tx, f, userId);
    if (closing) {
      requireValue(
        ["ACEITO", "EM_TRANSPORTE"].includes(f.status_frete_enum),
        "O frete não está disponível para encerramento.",
        409,
      );
      const pickup = contracted?.ofertas.find(
        (offer) => offer.status === "ACEITA",
      )?.disponivelEm;
      requireValue(
        pickup && pickup <= new Date(),
        "Confirme a conclusão a partir do horário combinado de retirada.",
        422,
      );
    } else {
      requireValue(
        f.status_frete_enum === "CONCLUIDO" && !reviewed,
        "A avaliação está indisponível.",
        409,
      );
    }
    const score = body.score;
    requireValue(
      typeof score === "number" &&
        Number.isInteger(score) &&
        score >= 1 &&
        score <= 5,
      "Informe uma nota de 1 a 5.",
    );
    const target = owner ? contracted?.motorista_id : f.cliente_id;
    requireValue(
      target && target !== userId,
      "Participante indisponível.",
      409,
    );
    await tx.avaliacao.create({
      data: {
        id: randomUUID(),
        frete_id: id,
        avaliador_id: userId,
        avaliado_id: target,
        nota: score,
        comentario: field(body.comment, 1000, 0),
        perfil_avaliador: owner ? "cliente" : "motorista",
      },
    });
    if (closing) {
      const complete = f.avaliacao.some(
        (rating) => rating.avaliador_id === target,
      );
      await tx.frete.update({
        where: { id },
        data: complete
          ? {
              status_frete_enum: "CONCLUIDO",
              atualizado_em: new Date(),
            }
          : { atualizado_em: new Date() },
      });
      const recipients = new Set([
        target,
        ...(complete ? [contracted?.empresa?.gestor_id] : []),
      ]);
      recipients.delete(undefined);
      recipients.delete(userId);
      for (const destinatario_id of recipients) {
        if (!destinatario_id) continue;
        await tx.notificacao.create({
          data: {
            id: randomUUID(),
            destinatario_id,
            papel_destinatario:
              destinatario_id === f.cliente_id ? "cliente" : "motorista",
            evento: complete ? "CONCLUIDO" : "CONFIRMACAO_CONCLUSAO",
            titulo: complete
              ? "Serviço encerrado"
              : "Confirme a conclusão do frete",
            corpo: f.titulo,
            frete_id: id,
          },
        });
      }
    }
  } else if (!proposalId && (action === "start" || action === "cancel")) {
    requireValue(
      action === "start" ? hired : owner,
      "Operação restrita aos participantes.",
      403,
    );
    requireValue(
      action === "start"
        ? f.status_frete_enum === "ACEITO" && !f.avaliacao.length
        : ["ABERTO", "ACEITO"].includes(f.status_frete_enum) &&
          !f.avaliacao.length,
      "O estado do frete mudou.",
      409,
    );
    const status = action === "start" ? "EM_TRANSPORTE" : "CANCELADO";
    await tx.frete.update({
      where: { id },
      data: {
        status_frete_enum: status,
        atualizado_em: new Date(),
      },
    });
    if (action === "cancel") {
      await tx.proposta.updateMany({
        where: { frete_id: id, status_proposta: "PENDENTE" },
        data: { status_proposta: "CANCELADA", atualizado_em: new Date() },
      });
      await tx.ofertaProposta.updateMany({
        where: { proposta: { frete_id: id }, status: "PENDENTE" },
        data: { status: "SUBSTITUIDA" },
      });
    }
    const contracted = f.proposta.find((p) => p.id === f.proposta_aceita_id);
    const recipients = [
      ...new Set(
        (action === "start"
          ? [f.cliente_id, contracted?.empresa?.gestor_id]
          : f.proposta.flatMap((p) => [p.motorista_id, p.empresa?.gestor_id])
        ).filter(
          (recipient): recipient is string =>
            !!recipient && recipient !== userId,
        ),
      ),
    ];
    if (recipients.length)
      await tx.notificacao.createMany({
        data: recipients.map((destinatario_id) => ({
          id: randomUUID(),
          destinatario_id,
          papel_destinatario:
            destinatario_id === f.cliente_id ? "cliente" : "motorista",
          evento: status,
          titulo: "Situação do frete atualizada",
          corpo: f.titulo,
          frete_id: id,
        })),
      });
  } else throw new FreightError(404, "Operação indisponível.");
  return detail(
    tx,
    await tx.frete.findUniqueOrThrow({ where: { id }, include }),
    userId,
  );
}
