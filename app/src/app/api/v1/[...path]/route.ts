import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import type { AdminCase, AdminReview, DriverRegistration, Vehicle } from "@/contracts";
import { getAuthConfigurationError } from "@/server/auth/env";
import {
  ADMIN_COOKIE,
  adminTokenUsername,
  adminCredentialsConfigured,
  createAdminToken,
  readAdminCookie,
  verifyAdminCredentials,
  verifyAdminToken,
} from "@/server/admin-auth";

type StoreResponse = {
  freights: unknown[];
  proposals: unknown[];
  messages: unknown[];
  [key: string]: unknown;
};

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
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return error("INVALID_BODY", "O estado enviado é inválido.", 422);
    }
    if (
      !Array.isArray((body as StoreResponse).freights) ||
      !Array.isArray((body as StoreResponse).proposals) ||
      !Array.isArray((body as StoreResponse).messages)
    ) {
      return error("INVALID_BODY", "O estado enviado está incompleto.", 422);
    }

    const safe = structuredClone(body as StoreResponse);
    const registration = safe.driverRegistration;
    if (
      registration &&
      typeof registration === "object" &&
      !Array.isArray(registration)
    ) {
      const licensePhoto = (registration as Record<string, unknown>)
        .licensePhotoDataUrl;
      if (
        licensePhoto !== undefined &&
        (typeof licensePhoto !== "string" ||
          licensePhoto.length > 7_000_000 ||
          !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(
            licensePhoto,
          ))
      )
        return error(
          "INVALID_DOCUMENT",
          "A imagem da CNH não tem um formato aceito.",
          422,
        );
    }
    delete safe.adminDemoCases;
    delete safe.subscriptionActive;
    if (
      safe.driverRegistration &&
      typeof safe.driverRegistration === "object" &&
      !Array.isArray(safe.driverRegistration)
    )
      delete (safe.driverRegistration as Record<string, unknown>).mode;
    safe.profile = {
      name:
        typeof safe.profile === "object" &&
        safe.profile &&
        "name" in safe.profile &&
        typeof safe.profile.name === "string"
          ? safe.profile.name.slice(0, 100)
          : session.user.name,
      photo:
        typeof safe.profile === "object" &&
        safe.profile &&
        "photo" in safe.profile &&
        typeof safe.profile.photo === "string"
          ? safe.profile.photo
          : session.user.image ?? "",
    };

    await prisma.$transaction(
      async (tx) => {
        const previousState = await tx.appState.findUnique({
          where: { userId },
        });
        const previousData =
          previousState?.data &&
          typeof previousState.data === "object" &&
          !Array.isArray(previousState.data)
            ? (previousState.data as Record<string, unknown>)
            : null;
        const incomingRegistration = safe.driverRegistration;
        const previousRegistration =
          previousData?.driverRegistration &&
          typeof previousData.driverRegistration === "object" &&
          !Array.isArray(previousData.driverRegistration)
            ? (previousData.driverRegistration as Record<string, unknown>)
            : null;
        if (
          incomingRegistration &&
          typeof incomingRegistration === "object" &&
          !Array.isArray(incomingRegistration)
        ) {
          const submitted = incomingRegistration as Record<string, unknown>;
          const isResubmission =
            submitted.status === "EM_ANALISE" &&
            typeof submitted.submittedAt === "string" &&
            submitted.submittedAt !== previousRegistration?.submittedAt;
          if (!previousRegistration || isResubmission) {
            submitted.status = "EM_ANALISE";
            delete submitted.reviewedAt;
            delete submitted.feedback;
          } else {
            safe.driverRegistration = previousRegistration;
          }
        } else if (previousRegistration)
          safe.driverRegistration = previousRegistration;
        if (Array.isArray(previousData?.adminReviews))
          safe.adminReviews = previousData.adminReviews;
        else delete safe.adminReviews;

        const jsonState = JSON.parse(JSON.stringify(safe));
        await tx.appState.upsert({
          where: { userId },
          create: { userId, data: jsonState },
          update: { data: jsonState },
        });
      },
      { isolationLevel: "Serializable" },
    );
  }

  const [stored, ownedFreights] = await Promise.all([
    prisma.appState.findUnique({ where: { userId } }),
    prisma.frete.findMany({
      where: { clienteId: userId },
      include: {
        enderecoOrigem: true,
        enderecoDestino: true,
        fotos: { orderBy: { ordem: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  let accountState =
    stored?.data && typeof stored.data === "object"
      ? (stored.data as StoreResponse)
      : null;
  if (accountState) {
    let migrated = false;
    if ("adminDemoCases" in accountState) {
      delete accountState.adminDemoCases;
      migrated = true;
    }
    if ("subscriptionActive" in accountState) {
      delete accountState.subscriptionActive;
      migrated = true;
    }
    if (
      accountState.driverRegistration &&
      typeof accountState.driverRegistration === "object" &&
      !Array.isArray(accountState.driverRegistration) &&
      "mode" in accountState.driverRegistration
    ) {
      delete (accountState.driverRegistration as Record<string, unknown>).mode;
      migrated = true;
    }
    if (Array.isArray(accountState.proposals))
      accountState.proposals = accountState.proposals.map((proposal) => {
        if (
          proposal &&
          typeof proposal === "object" &&
          ((proposal as Record<string, unknown>).driverId === "provider-current" ||
            (proposal as Record<string, unknown>).driverId === "demo-driver")
        ) {
          migrated = true;
          return { ...proposal, driverId: userId };
        }
        return proposal;
      });
    if (migrated)
      await prisma.appState.update({
        where: { userId },
        data: { data: JSON.parse(JSON.stringify(accountState)) },
      });
  }
  const freights = ownedFreights.map((freight) => ({
    id: freight.id,
    title: freight.titulo,
    description: freight.descricao ?? "",
    origin: approximateRegion(freight.enderecoOrigem),
    destination: approximateRegion(freight.enderecoDestino),
    vehicle:
      freight.categoriaPorte === "PEQUENO"
        ? "Caminhão pequeno"
        : freight.categoriaPorte === "MEDIO"
          ? "Caminhão médio"
          : "Caminhão grande",
    schedule: freight.dataColetaPrevista
      ? freight.dataEntregaPrevista
        ? {
            kind: "intervalo" as const,
            start: freight.dataColetaPrevista.toISOString(),
            end: freight.dataEntregaPrevista.toISOString(),
          }
        : {
            kind: "fixa" as const,
            start: freight.dataColetaPrevista.toISOString(),
          }
      : { kind: "combinar" as const },
    status:
      freight.statusFrete === "ABERTO"
        ? ("ABERTO" as const)
        : freight.statusFrete === "EM_TRANSPORTE"
          ? ("EM_TRANSPORTE" as const)
          : freight.statusFrete === "CONCLUIDO"
            ? ("CONCLUIDO" as const)
            : freight.statusFrete === "CANCELADO"
              ? ("CANCELADO" as const)
              : freight.statusFrete === "ACEITO"
                ? ("AGENDADO" as const)
                : ("ABERTO" as const),
    photos: freight.fotos.map((photo) => photo.url),
    reviews: {},
  }));

  return Response.json({
    ...accountState,
    profile: {
      id: userId,
      name:
        typeof accountState?.profile === "object" &&
        accountState.profile &&
        "name" in accountState.profile &&
        typeof accountState.profile.name === "string"
          ? accountState.profile.name
          : session.user.name,
      photo:
        typeof accountState?.profile === "object" &&
        accountState.profile &&
        "photo" in accountState.profile &&
        typeof accountState.profile.photo === "string"
          ? accountState.profile.photo
          : session.user.image ?? "",
    },
    proposals: Array.isArray(accountState?.proposals)
      ? accountState.proposals
      : [],
    messages: Array.isArray(accountState?.messages) ? accountState.messages : [],
    freights,
  });
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

function adminCase(userId: string, data: unknown): AdminCase | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const state = data as Record<string, unknown>;
  const registration = state.driverRegistration;
  if (!registration || typeof registration !== "object" || Array.isArray(registration))
    return null;
  const record = registration as Record<string, unknown>;
  const license = record.license;
  if (
    typeof record.fullName !== "string" ||
    !["EM_ANALISE", "APROVADO", "AJUSTES_SOLICITADOS"].includes(
      String(record.status),
    ) ||
    !license ||
    typeof license !== "object" ||
    Array.isArray(license)
  )
    return null;
  const licenseRecord = license as Record<string, unknown>;
  if (
    typeof licenseRecord.numberMasked !== "string" ||
    typeof licenseRecord.category !== "string" ||
    typeof licenseRecord.expiresOn !== "string"
  )
    return null;
  const { licensePhotoDataUrl: _licensePhotoDataUrl, ...safeRegistration } =
    record;
  return {
    id: userId,
    registration: safeRegistration as unknown as DriverRegistration,
    vehicles: Array.isArray(state.vehicles) ? (state.vehicles as Vehicle[]) : [],
  };
}

function registrationVersion(registration: DriverRegistration) {
  return [
    registration.submittedAt,
    registration.reviewedAt || "",
    registration.status,
  ].join("|");
}

async function adminRegistrations(request: NextRequest) {
  if (!adminTokenUsername(readAdminCookie(request.headers.get("cookie"))))
    return error("UNAUTHORIZED", "Faça login como administrador.", 401);
  const { prisma } = await import("@/server/db");
  const states = await prisma.appState.findMany({
    select: { userId: true, data: true },
  });
  const cases = states
    .map(({ userId, data }) => adminCase(userId, data))
    .filter((entry): entry is AdminCase => entry !== null);
  const reviews = states.flatMap(({ userId, data }) => {
    if (!data || typeof data !== "object" || Array.isArray(data)) return [];
    const history = (data as Record<string, unknown>).adminReviews;
    return Array.isArray(history) ? (history as AdminReview[]) : [];
  });
  return Response.json({ cases, reviews });
}

async function adminPrivateDocuments(request: NextRequest, userId: string) {
  if (!adminTokenUsername(readAdminCookie(request.headers.get("cookie"))))
    return error("UNAUTHORIZED", "Faça login como administrador.", 401);
  const { prisma } = await import("@/server/db");
  const row = await prisma.appState.findUnique({
    where: { userId },
    select: { data: true },
  });
  const state =
    row?.data && typeof row.data === "object" && !Array.isArray(row.data)
      ? (row.data as Record<string, unknown>)
      : {};
  const profile =
    state.profile && typeof state.profile === "object"
      ? (state.profile as Record<string, unknown>)
      : {};
  const registration =
    state.driverRegistration &&
    typeof state.driverRegistration === "object"
      ? (state.driverRegistration as Record<string, unknown>)
      : {};
  const safeImage = (value: unknown) =>
    typeof value === "string" &&
    value.length <= 7_000_000 &&
    /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(value)
      ? value
      : null;
  return Response.json({
    profilePhoto: safeImage(profile.photo),
    licensePhoto: safeImage(registration.licensePhotoDataUrl),
  });
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
  const input = body as Record<string, unknown>;
  const decision = input.decision;
  const reason = typeof input.reason === "string" ? input.reason.trim() : "";
  const checks = input.checks;
  const requiredChecks = [
    "Identificação e dados conferidos",
    "Foto do motorista conferida",
    "Habilitação e validade conferidas",
    "Veículo e habilitação compatíveis",
  ];
  const validChecks =
    Array.isArray(checks) &&
    checks.length === requiredChecks.length &&
    requiredChecks.every((check) => checks.includes(check));
  if (
    (decision !== "APROVADO" && decision !== "AJUSTES_SOLICITADOS") ||
    typeof input.expectedVersion !== "string" ||
    reason.length > 1000 ||
    (decision === "AJUSTES_SOLICITADOS" &&
      reason.length < 10) ||
    (decision === "APROVADO" && !validChecks)
  )
    return error("INVALID_BODY", "Confira a decisão e os dados informados.", 422);

  const { prisma } = await import("@/server/db");
  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const row = await tx.appState.findUnique({ where: { userId } });
        const state =
          row?.data && typeof row.data === "object" && !Array.isArray(row.data)
            ? (row.data as Record<string, unknown>)
            : null;
        const registration = state?.driverRegistration as
          | DriverRegistration
          | undefined;
        if (
          !state ||
          !registration ||
          registration.status !== "EM_ANALISE" ||
          registrationVersion(registration) !== input.expectedVersion
        )
          return null;

        const vehicles = Array.isArray(state.vehicles) ? state.vehicles : [];
        const profile =
          state.profile && typeof state.profile === "object"
            ? (state.profile as Record<string, unknown>)
            : {};
        const expiresOn =
          registration.license &&
          typeof registration.license.expiresOn === "string"
            ? registration.license.expiresOn
            : "";
        const todayInBahia = new Intl.DateTimeFormat("en-CA", {
          timeZone: "America/Bahia",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date());
        const validExpiry =
          /^\d{4}-\d{2}-\d{2}$/.test(expiresOn) &&
          !Number.isNaN(Date.parse(`${expiresOn}T00:00:00Z`)) &&
          new Date(`${expiresOn}T00:00:00Z`).toISOString().slice(0, 10) ===
            expiresOn;
        if (
          decision === "APROVADO" &&
          (!registration.documentsSubmitted ||
            !validExpiry ||
            expiresOn < todayInBahia ||
            vehicles.length === 0 ||
            typeof profile.photo !== "string" ||
            profile.photo.length === 0 ||
            typeof registration.licensePhotoDataUrl !== "string" ||
            !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(
              registration.licensePhotoDataUrl,
            ))
        )
          return { invalid: true as const };

        const at = new Date().toISOString();
        const updatedRegistration: DriverRegistration = {
          ...registration,
          status: decision,
          reviewedAt: at,
          feedback: decision === "AJUSTES_SOLICITADOS" ? reason : undefined,
        };
        const review: AdminReview = {
          id: randomUUID(),
          caseId: userId,
          version: input.expectedVersion,
          actor,
          at,
          decision,
          reason,
        };
        const updated = {
          ...state,
          driverRegistration: updatedRegistration,
          adminReviews: [
            ...(Array.isArray(state.adminReviews)
              ? (state.adminReviews as AdminReview[])
              : []),
            review,
          ],
        };
        await tx.appState.update({
          where: { userId },
          data: { data: JSON.parse(JSON.stringify(updated)) },
        });
        const reviewedCase = adminCase(userId, updated);
        return reviewedCase ? { reviewedCase, review } : null;
      },
      { isolationLevel: "Serializable" },
    );
    if (!result)
      return error(
        "REGISTRATION_CHANGED",
        "Este cadastro mudou ou já foi analisado. Atualize a lista antes de decidir.",
        409,
      );
    if ("invalid" in result)
      return error(
        "REGISTRATION_INCOMPLETE",
        "Não é possível aprovar: confira os dados, documentação, foto e veículo.",
        422,
      );
    return Response.json(result);
  } catch (failure) {
    if (
      failure &&
      typeof failure === "object" &&
      "code" in failure &&
      failure.code === "P2034"
    )
      return error(
        "REGISTRATION_CHANGED",
        "Este cadastro mudou. Atualize a lista antes de decidir.",
        409,
      );
    throw failure;
  }
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

  const freight = await prisma.$transaction(async (tx) => {
    const cliente = await tx.cliente.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id },
      update: {},
    });
    const [pickupAddressRow, deliveryAddressRow] = await Promise.all([
      tx.endereco.create({ data: pickupData }),
      tx.endereco.create({ data: deliveryData }),
    ]);
    return tx.frete.create({
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
  const freight = await prisma.frete.findUnique({
    where: { id: freightId },
  });
  if (!freight) return error("FREIGHT_NOT_FOUND", "Solicitação não encontrada.", 404);
  if (freight.statusFrete !== "ABERTO") {
    return error("FREIGHT_CLOSED", "Esta solicitação não está mais aberta.", 409);
  }

  const stored = await prisma.appState.findUnique({
    where: { userId: session.user.id },
  });
  const accountState =
    stored?.data && typeof stored.data === "object"
      ? (stored.data as StoreResponse)
      : null;
  const proposals = Array.isArray(accountState?.proposals)
    ? (accountState!.proposals as Record<string, unknown>[])
    : [];
  if (
    proposals.some(
      (proposal) =>
        proposal.freightId === freightId &&
        proposal.driverId === session.user.id,
    )
  ) {
    return error(
      "PROPOSAL_EXISTS",
      "Você já enviou uma proposta para esta solicitação.",
      409,
    );
  }

  const vehicles = Array.isArray(accountState?.vehicles)
    ? (accountState!.vehicles as Record<string, unknown>[])
    : [];
  const vehicle = vehicles.find((item) => item.id === vehicleId);
  if (!vehicle) {
    return error("VEHICLE_NOT_FOUND", "Selecione um veículo cadastrado.", 422);
  }

  const vehicleLabel =
    [text(vehicle.category, 80), text(vehicle.model, 80)]
      .filter(Boolean)
      .join(" · ") || "Veículo selecionado";
  const offer = {
    id: crypto.randomUUID(),
    vehicleId,
    vehicle: vehicleLabel,
    priceCents,
    availableAt: availability.toISOString(),
    message,
    createdAt: new Date().toISOString(),
    status: "PENDENTE",
  };
  const proposal = {
    freightId,
    driverId: session.user.id,
    driver: session.user.name,
    rating: 0,
    providerName: session.user.name,
    providerKind: "autonomo",
    ...offer,
    status: "PENDENTE",
    offers: [offer],
  };
  const proposalId = crypto.randomUUID();
  const savedProposal = { ...proposal, id: proposalId };

  const persistence = await prisma.$transaction(async (tx) => {
    const driverStateRow = await tx.appState.findUnique({
      where: { userId: session.user.id },
    });
    const driverState =
      driverStateRow?.data && typeof driverStateRow.data === "object"
        ? (driverStateRow.data as StoreResponse)
        : null;
    let motorista = await tx.motorista.findUnique({
      where: { userId: session.user.id },
      select: { userId: true },
    });
    if (!motorista) {
      if (process.env.NODE_ENV === "production") {
        return { error: "DRIVER_NOT_REGISTERED" as const };
      }
      const registration =
        driverState?.driverRegistration &&
        typeof driverState.driverRegistration === "object"
          ? (driverState.driverRegistration as Record<string, unknown>)
          : null;
      const license =
        registration?.license && typeof registration.license === "object"
          ? (registration.license as Record<string, unknown>)
          : null;
      const expiresOn = text(license?.expiresOn, 10);
      const expiresAt = new Date(`${expiresOn}T00:00:00.000Z`);
      const category = text(license?.category, 10);
      if (
        registration?.status !== "APROVADO" ||
        !category ||
        !Number.isFinite(expiresAt.getTime()) ||
        expiresAt.getTime() + 86400000 <= Date.now()
      ) {
        return { error: "DRIVER_NOT_REGISTERED" as const };
      }
      // Link proposals using the authenticated account, never masked registration data.
      motorista = await tx.motorista.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          cnhNumero: `DEMO-${session.user.id}`,
          cnhCategoria: category,
          cnhValidade: expiresAt,
        },
        update: {},
        select: { userId: true },
      });
    }

    const existing = await tx.proposta.findUnique({
      where: {
        freteId_motoristaId: {
          freteId: freightId,
          motoristaId: session.user.id,
        },
      },
      select: { id: true },
    });
    if (existing) return { error: "PROPOSAL_EXISTS" as const };

    await tx.proposta.create({
      data: {
        id: savedProposal.id,
        freteId: freightId,
        motoristaId: session.user.id,
        valorProposto: (priceCents / 100).toFixed(2),
        mensagem: message,
        statusProposta: "PENDENTE",
      },
    });

    const userIds = [...new Set([session.user.id, freight.clienteId])];
    for (const userId of userIds) {
      const current = await tx.appState.findUnique({ where: { userId } });
      const currentState =
        current?.data && typeof current.data === "object"
          ? (current.data as StoreResponse)
          : null;
      const currentProposals = Array.isArray(currentState?.proposals)
        ? currentState.proposals
        : [];
      const state = JSON.parse(
        JSON.stringify({
          ...(currentState ?? {}),
          freights: Array.isArray(currentState?.freights)
            ? currentState.freights
            : [],
          messages: Array.isArray(currentState?.messages)
            ? currentState.messages
            : [],
          proposals: [
            ...currentProposals.filter(
              (item) =>
                !item ||
                typeof item !== "object" ||
                !("id" in item) ||
                item.id !== savedProposal.id,
            ),
            savedProposal,
          ],
        }),
      );
      await tx.appState.upsert({
        where: { userId },
        create: { userId, data: state },
        update: { data: state },
      });
    }
    return { proposalId: savedProposal.id };
  });
  if ("error" in persistence && persistence.error === "DRIVER_NOT_REGISTERED") {
    return error(
      "DRIVER_NOT_REGISTERED",
      "O cadastro de motorista ainda não está vinculado ao banco de dados.",
      409,
    );
  }
  if ("error" in persistence && persistence.error === "PROPOSAL_EXISTS") {
    return error(
      "PROPOSAL_EXISTS",
      "Você já enviou uma proposta para esta solicitação.",
      409,
    );
  }

  return Response.json({ proposal: savedProposal }, { status: 201 });
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
