import type { Address } from "@/contracts";
import type { Prisma } from "@/generated/prisma/client";

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

function distance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const radians = Math.PI / 180;
  const h =
    Math.sin(((a.lat - b.lat) * radians) / 2) ** 2 +
    Math.cos(a.lat * radians) *
      Math.cos(b.lat * radians) *
      Math.sin(((a.lng - b.lng) * radians) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(Math.min(1, h)));
}

export async function driverCanOffer(
  tx: Prisma.TransactionClient,
  userId: string,
) {
  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "America/Bahia",
  });
  return Boolean(
    await tx.motorista.findFirst({
      where: {
        userId,
        disponivel: true,
        cadastro: {
          status: "APROVADO",
          cnhValidade: { gte: new Date(today) },
          veiculo: { ativo: true },
        },
        assinaturas: {
          some: {
            status: "ATIVA",
            inicioEm: { lte: new Date() },
            fimEm: { gt: new Date() },
          },
        },
      },
      select: { userId: true },
    }),
  );
}

const include = {
  cliente: { include: { user: { select: { name: true } } } },
  avaliacoes: { select: { autorId: true } },
  fotos: { orderBy: { ordem: "asc" } },
  propostas: {
    include: {
      motorista: { include: { user: { select: { name: true } } } },
      conversa: { select: { id: true } },
      ofertas: { orderBy: [{ criadoEm: "desc" }, { id: "desc" }] },
    },
  },
} satisfies Prisma.FreteInclude;

type Row = Prisma.FreteGetPayload<{ include: typeof include }>;

function listing(f: Row) {
  return {
    id: f.id,
    title: f.titulo,
    description: f.descricao,
    origin: region(f.origemSnapshot),
    destination: region(f.destinoSnapshot),
    vehicle: f.categoriaVeiculo,
    status: f.status,
  };
}

