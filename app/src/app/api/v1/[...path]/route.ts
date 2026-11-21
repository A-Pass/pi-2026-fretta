import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { getAuthConfigurationError } from "@/server/auth/env";
import {
  loadAccountStore,
  loadAdminDocuments,
  loadAdminRegistrations,
  reviewDriverRegistration,
  saveAccountStore,
} from "@/server/modules/store/persistence";
import {
  ADMIN_COOKIE,
  adminTokenUsername,
  adminCredentialsConfigured,
  createAdminToken,
  readAdminCookie,
  verifyAdminCredentials,
  verifyAdminToken,
} from "@/server/admin-auth";

type FreightFeedItem = {
  id: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  vehicle: string;
  schedule: { kind: "fixa" | "intervalo" | "combinar"; start?: string; end?: string };
  status: "ABERTO" | "AGENDADO" | "EM_TRANSPORTE" | "CONCLUIDO" | "CANCELADO";
  pickupDistanceKm?: number;
};

function error(code: string, message: string, status: number) {
  return Response.json({ code, message }, { status });
}

async function getSession(request: NextRequest) {
  const configurationError = getAuthConfigurationError();
  if (configurationError) {
    throw new Response(
      JSON.stringify({
        code: "AUTH_NOT_CONFIGURED",
        message: "A autenticação do servidor não está configurada.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  const { auth } = await import("@/server/auth");
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw new Response(null, { status: 401 });
  return session;
}

async function stateStore(request: NextRequest, method: "GET" | "PUT") {
  const session = await getSession(request);
  const { prisma } = await import("@/server/db");
  const userId = session.user.id;

  if (method === "PUT") {
    const body = await request.json().catch(() => null);
    const failure = await saveAccountStore(prisma, userId, body);
    if (failure) return failure;
  }
  return Response.json(await loadAccountStore(prisma, userId));
}

function approximateRegion(address: {
  bairro: string | null;
  cidade: string;
  estado: string;
}) {
  const region = [address.bairro, address.cidade, address.estado]
    .filter((value, index, values): value is string =>
      Boolean(value) && values.indexOf(value) === index,
    )
    .join(", ");
  return region;
}

async function adminRegistrations(request: NextRequest) {
  if (!adminTokenUsername(readAdminCookie(request.headers.get("cookie"))))
    return error("UNAUTHORIZED", "Faça login como administrador.", 401);
  const { prisma } = await import("@/server/db");
  return Response.json(await loadAdminRegistrations(prisma));
}

async function adminPrivateDocuments(request: NextRequest, userId: string) {
  if (!adminTokenUsername(readAdminCookie(request.headers.get("cookie"))))
    return error("UNAUTHORIZED", "Faça login como administrador.", 401);
  const { prisma } = await import("@/server/db");
  return Response.json(await loadAdminDocuments(prisma, userId));
}

async function reviewAdminRegistration(
  request: NextRequest,
  userId: string,
) {
  const actor = adminTokenUsername(readAdminCookie(request.headers.get("cookie")));
  if (!actor) return error("UNAUTHORIZED", "Faça login como administrador.", 401);
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body))
    return error("INVALID_BODY", "Informe uma decisão válida.", 422);
  const { prisma } = await import("@/server/db");
  const result = await reviewDriverRegistration(
    prisma,
    userId,
    actor,
    body as Record<string, unknown>,
  );
  if ("error" in result) return result.error;
  return Response.json({ reviewedCase: result.case, review: result.review });
}

function distanceKm(
  latA: number,
  lngA: number,
  latB: number,
  lngB: number,
) {
  const rad = (value: number) => (value * Math.PI) / 180;
  const dLat = rad(latB - latA);
  const dLng = rad(lngB - lngA);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(latA)) *
      Math.cos(rad(latB)) *
      Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}

async function freightFeed(request: NextRequest) {
  await getSession(request);
  const { prisma } = await import("@/server/db");
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor")?.trim() || undefined;
  const q = url.searchParams.get("q")?.trim().toLowerCase() || "";
  const limit = Math.min(
    Math.max(Number.parseInt(url.searchParams.get("limit") || "20", 10) || 20, 1),
    100,
  );
  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));
  const radiusKm = Number(url.searchParams.get("radiusKm"));
  const hasArea =
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Number.isFinite(radiusKm) &&
    radiusKm > 0 &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180;

  const items: FreightFeedItem[] = [];
  let scanCursor: string | null = cursor ?? null;
  let nextCursor: string | null = null;
  let reachedEnd = false;

  while (items.length < limit && !reachedEnd) {
    const freights = await prisma.frete.findMany({
      where: { statusFrete: "ABERTO" },
      include: {
        enderecoOrigem: true,
        enderecoDestino: true,
        fotos: { orderBy: { ordem: "asc" }, select: { url: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      ...(scanCursor ? { cursor: { id: scanCursor }, skip: 1 } : {}),
    });

    if (!freights.length) {
      reachedEnd = true;
      break;
    }

    for (const freight of freights) {
      const origin = approximateRegion(freight.enderecoOrigem);
      const destination = approximateRegion(freight.enderecoDestino);
      if (
        q &&
        !`${freight.titulo} ${freight.descricao ?? ""} ${origin} ${destination}`
          .toLowerCase()
          .includes(q)
      ) {
        scanCursor = freight.id;
        continue;
      }

      let pickupDistanceKm: number | undefined;
      if (hasArea) {
        if (
          freight.enderecoOrigem.latitude == null ||
          freight.enderecoOrigem.longitude == null
        ) {
          scanCursor = freight.id;
          continue;
        }
        pickupDistanceKm = distanceKm(
          lat,
          lng,
          Number(freight.enderecoOrigem.latitude),
          Number(freight.enderecoOrigem.longitude),
        );
        if (pickupDistanceKm > radiusKm) {
          scanCursor = freight.id;
          continue;
        }
      }

      const start = freight.dataColetaPrevista?.toISOString();
      const end = freight.dataEntregaPrevista?.toISOString();
      items.push({
        id: freight.id,
        title: freight.titulo,
        description: freight.descricao ?? "",
        origin,
        destination,
        vehicle:
          freight.categoriaPorte === "PEQUENO"
            ? "Caminhão pequeno"
            : freight.categoriaPorte === "MEDIO"
              ? "Caminhão médio"
              : "Caminhão grande",
        schedule: start
          ? end
            ? { kind: "intervalo", start, end }
            : { kind: "fixa", start }
          : { kind: "combinar" },
        status: "ABERTO",
        ...(pickupDistanceKm != null ? { pickupDistanceKm } : {}),
      });
      scanCursor = freight.id;
      if (items.length === limit) break;
    }

    nextCursor = scanCursor;
    if (freights.length < 100) reachedEnd = true;
  }

  return Response.json({
    items,
    nextCursor: reachedEnd ? null : (nextCursor ?? null),
  });
}

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

async function createFreight(request: NextRequest) {
  const session = await getSession(request);
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return error("INVALID_BODY", "Os dados da solicitação são inválidos.", 422);
  }

  const payload = body as Record<string, unknown>;
  const title = text(payload.title, 150);
  const description = text(payload.description, 2000);
  const vehicle = text(payload.vehicle, 80);
  const pickup = payload.pickup;
  const delivery = payload.delivery;
  const schedule =
    payload.schedule && typeof payload.schedule === "object"
      ? (payload.schedule as Record<string, unknown>)
      : null;
  const photoIds = Array.isArray(payload.photoIds)
    ? payload.photoIds
        .filter((value): value is string => typeof value === "string")
        .slice(0, 4)
    : [];

  if (
    title.length < 3 ||
    description.length < 3 ||
    !pickup ||
    typeof pickup !== "object" ||
    !delivery ||
    typeof delivery !== "object" ||
    !["Utilitário", "Caminhão pequeno", "Caminhão médio", "Caminhão grande"].includes(vehicle) ||
    !schedule ||
    !["fixa", "intervalo", "combinar"].includes(text(schedule.kind, 20))
  ) {
    return error("INVALID_BODY", "Complete todos os dados da solicitação.", 422);
  }

  const pickupAddress = pickup as Record<string, unknown>;
  const deliveryAddress = delivery as Record<string, unknown>;
  const parseAddress = (address: Record<string, unknown>) => {
    const street = text(address.street, 200);
    const number = text(address.number, 20);
    const neighborhood = text(address.neighborhood, 120);
    const city = text(address.city, 120);
    const state = text(address.state, 2).toUpperCase();
    const postalCode = text(address.postalCode, 20);
    const complement = text(address.complement, 200);
    const point =
      address.point && typeof address.point === "object"
        ? (address.point as Record<string, unknown>)
        : null;
    const lat =
      point && typeof point.lat === "number" && Number.isFinite(point.lat)
        ? point.lat
        : null;
    const lng =
      point && typeof point.lng === "number" && Number.isFinite(point.lng)
        ? point.lng
        : null;
    if (
      !street ||
      !city ||
      state.length !== 2 ||
      !postalCode ||
      lat === null ||
      lng === null ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return null;
    }
    return {
      logradouro: street,
      numero: number || null,
      complemento: complement || null,
      bairro: neighborhood || null,
      cidade: city,
      estado: state,
      cep: postalCode,
      pais: "Brasil",
      latitude: lat,
      longitude: lng,
    };
  };

  const pickupData = parseAddress(pickupAddress);
  const deliveryData = parseAddress(deliveryAddress);
  if (!pickupData || !deliveryData) {
    return error(
      "INVALID_ADDRESS",
      "Informe endereços completos e confirme os pontos no mapa.",
      422,
    );
  }

  const kind = text(schedule.kind, 20);
  const start = text(schedule.start, 40);
  const end = text(schedule.end, 40);
  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;
  if (
    (kind !== "combinar" && (!startDate || Number.isNaN(startDate.getTime()))) ||
    (kind === "intervalo" &&
      (!endDate ||
        Number.isNaN(endDate.getTime()) ||
        endDate.getTime() < startDate!.getTime()))
  ) {
    return error("INVALID_SCHEDULE", "A agenda informada é inválida.", 422);
  }

  const category: "PEQUENO" | "MEDIO" | "GRANDE" =
    vehicle === "Utilitário" || vehicle === "Caminhão pequeno"
      ? "PEQUENO"
      : vehicle === "Caminhão médio"
        ? "MEDIO"
        : "GRANDE";
  const { prisma } = await import("@/server/db");

  const { freight, savedAddresses } = await prisma.$transaction(async (tx) => {
    const cliente = await tx.cliente.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id },
      update: {},
    });
    const [pickupAddressRow, deliveryAddressRow] = await Promise.all([
      tx.endereco.create({ data: pickupData }),
      tx.endereco.create({ data: deliveryData }),
    ]);
    const savedAddresses = [];
    if (payload.savePickup === true) {
      savedAddresses.push(
        await tx.savedAddress.create({
          data: {
            id: randomUUID(),
            userId: session.user.id,
            label: text(pickupAddress.label, 80) || "Retirada",
            logradouro: pickupData.logradouro,
            numero: pickupData.numero ?? "",
            complemento: pickupData.complemento ?? "",
            bairro: pickupData.bairro ?? "",
            cidade: pickupData.cidade,
            estado: pickupData.estado,
            cep: pickupData.cep,
            latitude: pickupData.latitude,
            longitude: pickupData.longitude,
          },
        }),
      );
    }
    if (payload.saveDelivery === true) {
      savedAddresses.push(
        await tx.savedAddress.create({
          data: {
            id: randomUUID(),
            userId: session.user.id,
            label: text(deliveryAddress.label, 80) || "Entrega",
            logradouro: deliveryData.logradouro,
            numero: deliveryData.numero ?? "",
            complemento: deliveryData.complemento ?? "",
            bairro: deliveryData.bairro ?? "",
            cidade: deliveryData.cidade,
            estado: deliveryData.estado,
            cep: deliveryData.cep,
            latitude: deliveryData.latitude,
            longitude: deliveryData.longitude,
          },
        }),
      );
    }
    const freight = await tx.frete.create({
      data: {
        clienteId: cliente.userId,
        titulo: title,
        descricao: description,
        categoriaPorte: category,
        statusFrete: "ABERTO",
        enderecoOrigemId: pickupAddressRow.id,
        enderecoDestinoId: deliveryAddressRow.id,
        dataColetaPrevista:
          kind === "fixa" || kind === "intervalo" ? startDate : null,
        dataEntregaPrevista: kind === "intervalo" ? endDate : null,
        fotos: {
          create: photoIds.map((url, index) => ({ url, ordem: index })),
        },
      },
      include: {
        enderecoOrigem: true,
        enderecoDestino: true,
        fotos: { orderBy: { ordem: "asc" } },
      },
    });
    return { freight, savedAddresses };
  });

  return Response.json(
    {
      freight: {
        id: freight.id,
        title: freight.titulo,
        description: freight.descricao ?? "",
        origin: approximateRegion(freight.enderecoOrigem),
        destination: approximateRegion(freight.enderecoDestino),
        vehicle,
        schedule: kind === "combinar"
          ? { kind: "combinar" }
          : kind === "fixa"
            ? { kind: "fixa", start: startDate?.toISOString() }
            : {
                kind: "intervalo",
                start: startDate?.toISOString(),
                end: endDate?.toISOString(),
              },
        status: "ABERTO",
        photos: freight.fotos.map((photo) => photo.url),
        reviews: {},
      },
      savedAddresses: savedAddresses.map((address) => ({
        id: address.id,
        label: address.label,
        street: address.logradouro,
        number: address.numero,
        complement: address.complemento,
        neighborhood: address.bairro,
        city: address.cidade,
        state: address.estado,
        postalCode: address.cep ?? undefined,
        point: {
          lat: Number(address.latitude),
          lng: Number(address.longitude),
        },
      })),
    },
    { status: 201 },
  );
}