function detail(f: Row, userId: string) {
  const owner = f.clienteId === userId;
  const hired = f.propostas.some(
    (p) => p.id === f.propostaAceitaId && p.motoristaId === userId,
  );
  return {
    ...listing(f),
    owner,
    hired,
    updatedAt: f.atualizadoEm.toISOString(),
    schedule: {
      kind:
        f.tipoAgendamento === "FIXA"
          ? "fixa"
          : f.tipoAgendamento === "INTERVALO"
            ? "intervalo"
            : "combinar",
      start: f.dataInicio?.toISOString().slice(0, 10),
      end: f.dataFim?.toISOString().slice(0, 10),
    },
    reviewed: f.avaliacoes.some((r) => r.autorId === userId),
    clientName: f.cliente.user.name,
    photos: f.fotos.map((photo) => photo.arquivoId),
    addresses:
      owner || hired
        ? { pickup: f.origemSnapshot, delivery: f.destinoSnapshot }
        : undefined,
    proposals: f.propostas
      .filter((p) => owner || p.motoristaId === userId)
      .map((p) => ({
        id: p.id,
        driver: p.motorista.user.name,
        status: p.status,
        conversationId: p.conversa?.id,
        offers: p.ofertas.map((o) => ({
          id: o.id,
          createdAt: o.criadoEm.toISOString(),
          priceCents: o.valorCents,
          availableAt: o.retiradaEm,
          message: o.comentario,
          vehicle: o.veiculoSnapshot,
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
  if (id === "addresses" && method === "POST" && !proposalId) {
    requireValue(
      await tx.cliente.findUnique({ where: { userId } }),
      "Ative seu perfil de cliente para salvar endereços.",
      403,
    );
    if (action === "remove") {
      const result = await tx.endereco.deleteMany({
        where: { id: field(body.id, 100), clienteId: userId },
      });
      requireValue(result.count === 1, "Endereço indisponível.", 404);
    } else if (action === "save") {
      const a = address(body.address);
      const data = {
        nome: field(a.label, 80),
        logradouro: a.street,
        numero: a.number,
        complemento: a.complement,
        bairro: a.neighborhood,
        cidade: a.city,
        uf: a.state,
        latitude: a.point!.lat,
        longitude: a.point!.lng,
      };
      if (body.id) {
        const result = await tx.endereco.updateMany({
          where: { id: field(body.id, 100), clienteId: userId },
          data,
        });
        requireValue(result.count === 1, "Endereço indisponível.", 404);
      } else await tx.endereco.create({ data: { ...data, clienteId: userId } });
    } else throw new FreightError(404, "Operação indisponível.");
    return { saved: true };
  }
  if (id === "addresses" && !action && method === "GET") {
    const rows = await tx.endereco.findMany({
      where: { clienteId: userId },
      orderBy: { criadoEm: "desc" },
      take: 100,
    });
    return rows.map((a) => ({
      id: a.id,
      label: a.nome,
      street: a.logradouro,
      number: a.numero,
      complement: a.complemento ?? "",
      city: a.cidade,
      state: a.uf,
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
    const where: Prisma.FreteWhereInput = feed
      ? { status: "ABERTO" }
      : driver
        ? { propostas: { some: { motoristaId: userId } } }
        : { clienteId: userId };
    const rows = await tx.frete.findMany({
      where: { ...where, ...(cursor ? { id: { gt: cursor } } : {}) },
      orderBy: { id: "asc" },
      take: 51,
      include,
    });
    const items = rows.slice(0, 50).filter((f) => {
      if (!center) return true;
      const pickup = (f.origemSnapshot as unknown as Address)?.point;
      return pickup && distance(center, pickup) <= radius;
    });
    return {
      items: items.map((f) => ({
        ...listing(f),
        ownRequest: f.clienteId === userId,
        proposalCount: !driver ? f.propostas.length : undefined,
      })),
      nextCursor: rows.length > 50 ? rows[49].id : null,
    };
  }
  if (method === "POST" && (!id || (action === "edit" && !proposalId))) {
    const previous = id
      ? await tx.frete.findFirst({ where: { id, clienteId: userId }, include })
      : null;
    if (id) {
      requireValue(previous, "Frete indisponível.", 404);
      requireValue(
        previous.status === "ABERTO" &&
          previous.atualizadoEm.toISOString() === body.expectedUpdatedAt,
        "O frete mudou. Atualize antes de editar.",
        409,
      );
    }
    requireValue(
      await tx.cliente.findUnique({ where: { userId } }),
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
      (await tx.arquivoUpload.count({
        where: { id: { in: ids }, usuarioId: userId, finalidade: "freight" },
      })) === ids.length,
      "Fotos indisponíveis.",
    );
    async function save(a: Address) {
      return (
        await tx.endereco.create({
          data: {
            clienteId: userId,
            nome: a.label || a.street,
            logradouro: a.street,
            numero: a.number,
            complemento: a.complement,
            bairro: a.neighborhood,
            cidade: a.city,
            uf: a.state,
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
    const content = {
      titulo: body.title.trim(),
      descricao: field(body.description, 2000),
      categoriaVeiculo: field(body.vehicle, 100),
      tipoAgendamento:
        schedule.kind === "fixa"
          ? ("FIXA" as const)
          : schedule.kind === "intervalo"
            ? ("INTERVALO" as const)
            : ("COMBINAR" as const),
      dataInicio: start,
      dataFim: end,
      origemSnapshot: { ...pickup, point: { ...pickup.point! } },
      destinoSnapshot: { ...delivery, point: { ...delivery.point! } },
    };
    const fotos = ids.map((arquivoId, ordem) => ({ arquivoId, ordem }));
    function sameAddress(a: Prisma.JsonValue, b: Address) {
      const current = a as unknown as Address;
      return (
        current &&
        current.label === b.label &&
        current.city === b.city &&
        current.state === b.state &&
        current.neighborhood === b.neighborhood &&
        current.street === b.street &&
        current.number === b.number &&
        current.complement === b.complement &&
        current.point?.lat === b.point?.lat &&
        current.point?.lng === b.point?.lng
      );
    }
    const changed =
      previous &&
      (previous.titulo !== content.titulo ||
        previous.descricao !== content.descricao ||
        previous.categoriaVeiculo !== content.categoriaVeiculo ||
        previous.tipoAgendamento !== content.tipoAgendamento ||
        +(previous.dataInicio ?? 0) !== +(start ?? 0) ||
        +(previous.dataFim ?? 0) !== +(end ?? 0) ||
        !sameAddress(previous.origemSnapshot, pickup) ||
        !sameAddress(previous.destinoSnapshot, delivery) ||
        previous.fotos.map((photo) => photo.arquivoId).join(",") !==
          ids.join(","));
    if (
      previous &&
      !changed &&
      body.savePickup !== true &&
      body.saveDelivery !== true
    )
      return detail(previous, userId);
    const data = {
      ...content,
      origemId: body.savePickup === true ? await save(pickup) : undefined,
      destinoId: body.saveDelivery === true ? await save(delivery) : undefined,
    };
    if (previous && !changed) {
      const updated = await tx.frete.update({
        where: { id: previous.id },
        include,
        data: {
          origemId: data.origemId,
          destinoId: data.destinoId,
        },
      });
      return detail(updated, userId);
    }
    if (previous) {
      await tx.proposta.updateMany({
        where: { freteId: previous.id, status: "PENDENTE" },
        data: { status: "CANCELADA" },
      });
      await tx.oferta.updateMany({
        where: { proposta: { freteId: previous.id }, status: "PENDENTE" },
        data: { status: "SUBSTITUIDA" },
      });
      const recipients = previous.propostas.map((p) => ({
        destinatarioId: p.motoristaId,
        papelDestinatario: "motorista",
        evento: "FRETE_EDITADO",
        titulo: "Solicitação atualizada",
        corpo: content.titulo,
        freteId: previous.id,
      }));
      if (recipients.length)
        await tx.notificacao.createMany({ data: recipients });
      const updated = await tx.frete.update({
        where: { id: previous.id },
        include,
        data: {
          ...data,
          origemId: data.origemId ?? null,
          destinoId: data.destinoId ?? null,
          fotos: { deleteMany: {}, create: fotos },
        },
      });
      return detail(updated, userId);
    }
    const f = await tx.frete.create({
      data: { ...data, clienteId: userId, fotos: { create: fotos } },
      include,
    });
    return detail(f, userId);
  }
  requireValue(id && segments.length <= 3, "Operação indisponível.", 404);
  const f = await tx.frete.findUnique({ where: { id }, include });
  requireValue(f, "Frete indisponível.", 404);
  const owner = f.clienteId === userId;
  const own = f.propostas.find((p) => p.motoristaId === userId);
  const hired = Boolean(own && own.id === f.propostaAceitaId);
  if (method === "GET" && action === "photo" && proposalId) {
    requireValue(
      owner ||
        own ||
        (f.status === "ABERTO" && (await driverCanOffer(tx, userId))),
      "Foto indisponível.",
      404,
    );
    requireValue(
      f.fotos.some((photo) => photo.arquivoId === proposalId),
      "Foto indisponível.",
      404,
    );
    return { photoOwner: f.clienteId };
  }
  if (method === "GET" && !action) {
    requireValue(
      owner ||
        own ||
        (f.status === "ABERTO" && (await driverCanOffer(tx, userId))),
      "Frete indisponível.",
      404,
    );
    return detail(f, userId);
  }
  requireValue(method === "POST", "Operação indisponível.", 404);
  if (action === "propose" && !proposalId) {
    requireValue(
      !owner && (await driverCanOffer(tx, userId)),
      "Você não pode enviar propostas.",
      403,
    );
    requireValue(f.status === "ABERTO", "O frete foi encerrado.", 409);
    requireValue(
      f.atualizadoEm.toISOString() === body.expectedUpdatedAt,
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
      !f.dataInicio || requestedDay >= f.dataInicio.toISOString().slice(0, 10),
      "Escolha um horário dentro da agenda.",
    );
    requireValue(
      !f.dataFim || requestedDay <= f.dataFim.toISOString().slice(0, 10),
      "Escolha um horário dentro da agenda.",
    );
    const vehicle = await tx.veiculo.findFirst({
      where: {
        id: field(body.vehicleId, 100),
        motoristaId: userId,
        ativo: true,
      },
    });
    requireValue(vehicle, "Escolha um veículo ativo da sua conta.");
    const proposal = own
      ? await tx.proposta.update({
          where: { id: own.id },
          data: { status: "PENDENTE" },
        })
      : await tx.proposta.create({
          data: { freteId: id, motoristaId: userId, conversa: { create: {} } },
        });
    await tx.oferta.updateMany({
      where: { propostaId: proposal.id, status: "PENDENTE" },
      data: { status: "SUBSTITUIDA" },
    });
    await tx.oferta.create({
      data: {
        propostaId: proposal.id,
        autorId: userId,
        valorCents: price,
        retiradaEm: new Date(availability),
        comentario: field(body.message, 1000, 0),
        veiculoId: vehicle.id,
        veiculoSnapshot: [vehicle.categoria, vehicle.modelo].join(" · "),
      },
    });
    await tx.notificacao.create({
      data: {
        destinatarioId: f.clienteId,
        papelDestinatario: "cliente",
        evento: "PROPOSTA",
        titulo: "Nova proposta",
        corpo: f.titulo,
        freteId: id,
        propostaId: proposal.id,
      },
    });
  } else if ((action === "accept" || action === "decline") && proposalId) {
    requireValue(
      owner,
      "Somente o cliente pode decidir sobre a proposta.",
      403,
    );
    const proposal = f.propostas.find((p) => p.id === proposalId);
    requireValue(proposal, "Proposta indisponível.", 404);
    if (
      action === "accept" &&
      f.propostaAceitaId === proposalId &&
      proposal.ofertas.some(
        (o) => o.id === body.offerId && o.status === "ACEITA",
      )
    )
      return detail(f, userId);
    const offer = proposal.ofertas.find(
      (o) => o.id === body.offerId && o.status === "PENDENTE",
    );
    requireValue(
      f.status === "ABERTO" && proposal.status === "PENDENTE" && offer,
      "A oferta mudou. Atualize antes de decidir.",
      409,
    );
    requireValue(
      action === "decline" ||
        (offer.retiradaEm &&
          +offer.retiradaEm > Date.now() &&
          (await driverCanOffer(tx, proposal.motoristaId)) &&
          (await tx.veiculo.findFirst({
            where: {
              id: offer.veiculoId ?? "",
              motoristaId: proposal.motoristaId,
              ativo: true,
            },
          }))),
      "A oferta perdeu a validade.",
      409,
    );
    await tx.oferta.update({
      where: { id: offer.id },
      data: { status: action === "accept" ? "ACEITA" : "RECUSADA" },
    });
    await tx.proposta.update({
      where: { id: proposalId },
      data: { status: action === "accept" ? "ACEITA" : "RECUSADA" },
    });
    if (action === "accept") {
      await tx.frete.update({
        where: { id },
        data: { status: "AGENDADO", propostaAceitaId: proposalId },
      });
      await tx.proposta.updateMany({
        where: { freteId: id, id: { not: proposalId }, status: "PENDENTE" },
        data: { status: "CANCELADA" },
      });
      await tx.oferta.updateMany({
        where: {
          proposta: { freteId: id, id: { not: proposalId } },
          status: "PENDENTE",
        },
        data: { status: "SUBSTITUIDA" },
      });
    }
    await tx.notificacao.create({
      data: {
        destinatarioId: proposal.motoristaId,
        papelDestinatario: "motorista",
        evento: action === "accept" ? "ACEITE" : "RECUSA",
        titulo: action === "accept" ? "Proposta aceita" : "Proposta recusada",
        corpo: f.titulo,
        freteId: id,
        propostaId: proposalId,
      },
    });
  } else if (!proposalId && action === "reviews") {
    requireValue(owner || hired, "Somente participantes podem avaliar.", 403);
    requireValue(
      f.status === "CONCLUIDO" &&
        !f.avaliacoes.some((r) => r.autorId === userId),
      "A avaliação está indisponível.",
      409,
    );
    const score = body.score;
    requireValue(
      typeof score === "number" &&
        Number.isInteger(score) &&
        score >= 1 &&
        score <= 5,
      "Informe uma nota de 1 a 5.",
    );
    const target = owner
      ? f.propostas.find((p) => p.id === f.propostaAceitaId)?.motoristaId
      : f.clienteId;
    requireValue(
      target && target !== userId,
      "Participante indisponível.",
      409,
    );
    await tx.avaliacao.create({
      data: {
        freteId: id,
        autorId: userId,
        avaliadoId: target,
        nota: score,
        comentario: field(body.comment, 1000, 0),
      },
    });
  } else if (
    !proposalId &&
    (action === "start" || action === "complete" || action === "cancel")
  ) {
    requireValue(
      action === "start" ? hired : owner,
      "Operação restrita aos participantes.",
      403,
    );
    requireValue(
      action === "start"
        ? f.status === "AGENDADO"
        : action === "complete"
          ? f.status === "EM_TRANSPORTE"
          : ["ABERTO", "AGENDADO"].includes(f.status),
      "O estado do frete mudou.",
      409,
    );
    const status =
      action === "start"
        ? "EM_TRANSPORTE"
        : action === "complete"
          ? "CONCLUIDO"
          : "CANCELADO";
    await tx.frete.update({
      where: { id },
      data: {
        status,
        ...(action === "cancel"
          ? {
              cancelamento: {
                reason: field(body.reason, 1000, 10),
                at: new Date().toISOString(),
                previousStatus: f.status,
                userId,
              },
            }
          : {}),
      },
    });
    if (action === "cancel") {
      await tx.proposta.updateMany({
        where: { freteId: id, status: "PENDENTE" },
        data: { status: "CANCELADA" },
      });
      await tx.oferta.updateMany({
        where: { proposta: { freteId: id }, status: "PENDENTE" },
        data: { status: "SUBSTITUIDA" },
      });
    }
    const recipients =
      action === "start"
        ? [f.clienteId]
        : action === "complete"
          ? f.propostas
              .filter((p) => p.id === f.propostaAceitaId)
              .map((p) => p.motoristaId)
          : f.propostas.map((p) => p.motoristaId);
    if (recipients.length)
      await tx.notificacao.createMany({
        data: recipients.map((destinatarioId) => ({
          destinatarioId,
          papelDestinatario: action === "start" ? "cliente" : "motorista",
          evento: status,
          titulo: "Situação do frete atualizada",
          corpo: f.titulo,
          freteId: id,
        })),
      });
  } else throw new FreightError(404, "Operação indisponível.");
  return detail(
    await tx.frete.findUniqueOrThrow({ where: { id }, include }),
    userId,
  );
}