async function createProposal(request: NextRequest, freightId: string) {
  const session = await getSession(request);
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return error("INVALID_BODY", "Os dados da proposta são inválidos.", 422);
  }

  const payload = body as Record<string, unknown>;
  const priceCents =
    typeof payload.priceCents === "number" ? payload.priceCents : Number.NaN;
  const vehicleId = text(payload.vehicleId, 120);
  const availableAt =
    typeof payload.availableAt === "string" ? payload.availableAt : "";
  const message = text(payload.message, 2000);
  const availability = new Date(availableAt);

  if (
    !Number.isSafeInteger(priceCents) ||
    priceCents <= 0 ||
    priceCents > 100000000 ||
    !vehicleId ||
    !message ||
    !Number.isFinite(availability.getTime()) ||
    availability.getTime() <= Date.now()
  ) {
    return error(
      "INVALID_PROPOSAL",
      "Informe um valor válido, um veículo, uma disponibilidade futura e um comentário.",
      422,
    );
  }

  const { prisma } = await import("@/server/db");
  const proposalId = randomUUID();
  const offerId = randomUUID();
  const result = await prisma.$transaction(async (tx) => {
    const [freight, driver, vehicle, existing] = await Promise.all([
      tx.frete.findUnique({ where: { id: freightId } }),
      tx.motorista.findUnique({
        where: { userId: session.user.id },
        include: { user: { include: { companyProfile: true } } },
      }),
      tx.veiculo.findFirst({
        where: { id: vehicleId, motoristaId: session.user.id, ativo: true },
      }),
      tx.proposta.findUnique({
        where: {
          freteId_motoristaId: {
            freteId: freightId,
            motoristaId: session.user.id,
          },
        },
        select: { id: true },
      }),
    ]);
    if (!freight) return { error: "FREIGHT_NOT_FOUND" as const };
    if (freight.statusFrete !== "ABERTO")
      return { error: "FREIGHT_CLOSED" as const };
    if (freight.clienteId === session.user.id)
      return { error: "OWN_FREIGHT" as const };
    if (
      !driver ||
      driver.cadastroStatus !== "APROVADO" ||
      !driver.cnhValidade ||
      driver.cnhValidade.getTime() + 86_400_000 <= Date.now()
    )
      return { error: "DRIVER_NOT_REGISTERED" as const };
    if (!vehicle) return { error: "VEHICLE_NOT_FOUND" as const };
    if (existing) return { error: "PROPOSAL_EXISTS" as const };

    const vehicleLabel =
      [
        vehicle.categoriaPorte === "PEQUENO"
          ? "Caminhão pequeno"
          : vehicle.categoriaPorte === "MEDIO"
            ? "Caminhão médio"
            : "Caminhão grande",
        vehicle.modelo,
      ]
        .filter(Boolean)
        .join(" · ") || "Veículo selecionado";
    await tx.proposta.create({
      data: {
        id: proposalId,
        freteId: freightId,
        motoristaId: session.user.id,
        valorProposto: (priceCents / 100).toFixed(2),
        mensagem: message,
        statusProposta: "PENDENTE",
        ofertas: {
          create: {
            id: offerId,
            veiculoId: vehicle.id,
            veiculoLabel: vehicleLabel,
            valorCentavos: priceCents,
            disponivelEm: availability,
            mensagem: message,
            status: "PENDENTE",
          },
        },
      },
    });
    await tx.appNotification.create({
      data: {
        id: `proposal:${offerId}`,
        userId: freight.clienteId,
        role: "cliente",
        title: "Nova proposta recebida",
        body: `${session.user.name} enviou uma proposta.`,
        createdAt: new Date(),
        freightId,
        proposalId,
      },
    });
    return {
      proposal: {
        id: proposalId,
        freightId,
        driverId: session.user.id,
        driver: session.user.name,
        rating: Number(driver.avaliacaoMedia),
        ...(driver.user.companyProfile
          ? {
              providerName: driver.user.companyProfile.tradeName,
              providerLogo: driver.user.companyProfile.logo,
              providerKind: "empresa" as const,
            }
          : {
              providerName: session.user.name,
              providerKind: "autonomo" as const,
            }),
        vehicleId,
        vehicle: vehicleLabel,
        priceCents,
        availableAt: availability.toISOString(),
        message,
        status: "PENDENTE" as const,
        offers: [
          {
            id: offerId,
            vehicleId,
            vehicle: vehicleLabel,
            priceCents,
            availableAt: availability.toISOString(),
            message,
            createdAt: new Date().toISOString(),
            status: "PENDENTE" as const,
          },
        ],
      },
    };
  });
  if ("error" in result) {
    if (result.error === "FREIGHT_NOT_FOUND")
      return error("FREIGHT_NOT_FOUND", "Solicitação não encontrada.", 404);
    if (result.error === "FREIGHT_CLOSED")
      return error("FREIGHT_CLOSED", "Esta solicitação não está mais aberta.", 409);
    if (result.error === "OWN_FREIGHT")
      return error("OWN_FREIGHT", "Não é possível enviar proposta no próprio frete.", 403);
    if (result.error === "DRIVER_NOT_REGISTERED")
      return error(
        "DRIVER_NOT_REGISTERED",
        "O cadastro de motorista ainda não está aprovado ou a CNH está vencida.",
        409,
      );
    if (result.error === "VEHICLE_NOT_FOUND")
      return error("VEHICLE_NOT_FOUND", "Selecione um veículo cadastrado.", 422);
    return error(
      "PROPOSAL_EXISTS",
      "Você já enviou uma proposta para esta solicitação.",
      409,
    );
  }
  return Response.json(result.proposal, { status: 201 });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await context.params;
    if (path.join("/") === "admin/me") {
      const authenticated = verifyAdminToken(
        readAdminCookie(request.headers.get("cookie")),
      );
      if (!authenticated) return error("UNAUTHORIZED", "Faça login como administrador.", 401);
      return Response.json({ authenticated: true });
    }
    if (path.join("/") === "admin/registrations")
      return await adminRegistrations(request);
    const documentPath = /^admin\/registrations\/([^/]+)\/documents$/.exec(
      path.join("/"),
    );
    if (documentPath)
      return await adminPrivateDocuments(request, path[2]);
    if (path.join("/") === "state") return await stateStore(request, "GET");
    if (path.join("/") === "freights") return await freightFeed(request);
    if (path.join("/") === "me") {
      await getSession(request);
      return await stateStore(request, "GET");
    }
    return error("NOT_IMPLEMENTED", "Esta operação ainda não está disponível.", 501);
  } catch (failure) {
    if (failure instanceof Response) return failure;
    console.error("API request failed", failure);
    return error("SERVER_ERROR", "Não foi possível concluir a operação.", 500);
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await context.params;
    if (path.join("/") === "state") return await stateStore(request, "PUT");
    return error("NOT_IMPLEMENTED", "Esta operação ainda não está disponível.", 501);
  } catch (failure) {
    if (failure instanceof Response) return failure;
    console.error("API request failed", failure);
    return error("SERVER_ERROR", "Não foi possível concluir a operação.", 500);
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await context.params;
    const reviewPath = /^admin\/registrations\/([^/]+)\/review$/.exec(
      path.join("/"),
    );
    if (reviewPath)
      return await reviewAdminRegistration(request, path[2]);
    const proposalPath = /^freights\/[^/]+\/proposals$/.exec(path.join("/"));
    if (proposalPath) {
      const freightId = path[1];
      return await createProposal(request, freightId);
    }
    if (path.join("/") === "freights") return await createFreight(request);
    if (path.join("/") === "admin/login") {
      if (!adminCredentialsConfigured()) {
        return error(
          "ADMIN_AUTH_NOT_CONFIGURED",
          "Credenciais administrativas não configuradas no servidor.",
          503,
        );
      }
      const body = await request.json().catch(() => null);
      if (!body || typeof body !== "object") {
        return error("INVALID_BODY", "Informe usuário e senha.", 422);
      }
      const username =
        "username" in body && typeof body.username === "string"
          ? body.username.trim()
          : "";
      const password =
        "password" in body && typeof body.password === "string"
          ? body.password
          : "";
      if (!verifyAdminCredentials(username, password)) {
        return error("INVALID_CREDENTIALS", "Usuário ou senha inválidos.", 401);
      }
      const secure =
        process.env.NODE_ENV === "production"
          ? "; Secure"
          : "";
      return Response.json(
        { authenticated: true },
        {
          headers: {
            "Set-Cookie": `${ADMIN_COOKIE}=${createAdminToken(username)}; HttpOnly; Path=/; SameSite=Strict; Max-Age=28800${secure}`,
          },
        },
      );
    }
    if (path.join("/") === "admin/logout") {
      const secure =
        process.env.NODE_ENV === "production"
          ? "; Secure"
          : "";
      return Response.json(
        { authenticated: false },
        {
          headers: {
            "Set-Cookie": `${ADMIN_COOKIE}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0${secure}`,
          },
        },
      );
    }
    return GET(request, context);
  } catch (failure) {
    if (failure instanceof Response) return failure;
    console.error("POST request failed", failure);
    return error("SERVER_ERROR", "Não foi possível concluir o login.", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return PUT(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return error("NOT_IMPLEMENTED", "Esta operação ainda não está disponível.", 501);
}
