import { randomUUID } from "node:crypto";
import { adminReviewChecks, isCorrectionItem } from "@/contracts/driver-corrections";
import type {
  Address,
  AdminCase,
  AdminReview,
  DriverRegistration,
  Freight,
  OperatingArea,
  Proposal,
  ProposalOffer,
  Role,
  SavedAddress,
  Store,
  Vehicle,
} from "@/contracts";
import { Prisma, type PrismaClient } from "@/server/generated/prisma/client";

type Transaction = Prisma.TransactionClient;
type Database = PrismaClient | Transaction;
type RecordValue = Record<string, unknown>;

export class StorePersistenceError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function record(value: unknown): RecordValue | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as RecordValue)
    : null;
}

function string(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function parseOperatingArea(value: unknown): OperatingArea {
  const area = record(value);
  const center = record(area?.center);
  const lat = center?.lat;
  const lng = center?.lng;
  const radiusKm = area?.radiusKm;
  if (
    typeof lat !== "number" ||
    !Number.isFinite(lat) ||
    lat < -90 ||
    lat > 90 ||
    typeof lng !== "number" ||
    !Number.isFinite(lng) ||
    lng < -180 ||
    lng > 180 ||
    typeof radiusKm !== "number" ||
    !Number.isFinite(radiusKm) ||
    radiusKm <= 0 ||
    radiusKm > 1000
  )
    throw new StorePersistenceError(
      "INVALID_AREA",
      "A região de atendimento informada é inválida.",
      422,
    );
  return {
    center: { lat, lng },
    radiusKm,
    label: string(area?.label, 160),
  };
}

function categoryFromPorte(value: string) {
  if (value === "PEQUENO") return "Caminhão pequeno";
  if (value === "MEDIO") return "Caminhão médio";
  return "Caminhão grande";
}

function porteFromCategory(value: unknown): "PEQUENO" | "MEDIO" | "GRANDE" {
  if (value === "Utilitário" || value === "Caminhão pequeno") return "PEQUENO";
  if (value === "Caminhão médio") return "MEDIO";
  if (value === "Caminhão grande") return "GRANDE";
  throw new StorePersistenceError(
    "INVALID_VEHICLE",
    "A categoria do veículo é inválida.",
    422,
  );
}

function moneyToCents(value: Prisma.Decimal | number) {
  return Math.round(Number(value) * 100);
}

function offerStatus(value: string): ProposalOffer["status"] {
  if (
    value === "ACEITA" ||
    value === "RECUSADA" ||
    value === "SUBSTITUIDA" ||
    value === "ENCERRADA"
  )
    return value;
  return "PENDENTE";
}

function proposalStatus(value: string): Proposal["status"] {
  if (value === "ACEITA") return "ACEITA";
  if (value === "PENDENTE") return "PENDENTE";
  return "ENCERRADA";
}

function freightStatus(
  value: string,
): Freight["status"] {
  if (value === "ACEITO" || value === "AGENDADO") return "AGENDADO";
  if (
    value === "EM_TRANSPORTE" ||
    value === "CONCLUIDO" ||
    value === "CANCELADO"
  )
    return value;
  return "ABERTO";
}

function toAddress(
  address: {
    logradouro: string;
    numero: string | null;
    complemento: string | null;
    bairro: string | null;
    cidade: string;
    estado: string;
    cep: string;
    latitude: Prisma.Decimal | null;
    longitude: Prisma.Decimal | null;
  },
): Address {
  return {
    label: "",
    street: address.logradouro,
    number: address.numero ?? "",
    complement: address.complemento ?? "",
    neighborhood: address.bairro ?? "",
    city: address.cidade,
    state: address.estado,
    postalCode: address.cep,
    point:
      address.latitude == null || address.longitude == null
        ? null
        : {
            lat: Number(address.latitude),
            lng: Number(address.longitude),
          },
  };
}

function savedAddressFromRow(address: {
  id: string;
  label: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string | null;
  latitude: Prisma.Decimal | null;
  longitude: Prisma.Decimal | null;
}): SavedAddress {
  return {
    id: address.id,
    label: address.label,
    street: address.logradouro,
    number: address.numero,
    complement: address.complemento,
    neighborhood: address.bairro,
    city: address.cidade,
    state: address.estado,
    postalCode: address.cep ?? undefined,
    point:
      address.latitude == null || address.longitude == null
        ? null
        : {
            lat: Number(address.latitude),
            lng: Number(address.longitude),
          },
  };
}

function vehicleFromRow(vehicle: {
  id: string;
  categoria_porte: "PEQUENO" | "MEDIO" | "GRANDE";
  modelo: string;
  placa: string;
  capacidade_kg: number | null;
  descricao: string;
}): Vehicle {
  return {
    id: vehicle.id,
    category: categoryFromPorte(vehicle.categoria_porte),
    model: vehicle.modelo,
    plate: vehicle.placa,
    capacityKg:
      vehicle.capacidade_kg == null ? undefined : Number(vehicle.capacidade_kg),
    description: vehicle.descricao,
  };
}

function registrationFromRow(
  driver: {
    cadastro_status: string | null;
    nome_completo: string | null;
    tipo_pessoa: string | null;
    documento_mascarado: string | null;
    cnpj_mascarado: string | null;
    nome_empresa: string | null;
    cnh_numero_mascarado: string | null;
    cnh_categoria: string | null;
    cnh_validade: Date | null;
    cnh_foto_data_url: string | null;
    documentos_enviados: boolean;
    enviado_em: Date | null;
    revisado_em: Date | null;
    feedback: string | null;
    itens_ajuste: string[];
  }): DriverRegistration | undefined {
  if (
    !driver.cadastro_status ||
    !driver.nome_completo ||
    !driver.cnh_numero_mascarado ||
    !driver.cnh_categoria ||
    !driver.cnh_validade ||
    !driver.enviado_em
  )
    return undefined;
  const expiresOn = driver.cnh_validade.toISOString().slice(0, 10);
  return {
    status:
      driver.cadastro_status === "APROVADO"
        ? "APROVADO"
        : driver.cadastro_status === "AJUSTES_SOLICITADOS"
          ? "AJUSTES_SOLICITADOS"
          : "EM_ANALISE",
    fullName: driver.nome_completo,
    personType: driver.tipo_pessoa === "pj" ? "pj" : "pf",
    cpfMasked: driver.documento_mascarado ?? "",
    ...(driver.cnpj_mascarado ? { cnpjMasked: driver.cnpj_mascarado } : {}),
    ...(driver.nome_empresa ? { companyName: driver.nome_empresa } : {}),
    license: {
      numberMasked: driver.cnh_numero_mascarado,
      category: driver.cnh_categoria,
      expiresOn,
    },
    ...(driver.cnh_foto_data_url
      ? { licensePhotoDataUrl: driver.cnh_foto_data_url }
      : {}),
    documentsSubmitted: driver.documentos_enviados,
    submittedAt: driver.enviado_em.toISOString(),
    ...(driver.revisado_em
      ? { reviewedAt: driver.revisado_em.toISOString() }
      : {}),
    ...(driver.feedback ? { feedback: driver.feedback } : {}),
    ...(driver.cadastro_status === "AJUSTES_SOLICITADOS"
      ? { correctionItems: driver.itens_ajuste.filter(isCorrectionItem) }
      : {}),
  };
}

function proposalFromRow(proposal: {
  id: string;
  frete_id: string;
  motorista_id: string;
  valor_proposto: Prisma.Decimal;
  status_proposta: string;
  frete: {
    titulo: string;
    status_frete_enum: string;
    cliente: { user: { name: string } };
  };
  motorista: {
    avaliacao_media: Prisma.Decimal;
    user: {
      name: string;
      perfis_empresa: {
        tradeName: string;
        logo: string;
      } | null;
    };
  };
  ofertas: {
    id: string;
    veiculoId: string | null;
    veiculoLabel: string;
    valorCentavos: number;
    disponivelEm: Date;
    mensagem: string;
    status: string;
    createdAt: Date;
  }[];
}): Proposal {
  const offers: ProposalOffer[] = proposal.ofertas.map((offer) => ({
    id: offer.id,
    ...(offer.veiculoId ? { vehicleId: offer.veiculoId } : {}),
    vehicle: offer.veiculoLabel,
    priceCents: offer.valorCentavos,
    availableAt: offer.disponivelEm.toISOString(),
    message: offer.mensagem,
    createdAt: offer.createdAt.toISOString(),
    status: offerStatus(offer.status),
  }));
  const latest = offers.at(-1);
  const company = proposal.motorista.user.perfis_empresa;
  return {
    id: proposal.id,
    freightId: proposal.frete_id,
    conversation: {
      title: proposal.frete.titulo,
      clientName: proposal.frete.cliente.user.name,
      freightStatus: freightStatus(proposal.frete.status_frete_enum),
    },
    driverId: proposal.motorista_id,
    driver: proposal.motorista.user.name,
    rating: Number(proposal.motorista.avaliacao_media),
    ...(company
      ? {
          providerKind: "empresa" as const,
          providerName: company.tradeName,
          providerLogo: company.logo,
        }
      : {
          providerKind: "autonomo" as const,
          providerName: proposal.motorista.user.name,
        }),
    ...(latest?.vehicleId ? { vehicleId: latest.vehicleId } : {}),
    vehicle: latest?.vehicle ?? "Veículo cadastrado",
    priceCents: latest?.priceCents ?? moneyToCents(proposal.valor_proposto),
    availableAt: latest?.availableAt ?? "",
    message: latest?.message ?? "",
    status: proposalStatus(proposal.status_proposta),
    offers,
  };
}

export async function loadAccountStore(
  database: Database,
  userId: string,
): Promise<Store> {
  const [
    user,
    freightRows,
    proposalRows,
    messageRows,
  ] = await Promise.all([
    database.user.findUnique({
      where: { id: userId },
      include: {
        cliente: true,
        motorista: { include: { veiculo: { where: { ativo: true } } } },
        perfis_empresa: true,
        areas_atuacao: true,
        endereco_salvos: { orderBy: { criado_em: "asc" } },
        notificacoes: { orderBy: { createdAt: "desc" } },
      },
    }),
    database.frete.findMany({
      where: {
        OR: [{ cliente_id: userId }, { motorista_selecionado_id: userId }],
      },
      include: {
        cliente: { include: { user: true } },
        endereco_frete_endereco_origem_idToendereco: true,
        endereco_frete_endereco_destino_idToendereco: true,
        frete_foto: { orderBy: { ordem: "asc" } },
        avaliacao: true,
        acordo: true,
      },
      orderBy: { criado_em: "desc" },
    }),
    database.proposta.findMany({
      where: {
        OR: [{ motorista_id: userId }, { frete: { cliente_id: userId } }],
      },
      include: {
        motorista: {
          include: { user: { include: { perfis_empresa: true } } },
        },
        frete: {
          select: {
            titulo: true,
            status_frete_enum: true,
            cliente: { select: { user: { select: { name: true } } } },
          },
        },
        ofertas: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { criado_em: "asc" },
    }),
    database.mensagem.findMany({
      where: { OR: [{ remetente_id: userId }, { destinatario_id: userId }] },
      orderBy: { criado_em: "asc" },
    }),
  ]);
  if (!user)
    throw new StorePersistenceError(
      "USER_NOT_FOUND",
      "A conta autenticada não foi encontrada.",
      404,
    );

  const freights: Freight[] = [];
  const freightAddresses: NonNullable<Store["freightAddresses"]> = {};
  for (const freight of freightRows) {
    const originAddress = freight.endereco_frete_endereco_origem_idToendereco;
    const destinationAddress = freight.endereco_frete_endereco_destino_idToendereco;
    if (!originAddress || !destinationAddress) continue;
    const agreement = freight.acordo;
    const reviews: Freight["reviews"] = {};
    const reviewComments: NonNullable<Freight["reviewComments"]> = {};
    const reviewPublicComments: NonNullable<
      Freight["reviewPublicComments"]
    > = {};
    const reviewDates: NonNullable<Freight["reviewDates"]> = {};
    for (const review of freight.avaliacao) {
      const role = review.perfil_avaliador as Role;
      if (role !== "cliente" && role !== "motorista") continue;
      reviews[role] = review.nota;
      reviewComments[role] = review.comentario ?? "";
      reviewPublicComments[role] = review.publica;
      reviewDates[role] = review.criado_em.toISOString();
    }

    freights.push({
      id: freight.id,
      clientName: freight.cliente.user.name,
      title: freight.titulo,
      description: freight.descricao ?? "",
      origin: approximateRegion(originAddress),
      destination: approximateRegion(destinationAddress),
      vehicle: categoryFromPorte(freight.categoria_porte),
      schedule: freight.data_coleta_prevista
        ? freight.data_entrega_prevista
          ? {
              kind: "intervalo",
              start: freight.data_coleta_prevista.toISOString(),
              end: freight.data_entrega_prevista.toISOString(),
            }
          : {
              kind: "fixa",
              start: freight.data_coleta_prevista.toISOString(),
            }
        : { kind: "combinar" },
      status: freightStatus(freight.status_frete_enum),
      photos: freight.frete_foto.map((photo) => photo.url),
      ...(agreement
        ? {
            acceptedProposalId: agreement.propostaId,
            agreement: {
              proposalId: agreement.propostaId,
              offerId: agreement.ofertaId,
              driver: agreement.nomeMotorista,
              driverId: agreement.motoristaId,
              ...(agreement.nomePrestador
                ? { providerName: agreement.nomePrestador }
                : {}),
              ...(agreement.tipoPrestador === "empresa" ||
              agreement.tipoPrestador === "autonomo"
                ? { providerKind: agreement.tipoPrestador }
                : {}),
              priceCents: agreement.valorCentavos,
              vehicle: agreement.veiculo,
              availableAt: agreement.disponivelEm.toISOString(),
              message: agreement.mensagem,
              acceptedAt: agreement.aceitoEm.toISOString(),
            },
          }
        : {}),
      reviews,
      ...(Object.keys(reviewComments).length ? { reviewComments } : {}),
      ...(Object.keys(reviewPublicComments).length
        ? { reviewPublicComments }
        : {}),
      ...(Object.keys(reviewDates).length ? { reviewDates } : {}),
    });

    if (
      freight.cliente_id === userId ||
      freight.motorista_selecionado_id === userId
    ) {
      freightAddresses[freight.id] = {
        pickup: toAddress(originAddress),
        delivery: toAddress(destinationAddress),
      };
    }
  }

  const proposals = proposalRows
    .filter(
      (
        proposal,
      ): proposal is typeof proposal & { valor_proposto: Prisma.Decimal } =>
        proposal.valor_proposto !== null,
    )
    .map(proposalFromRow);
  const registration = user.motorista
    ? registrationFromRow(user.motorista)
    : undefined;
  return {
    accountSetupComplete: user.accountSetupComplete,
    roles: {
      cliente: Boolean(user.cliente),
      motorista: Boolean(user.motorista),
    },
    profile: { id: user.id, name: user.name, photo: user.image ?? "" },
    ...(registration ? { driverRegistration: registration } : {}),
    vehicles: user.motorista?.veiculo.map(vehicleFromRow) ?? [],
    ...(user.perfis_empresa
      ? {
          perfis_empresa: {
            tradeName: user.perfis_empresa.tradeName,
            logo: user.perfis_empresa.logo,
            about: user.perfis_empresa.about,
            city: user.perfis_empresa.city,
          },
        }
      : {}),
    ...(user.areas_atuacao
      ? {
          operatingArea: {
            center: {
              lat: Number(user.areas_atuacao.latitude),
              lng: Number(user.areas_atuacao.longitude),
            },
            radiusKm: Number(user.areas_atuacao.radiusKm),
            label: user.areas_atuacao.label,
          },
        }
      : {}),
    addresses: user.endereco_salvos.map(savedAddressFromRow),
    notifications: user.notificacoes.map((notification) => ({
      id: notification.id,
      role: notification.role as Role,
      title: notification.title,
      body: notification.body,
      createdAt: notification.createdAt.toISOString(),
      read: notification.read,
      freightId: notification.freightId,
      ...(notification.proposalId
        ? { proposalId: notification.proposalId }
        : {}),
    })),
    freightAddresses,
    freights,
    proposals,
    messages: messageRows.map((message) => ({
      id: message.id,
      mine: message.remetente_id === userId,
      freightId: message.frete_id,
      proposalId: message.proposta_id ?? "",
      role: message.perfil_remetente as Role,
      text: message.conteudo,
      createdAt: message.criado_em.toISOString(),
    })),
  };
}

function approximateRegion(address: {
  bairro: string | null;
  cidade: string;
  estado: string;
}) {
  return [address.bairro, address.cidade, address.estado]
    .filter((value, index, values) => Boolean(value) && values.indexOf(value) === index)
    .join(", ");
}

function parseCoordinates(address: RecordValue) {
  const point = record(address.point);
  const latitude = point?.lat;
  const longitude = point?.lng;
  if (
    typeof latitude !== "number" ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    typeof longitude !== "number" ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  )
    throw new StorePersistenceError(
      "INVALID_ADDRESS",
      "Informe um endereço com ponto de localização válido.",
      422,
    );
  return { latitude, longitude };
}

function parseSavedAddress(value: unknown) {
  const address = record(value);
  if (!address)
    throw new StorePersistenceError(
      "INVALID_ADDRESS",
      "Um dos endereços informados é inválido.",
      422,
    );
  const city = string(address.city, 120);
  const state = string(address.state, 2).toUpperCase();
  const street = string(address.street, 200);
  if (!city || state.length !== 2 || !street)
    throw new StorePersistenceError(
      "INVALID_ADDRESS",
      "Informe rua, cidade e estado para salvar o endereço.",
      422,
    );
  return {
    id: string(address.id, 120),
    label: string(address.label, 80),
    logradouro: street,
    numero: string(address.number, 20),
    complemento: string(address.complement, 200),
    bairro: string(address.neighborhood, 120),
    cidade: city,
    estado: state,
    cep: string(address.postalCode, 20) || null,
    ...parseCoordinates(address),
  };
}

function parseRegistration(value: unknown) {
  const registration = record(value);
  const license = record(registration?.license);
  if (!registration || !license)
    throw new StorePersistenceError(
      "INVALID_REGISTRATION",
      "Os dados do cadastro do motorista são inválidos.",
      422,
    );
  const fullName = string(registration.fullName, 120);
  const personType = registration.personType;
  const numberMasked = string(license.numberMasked, 40);
  const category = string(license.category, 10);
  const expiresOn = string(license.expiresOn, 10);
  const submittedAt = string(registration.submittedAt, 40);
  const submittedDate = new Date(submittedAt);
  const expiryDate = new Date(`${expiresOn}T00:00:00.000Z`);
  const photo = registration.licensePhotoDataUrl;
  const cpfMasked = string(registration.cpfMasked, 30);
  const cnpjMasked = string(registration.cnpjMasked, 30);
  const companyName = string(registration.companyName, 160);
  if (
    !fullName ||
    (personType !== "pf" && personType !== "pj") ||
    !/^\*{3}\.\*{3}\.\*{3}-\d{2}$/.test(cpfMasked) ||
    (personType === "pj" &&
      (!/^\*\*\.\*{3}\.\*{3}\/\*{4}-\d{2}$/.test(cnpjMasked) ||
        !companyName)) ||
    !numberMasked ||
    !/^\*{9}\d{2}$/.test(numberMasked) ||
    !category ||
    !/^\d{4}-\d{2}-\d{2}$/.test(expiresOn) ||
    !Number.isFinite(expiryDate.getTime()) ||
    expiryDate.toISOString().slice(0, 10) !== expiresOn ||
    !Number.isFinite(submittedDate.getTime()) ||
    (photo !== undefined &&
      (typeof photo !== "string" ||
        photo.length > 7_000_000 ||
        !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(photo)))
  )
    throw new StorePersistenceError(
      "INVALID_REGISTRATION",
      "Confira os dados e documentos do cadastro.",
      422,
    );
  return {
    cadastro_status: "EM_ANALISE",
    nome_completo: fullName,
    tipo_pessoa: personType,
    documento_mascarado: cpfMasked,
    cnpj_mascarado: cnpjMasked || null,
    nome_empresa: companyName || null,
    cnh_numero_mascarado: numberMasked,
    cnh_categoria: category,
    cnh_validade: expiryDate,
    cnh_foto_data_url: typeof photo === "string" ? photo : null,
    documentos_enviados: registration.documentsSubmitted === true,
    enviado_em: submittedDate,
    revisado_em: null,
    feedback: null,
    itens_ajuste: [],
  };
}

function parseVehicle(value: unknown) {
  const vehicle = record(value);
  if (!vehicle)
    throw new StorePersistenceError(
      "INVALID_VEHICLE",
      "Um dos veículos informados é inválido.",
      422,
    );
  const id = string(vehicle.id, 120);
  const model = string(vehicle.model, 80);
  const plate = string(vehicle.plate, 8).toUpperCase();
  const description = string(vehicle.description, 600);
  const capacityKg =
    typeof vehicle.capacityKg === "number" &&
    Number.isFinite(vehicle.capacityKg) &&
    vehicle.capacityKg > 0
      ? vehicle.capacityKg
      : null;
  const hasCapacity = vehicle.capacityKg !== undefined;
  if (
    !id ||
    !model ||
    !/^[A-Z0-9]{7}$/.test(plate) ||
    (hasCapacity &&
      (typeof vehicle.capacityKg !== "number" ||
        !Number.isFinite(vehicle.capacityKg) ||
        vehicle.capacityKg <= 0 ||
        vehicle.capacityKg > 100_000)))
    throw new StorePersistenceError(
      "INVALID_VEHICLE",
      "Informe modelo e placa válidos para cada veículo.",
      422,
    );
  return {
    id,
    categoria: string(vehicle.category, 80),
    modelo: model,
    placa: plate,
    categoria_porte: porteFromCategory(vehicle.category),
    capacidade_kg: capacityKg,
    descricao: description,
  };
}

async function saveAddresses(
  tx: Transaction,
  userId: string,
  values: unknown[],
) {
  if (values.length > 50)
    throw new StorePersistenceError(
      "INVALID_ADDRESS",
      "O limite é de 50 endereços salvos.",
      422,
    );
  const addresses = values.map(parseSavedAddress);
  const ids = new Set<string>();
  for (const address of addresses) {
    if (ids.has(address.id))
      throw new StorePersistenceError(
        "INVALID_ADDRESS",
        "Há endereços repetidos na solicitação.",
        422,
      );
    ids.add(address.id);
    const existing = await tx.endereco_salvos.findUnique({
      where: { id: address.id },
      select: { user_id: true },
    });
    if (existing && existing.user_id !== userId)
      throw new StorePersistenceError(
        "FORBIDDEN",
        "Não é permitido alterar endereços de outra conta.",
        403,
      );
    await tx.endereco_salvos.upsert({
      where: { id: address.id },
      create: { ...address, user_id: userId, atualizado_em: new Date() },
      update: {
        label: address.label,
        logradouro: address.logradouro,
        numero: address.numero,
        complemento: address.complemento,
        bairro: address.bairro,
        cidade: address.cidade,
        estado: address.estado,
        cep: address.cep,
        latitude: address.latitude,
        longitude: address.longitude,
        atualizado_em: new Date(),
      },
    });
  }
  await tx.endereco_salvos.deleteMany({
    where: { user_id: userId, ...(ids.size ? { id: { notIn: [...ids] } } : {}) },
  });
}

async function saveVehicles(
  tx: Transaction,
  userId: string,
  values: unknown[],
) {
  if (values.length > 30)
    throw new StorePersistenceError(
      "INVALID_VEHICLE",
      "O limite é de 30 veículos cadastrados.",
      422,
    );
  if (!values.length) {
    await tx.veiculo.deleteMany({ where: { motorista_id: userId } });
    return;
  }
  const vehicles = values.map(parseVehicle);
  const ids = new Set<string>();
  for (const vehicle of vehicles) {
    if (ids.has(vehicle.id))
      throw new StorePersistenceError(
        "INVALID_VEHICLE",
        "Há veículos repetidos na solicitação.",
        422,
      );
    ids.add(vehicle.id);
    const existing = await tx.veiculo.findUnique({
      where: { id: vehicle.id },
      select: { motorista_id: true },
    });
    if (existing && existing.motorista_id !== userId)
      throw new StorePersistenceError(
        "FORBIDDEN",
        "Não é permitido alterar veículos de outra conta.",
        403,
      );
    await tx.veiculo.upsert({
      where: { id: vehicle.id },
      create: {
        ...vehicle,
        motorista_id: userId,
        atualizado_em: new Date(),
      },
      update: vehicle,
    });
  }
  await tx.veiculo.deleteMany({
    where: { motorista_id: userId, id: { notIn: [...ids] } },
  });
}

async function saveDriverRegistration(
  tx: Transaction,
  userId: string,
  incoming: unknown,
  documentNumbers: unknown,
) {
  if (incoming === undefined) return;
  const submitted = parseRegistration(incoming);
  const existing = await tx.motorista.findUnique({
    where: { user_id: userId },
    select: { cadastro_status: true, enviado_em: true },
  });
  if (existing?.enviado_em?.getTime() === submitted.enviado_em.getTime())
    return;
  const numbers = record(documentNumbers);
  const cpf = numbers?.cpf;
  const cnh = numbers?.cnh;
  const cnpj = numbers?.cnpj;
  if (
    documentNumbers !== undefined &&
    (typeof cpf !== "string" ||
      !/^\d{11}$/.test(cpf) ||
      !submitted.documento_mascarado.endsWith(cpf.slice(-2)) ||
      typeof cnh !== "string" ||
      !/^\d{11}$/.test(cnh) ||
      !submitted.cnh_numero_mascarado.endsWith(cnh.slice(-2)) ||
      (submitted.tipo_pessoa === "pj"
        ? typeof cnpj !== "string" ||
          !/^\d{14}$/.test(cnpj) ||
          !submitted.cnpj_mascarado?.endsWith(cnpj.slice(-2))
        : cnpj !== undefined))
  )
    throw new StorePersistenceError(
      "INVALID_REGISTRATION",
      "Confira os números dos documentos informados.",
      422,
    );
  const privateNumbers =
    typeof cpf === "string" && typeof cnh === "string"
      ? { cpf, cnh, ...(typeof cnpj === "string" ? { cnpj } : {}) }
      : Prisma.DbNull;
  await tx.motorista.upsert({
    where: { user_id: userId },
    create: {
      user_id: userId,
      codigo_publico: randomUUID(),
      atualizado_em: new Date(),
      ...submitted,
      numeros_documentos: privateNumbers,
    },
    update: { ...submitted, numeros_documentos: privateNumbers },
  });
}

async function saveProposals(
  tx: Transaction,
  userId: string,
  values: unknown[],
) {
  for (const item of values) {
    const input = record(item);
    if (!input || typeof input.id !== "string") continue;
    const proposal = await tx.proposta.findUnique({
      where: { id: input.id },
      include: { frete: true, ofertas: { orderBy: { createdAt: "asc" } } },
    });
    if (!proposal) continue;

    if (proposal.motorista_id === userId) {
      const offers = Array.isArray(input.offers)
        ? input.offers.map((offer) => record(offer)).filter(Boolean)
        : [];
      const latest = offers.at(-1);
      if (!latest || proposal.ofertas.some((offer) => offer.id === latest.id))
        continue;
      if (
        (proposal.status_proposta !== "PENDENTE" &&
          proposal.status_proposta !== "REJEITADA") ||
        proposal.frete.status_frete_enum !== "ABERTO"
      )
        throw new StorePersistenceError(
          "PROPOSAL_CLOSED",
          "Não é possível alterar uma proposta encerrada.",
          409,
        );
      const priceCents =
        typeof latest.priceCents === "number" ? latest.priceCents : NaN;
      const availableAt =
        typeof latest.availableAt === "string"
          ? new Date(latest.availableAt)
          : new Date(Number.NaN);
      const vehicleId = string(latest.vehicleId, 120);
      const message = string(latest.message, 2000);
      const vehicle = await tx.veiculo.findFirst({
        where: { id: vehicleId, motorista_id: userId, ativo: true },
      });
      if (
        !Number.isSafeInteger(priceCents) ||
        priceCents <= 0 ||
        priceCents > 100_000_000 ||
        !Number.isFinite(availableAt.getTime()) ||
        availableAt.getTime() <= Date.now() ||
        !vehicle
      )
        throw new StorePersistenceError(
          "INVALID_PROPOSAL",
          "Informe valor, veículo e disponibilidade válidos.",
          422,
        );
      const offerId = string(latest.id, 120);
      if (!offerId)
        throw new StorePersistenceError(
          "INVALID_PROPOSAL",
          "A oferta não tem um identificador válido.",
          422,
        );
      const label = `${categoryFromPorte(vehicle.categoria_porte)} · ${vehicle.modelo}`;
      await tx.ofertaProposta.updateMany({
        where: { propostaId: proposal.id, status: "PENDENTE" },
        data: { status: "SUBSTITUIDA" },
      });
      await tx.ofertaProposta.create({
        data: {
          id: offerId,
          propostaId: proposal.id,
          veiculoId: vehicle.id,
          veiculoLabel: label,
          valorCentavos: priceCents,
          disponivelEm: availableAt,
          mensagem: message,
          status: "PENDENTE",
        },
      });
      await tx.proposta.update({
        where: { id: proposal.id },
        data: {
          valor_proposto: (priceCents / 100).toFixed(2),
          status_proposta: "PENDENTE",
        },
      });
      continue;
    }

    if (
      proposal.frete.cliente_id === userId &&
      input.status === "ENCERRADA" &&
      proposal.status_proposta === "PENDENTE"
    ) {
      const declinedOffer = Array.isArray(input.offers)
        ? record(input.offers.at(-1))
        : null;
      const declinedOfferId =
        declinedOffer?.status === "RECUSADA" ? declinedOffer.id : undefined;
      const latestOffer = proposal.ofertas.at(-1);
      if (
        !latestOffer ||
        declinedOfferId !== latestOffer.id ||
        latestOffer.status !== "PENDENTE"
      )
        throw new StorePersistenceError(
          "PROPOSAL_CHANGED",
          "A oferta mudou; atualize a conversa antes de recusá-la.",
          409,
        );
      await tx.proposta.update({
        where: { id: proposal.id },
        data: { status_proposta: "REJEITADA" },
      });
      await tx.ofertaProposta.update({
        where: { id: latestOffer.id },
        data: { status: "RECUSADA" },
      });
    }
  }
}

async function acceptFreight(
  tx: Transaction,
  userId: string,
  freightId: string,
  input: RecordValue,
) {
  const agreement = record(input.agreement);
  if (!agreement)
    throw new StorePersistenceError(
      "INVALID_ACCEPTANCE",
      "O aceite precisa identificar a oferta esperada.",
      422,
    );
  const proposalId = string(input.acceptedProposalId, 120);
  const offerId = string(agreement.offerId, 120);
  if (
    !proposalId ||
    agreement.proposalId !== proposalId ||
    typeof agreement.acceptedAt !== "string"
  )
    throw new StorePersistenceError(
      "INVALID_ACCEPTANCE",
      "O aceite não corresponde à proposta informada.",
      422,
    );
  const freight = await tx.frete.findUnique({
    where: { id: freightId },
    include: { acordo: true },
  });
  if (!freight || freight.cliente_id !== userId)
    throw new StorePersistenceError(
      "FORBIDDEN",
      "Não é permitido aceitar proposta neste frete.",
      403,
    );
  if (
    freight.status_frete_enum === "ACEITO" &&
    freight.acordo?.propostaId === proposalId &&
    freight.acordo.ofertaId === offerId
  )
    return;
  if (freight.status_frete_enum !== "ABERTO" && freight.status_frete_enum !== "EM_NEGOCIACAO")
    throw new StorePersistenceError(
      "FREIGHT_CLOSED",
      "Este frete não está mais disponível para aceite.",
      409,
    );
  const proposal = await tx.proposta.findUnique({
    where: { id: proposalId },
    include: {
      motorista: { include: { user: { include: { perfis_empresa: true } } } },
      ofertas: true,
    },
  });
  const offer = proposal?.ofertas.find((entry) => entry.id === offerId);
  if (
    !proposal ||
    proposal.frete_id !== freightId ||
    proposal.status_proposta !== "PENDENTE" ||
    !offer ||
    offer.status !== "PENDENTE" ||
    proposal.motorista.cadastro_status !== "APROVADO"
  )
    throw new StorePersistenceError(
      "PROPOSAL_CHANGED",
      "A proposta ou a oferta selecionada não está mais pendente.",
      409,
    );
  const acceptedAt = new Date(String(agreement.acceptedAt));
  if (!Number.isFinite(acceptedAt.getTime()))
    throw new StorePersistenceError(
      "INVALID_ACCEPTANCE",
      "A data do aceite é inválida.",
      422,
    );
  await tx.frete.update({
    where: { id: freightId },
    data: {
      status_frete_enum: "ACEITO",
      motorista_selecionado_id: proposal.motorista_id,
    },
  });
  await tx.proposta.updateMany({
    where: { frete_id: freightId },
    data: { status_proposta: "CANCELADA" },
  });
  await tx.proposta.update({
    where: { id: proposalId },
    data: { status_proposta: "ACEITA" },
  });
  await tx.ofertaProposta.updateMany({
    where: { proposta: { frete_id: freightId }, status: "PENDENTE" },
    data: { status: "ENCERRADA" },
  });
  await tx.ofertaProposta.update({
    where: { id: offerId },
    data: { status: "ACEITA" },
  });
  const company = proposal.motorista.user.perfis_empresa;
  await tx.acordoFrete.upsert({
    where: { freteId: freightId },
    create: {
      freteId: freightId,
      propostaId: proposalId,
      ofertaId: offerId,
      motoristaId: proposal.motorista_id,
      nomeMotorista: proposal.motorista.user.name,
      nomePrestador: company?.tradeName ?? null,
      tipoPrestador: company ? "empresa" : "autonomo",
      valorCentavos: offer.valorCentavos,
      veiculo: offer.veiculoLabel,
      disponivelEm: offer.disponivelEm,
      mensagem: offer.mensagem,
      aceitoEm: acceptedAt,
    },
    update: {
      propostaId: proposalId,
      ofertaId: offerId,
      motoristaId: proposal.motorista_id,
      nomeMotorista: proposal.motorista.user.name,
      nomePrestador: company?.tradeName ?? null,
      tipoPrestador: company ? "empresa" : "autonomo",
      valorCentavos: offer.valorCentavos,
      veiculo: offer.veiculoLabel,
      disponivelEm: offer.disponivelEm,
      mensagem: offer.mensagem,
      aceitoEm: acceptedAt,
    },
  });
  await tx.appNotification.upsert({
    where: { user_id_id: { user_id: proposal.motorista_id, id: `accepted:${offerId}` } },
    create: {
      id: `accepted:${offerId}`,
      user_id: proposal.motorista_id,
      role: "motorista",
      title: "Sua proposta foi aceita!",
      body: "Consulte o acordo e os endereços do serviço.",
      createdAt: acceptedAt,
      read: false,
      freightId,
      proposalId,
    },
    update: {},
  });
}

async function saveFreights(
  tx: Transaction,
  userId: string,
  values: unknown[],
  messages: unknown[],
) {
  for (const value of values) {
    const input = record(value);
    if (!input || typeof input.id !== "string") continue;
    const freight = await tx.frete.findUnique({
      where: { id: input.id },
      include: {
        avaliacao: true,
        acordo: true,
        proposta: {
          where: { status_proposta: "PENDENTE" },
          select: { id: true },
        },
      },
    });
    if (!freight) continue;
    if (freight.cliente_id !== userId && freight.motorista_selecionado_id !== userId)
      continue;

    const requestedStatus = input.status;
    const isClient = freight.cliente_id === userId;
    const isSelectedDriver = freight.motorista_selecionado_id === userId;
    if (
      isClient &&
      requestedStatus === "AGENDADO" &&
      (freight.status_frete_enum === "ABERTO" ||
        freight.status_frete_enum === "EM_NEGOCIACAO")
    ) {
      await acceptFreight(tx, userId, freight.id, input);
    } else if (
      requestedStatus !== freightStatus(freight.status_frete_enum) &&
      isClient
    ) {
      if (requestedStatus === "CANCELADO") {
        if (
          !["ABERTO", "EM_NEGOCIACAO", "ACEITO", "EM_TRANSPORTE"].includes(
            freight.status_frete_enum,
          )
        )
          throw new StorePersistenceError(
            "INVALID_FREIGHT_TRANSITION",
            "A situação do frete mudou; atualize os dados antes de tentar novamente.",
            409,
          );
        const proposalIds = freight.acordo
          ? [freight.acordo.propostaId]
          : freight.proposta.map((proposal) => proposal.id);
        requireCancellationMessages(messages, proposalIds, "cliente");
        await tx.frete.update({
          where: { id: freight.id },
          data: { status_frete_enum: "CANCELADO" },
        });
        await tx.proposta.updateMany({
          where: {
            frete_id: freight.id,
            status_proposta: { in: ["PENDENTE", "ACEITA"] },
          },
          data: { status_proposta: "CANCELADA" },
        });
        await tx.ofertaProposta.updateMany({
          where: {
            proposta: { frete_id: freight.id },
            status: { in: ["PENDENTE", "ACEITA"] },
          },
          data: { status: "ENCERRADA" },
        });
      } else if (
        (freight.status_frete_enum === "EM_TRANSPORTE" &&
          requestedStatus === "CONCLUIDO")
      ) {
        await tx.frete.update({
          where: { id: freight.id },
          data: { status_frete_enum: "CONCLUIDO" },
        });
      } else {
        throw new StorePersistenceError(
          "INVALID_FREIGHT_TRANSITION",
          "A situação do frete mudou; atualize os dados antes de tentar novamente.",
          409,
        );
      }
    } else if (
      requestedStatus !== freightStatus(freight.status_frete_enum) &&
      isSelectedDriver
    ) {
      if (
        requestedStatus === "EM_TRANSPORTE" &&
        freight.status_frete_enum === "ACEITO" &&
        freight.acordo &&
        freight.acordo.disponivelEm.getTime() <= Date.now()
      ) {
        await tx.frete.update({
          where: { id: freight.id },
          data: { status_frete_enum: "EM_TRANSPORTE" },
        });
      } else if (
        requestedStatus === "ABERTO" &&
        (freight.status_frete_enum === "ACEITO" ||
          freight.status_frete_enum === "EM_TRANSPORTE") &&
        freight.acordo
      ) {
        requireCancellationMessages(
          messages,
          [freight.acordo.propostaId],
          "motorista",
        );
        await tx.acordoFrete.delete({ where: { freteId: freight.id } });
        await tx.frete.update({
          where: { id: freight.id },
          data: {
            status_frete_enum: "ABERTO",
            motorista_selecionado_id: null,
          },
        });
        await tx.proposta.update({
          where: { id: freight.acordo.propostaId },
          data: { status_proposta: "CANCELADA" },
        });
        await tx.ofertaProposta.updateMany({
          where: {
            propostaId: freight.acordo.propostaId,
            status: { in: ["PENDENTE", "ACEITA"] },
          },
          data: { status: "ENCERRADA" },
        });
      } else {
        throw new StorePersistenceError(
          "INVALID_FREIGHT_TRANSITION",
          "A situação do frete mudou; atualize os dados antes de tentar novamente.",
          409,
        );
      }
    } else if (requestedStatus !== freightStatus(freight.status_frete_enum)) {
      throw new StorePersistenceError(
        "INVALID_FREIGHT_TRANSITION",
        "A situação do frete mudou; atualize os dados antes de tentar novamente.",
        409,
      );
    }

    const reviews = record(input.reviews);
    const comments = record(input.reviewComments);
    const publicComments = record(input.reviewPublicComments);
    const dates = record(input.reviewDates);
    const role: Role =
      freight.cliente_id === userId ? "cliente" : "motorista";
    const score = reviews?.[role];
    if (score !== undefined) {
      const existing = freight.avaliacao.find(
        (review) => review.avaliador_id === userId,
      );
      if (existing) continue;
      const targetId =
        role === "cliente"
          ? freight.motorista_selecionado_id
          : freight.cliente_id;
      if (
        freight.status_frete_enum !== "CONCLUIDO" ||
        !targetId ||
        !Number.isInteger(score) ||
        Number(score) < 1 ||
        Number(score) > 5
      )
        throw new StorePersistenceError(
          "INVALID_REVIEW",
          "A avaliação não está disponível.",
          422,
        );
      await tx.avaliacao.create({
        data: {
          id: randomUUID(),
          frete_id: freight.id,
          avaliador_id: userId,
          avaliado_id: targetId,
          perfil_avaliador: role,
          nota: Number(score),
          comentario: string(comments?.[role], 1000),
          publica: publicComments?.[role] === true,
          ...(typeof dates?.[role] === "string"
            ? { criado_em: new Date(String(dates[role])) }
            : {}),
        },
      });
    }
  }
}

function requireCancellationMessages(
  values: unknown,
  proposalIds: string[],
  role: Role,
) {
  if (!proposalIds.length) return;
  const prefix = `${role === "cliente" ? "Cliente" : "Motorista"} cancelou o frete. Motivo: `;
  const messages = Array.isArray(values)
    ? values.map((value) => record(value)).filter(Boolean)
    : [];
  const hasMessage = (proposalId: string) =>
    messages.some(
      (message) =>
        message?.proposalId === proposalId &&
        message.role === role &&
        typeof message.text === "string" &&
        message.text.startsWith(prefix) &&
        message.text.length <= prefix.length + 1000 &&
        message.text.slice(prefix.length).trim().length >= 3,
    );
  if (proposalIds.some((proposalId) => !hasMessage(proposalId)))
    throw new StorePersistenceError(
      "CANCELLATION_REASON_REQUIRED",
      "Informe o motivo do cancelamento para enviar pelo chat.",
      422,
    );
}

async function saveMessages(
  tx: Transaction,
  userId: string,
  values: unknown[],
) {
  for (const value of values) {
    const input = record(value);
    if (!input) continue;
    const id = string(input.id, 120);
    const proposalId = string(input.proposalId, 120);
    const text = string(input.text, 2000);
    if (!id || !proposalId || !text) continue;
    const existing = await tx.mensagem.findUnique({
      where: { id },
      select: { remetente_id: true, destinatario_id: true },
    });
    if (existing) {
      if (
        existing.remetente_id !== userId &&
        existing.destinatario_id !== userId
      )
        throw new StorePersistenceError(
          "FORBIDDEN",
          "Não é permitido alterar mensagens de outra conversa.",
          403,
        );
      continue;
    }
    const proposal = await tx.proposta.findUnique({
      where: { id: proposalId },
      include: { frete: true },
    });
    if (
      !proposal ||
      input.freightId !== proposal.frete_id ||
      (proposal.frete.cliente_id !== userId && proposal.motorista_id !== userId)
    )
      throw new StorePersistenceError(
        "FORBIDDEN",
        "Não é permitido enviar mensagens nesta conversa.",
        403,
      );
    const role: Role =
      proposal.frete.cliente_id === userId ? "cliente" : "motorista";
    if (input.role !== role)
      throw new StorePersistenceError(
        "INVALID_MESSAGE",
        "O perfil remetente não corresponde à conta autenticada.",
        422,
      );
    const recipientId =
      role === "cliente" ? proposal.motorista_id : proposal.frete.cliente_id;
    await tx.mensagem.create({
      data: {
        id,
        frete_id: proposal.frete_id,
        proposta_id: proposal.id,
        remetente_id: userId,
        destinatario_id: recipientId,
        perfil_remetente: role,
        conteudo: text,
      },
    });
    await tx.appNotification.upsert({
      where: {
        user_id_id: {
          user_id: recipientId,
          id: `message:${id}`,
        },
      },
      create: {
        id: `message:${id}`,
        user_id: recipientId,
        role: role === "cliente" ? "motorista" : "cliente",
        title: "Nova mensagem",
        body: text.slice(0, 140),
        createdAt: new Date(),
        read: false,
        freightId: proposal.frete_id,
        proposalId,
      },
      update: {},
    });
  }
}

async function saveNotifications(
  tx: Transaction,
  userId: string,
  values: unknown[],
) {
  if (values.length > 500)
    throw new StorePersistenceError(
      "INVALID_NOTIFICATION",
      "A lista de notificações excede o limite permitido.",
      422,
    );
  const ids = new Set<string>();
  for (const value of values) {
    const notification = record(value);
    if (!notification) continue;
    const id = string(notification.id, 180);
    const role = notification.role;
    const createdAt = new Date(String(notification.createdAt ?? ""));
    if (
      !id ||
      (role !== "cliente" && role !== "motorista") ||
      !Number.isFinite(createdAt.getTime())
    )
      throw new StorePersistenceError(
        "INVALID_NOTIFICATION",
        "Uma das notificações é inválida.",
        422,
      );
    if (ids.has(id))
      throw new StorePersistenceError(
        "INVALID_NOTIFICATION",
        "Há notificações repetidas na solicitação.",
        422,
      );
    ids.add(id);
    await tx.appNotification.upsert({
      where: { user_id_id: { user_id: userId, id } },
      create: {
        id,
        user_id: userId,
        role,
        title: string(notification.title, 160),
        body: string(notification.body, 1000),
        createdAt,
        read: notification.read === true,
        freightId: string(notification.freightId, 120),
        proposalId: string(notification.proposalId, 120) || null,
      },
      update: notification.read === true ? { read: true } : {},
    });
  }
}

export async function saveDriverOperatingArea(
  database: PrismaClient,
  userId: string,
  value: unknown,
): Promise<OperatingArea> {
  const area = parseOperatingArea(value);
  await database.operatingArea.upsert({
    where: { user_id: userId },
    create: {
      user_id: userId,
      latitude: area.center.lat,
      longitude: area.center.lng,
      radiusKm: area.radiusKm,
      label: area.label,
      updatedAt: new Date(),
    },
    update: {
      latitude: area.center.lat,
      longitude: area.center.lng,
      radiusKm: area.radiusKm,
      label: area.label,
    },
  });
  return area;
}

export async function saveAccountStore(
  database: PrismaClient,
  userId: string,
  payload: unknown,
): Promise<Response | null> {
  const input = record(payload);
  if (
    !input ||
    !Array.isArray(input.freights) ||
    !Array.isArray(input.proposals) ||
    !Array.isArray(input.messages)
  )
    return Response.json(
      { code: "INVALID_BODY", message: "O estado enviado está incompleto." },
      { status: 422 },
    );
  const freights = input.freights;
  const proposals = input.proposals;
  const messages = input.messages;

  try {
    const profile = record(input.profile);
    const name = string(profile?.name, 120);
    const photo = profile?.photo;
    if (
      !name ||
      typeof photo !== "string" ||
      photo.length > 7_000_000 ||
      (photo !== "" &&
        !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(
          photo,
        ) &&
        !/^https:\/\/[^ ]{1,2000}$/.test(photo))
    )
      throw new StorePersistenceError(
        "INVALID_PROFILE",
        "O nome ou a foto de perfil são inválidos.",
        422,
      );

    await database.$transaction(
      async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { id: true },
        });
        if (!user)
          throw new StorePersistenceError(
            "USER_NOT_FOUND",
            "A conta autenticada não foi encontrada.",
            404,
          );
        await tx.user.update({
          where: { id: userId },
          data: {
            name,
            image: photo || null,
            ...(input.accountSetupComplete === true
              ? { accountSetupComplete: true }
              : {}),
          },
        });
        if (
          input.accountSetupComplete === true &&
          input.accountSetupRole === "cliente"
        )
          await tx.cliente.upsert({
              where: { user_id: userId },
              create: { user_id: userId },
              update: {},
          });
        await saveDriverRegistration(
          tx,
          userId,
          input.driverRegistration,
          input.driverDocumentNumbers,
        );

        const driverExists = await tx.motorista.findUnique({
          where: { user_id: userId },
          select: { user_id: true },
        });
        if (Array.isArray(input.vehicles)) {
          if (input.vehicles.length && !driverExists)
            await tx.motorista.create({
              data: {
                user_id: userId,
                codigo_publico: randomUUID(),
                atualizado_em: new Date(),
              },
            });
          await saveVehicles(tx, userId, input.vehicles);
        }
        if (Array.isArray(input.addresses))
          await saveAddresses(tx, userId, input.addresses);

        const company = record(input.perfis_empresa);
        if (company) {
          const registration = await tx.motorista.findUnique({
            where: { user_id: userId },
            select: { tipo_pessoa: true },
          });
          if (registration?.tipo_pessoa !== "pj")
            throw new StorePersistenceError(
              "FORBIDDEN",
              "Perfil de empresa exige cadastro de motorista pessoa jurídica.",
              403,
            );
          await tx.driverCompanyProfile.upsert({
            where: { user_id: userId },
            create: {
              user_id: userId,
              tradeName: string(company.tradeName, 160),
              logo: string(company.logo, 7_000_000),
              about: string(company.about, 2000),
              city: string(company.city, 120),
              updatedAt: new Date(),
            },
            update: {
              tradeName: string(company.tradeName, 160),
              logo: string(company.logo, 7_000_000),
              about: string(company.about, 2000),
              city: string(company.city, 120),
            },
          });
        }

        const areaInput = input.operatingArea ?? input.areas_atuacao;
        if (areaInput !== undefined && areaInput !== null) {
          const area = parseOperatingArea(areaInput);
          await tx.operatingArea.upsert({
            where: { user_id: userId },
            create: {
              user_id: userId,
              latitude: area.center.lat,
              longitude: area.center.lng,
              radiusKm: area.radiusKm,
              label: area.label,
              updatedAt: new Date(),
            },
            update: {
              latitude: area.center.lat,
              longitude: area.center.lng,
              radiusKm: area.radiusKm,
              label: area.label,
            },
          });
        }

        await saveFreights(tx, userId, freights, messages);
        await saveProposals(tx, userId, proposals);
        await saveMessages(tx, userId, messages);
        if (Array.isArray(input.notifications))
          await saveNotifications(tx, userId, input.notifications);
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    return null;
  } catch (failure) {
    if (failure instanceof StorePersistenceError)
      return Response.json(
        { code: failure.code, message: failure.message },
        { status: failure.status },
      );
    if (
      failure instanceof Prisma.PrismaClientKnownRequestError &&
      (failure.code === "P2002" || failure.code === "P2034")
    )
      return Response.json(
        {
          code: failure.code === "P2034" ? "CONCURRENT_UPDATE" : "CONFLICT",
          message:
            failure.code === "P2034"
              ? "Os dados mudaram durante o salvamento. Atualize e tente novamente."
              : "Um dado informado já está cadastrado.",
        },
        { status: 409 },
      );
    throw failure;
  }
}

function registrationFromDriver(driver: {
  cadastro_status: string | null;
  nome_completo: string | null;
  tipo_pessoa: string | null;
  documento_mascarado: string | null;
  cnpj_mascarado: string | null;
  nome_empresa: string | null;
  cnh_numero_mascarado: string | null;
  cnh_categoria: string | null;
  cnh_validade: Date | null;
  cnh_foto_data_url: string | null;
  documentos_enviados: boolean;
  enviado_em: Date | null;
  revisado_em: Date | null;
  feedback: string | null;
  itens_ajuste: string[];
}): DriverRegistration | undefined {
  return registrationFromRow(driver);
}

function registrationVersion(registration: DriverRegistration) {
  return [
    registration.submittedAt,
    registration.reviewedAt || "",
    registration.status,
    String(registration.submissionCount || 1),
  ].join("|");
}

export async function loadAdminRegistrations(database: PrismaClient) {
  const drivers = await database.motorista.findMany({
    where: { cadastro_status: { not: null } },
    include: {
      user: true,
      veiculo: { where: { ativo: true } },
      cadastro_motorista: true,
    },
  });
  const now = new Date();
  const activeSubscriptions = drivers.length
    ? await database.vinculo_assinatura.findMany({
        where: {
          motorista_id: { in: drivers.map((driver) => driver.user_id) },
          status: "ATIVA",
          inicio_em: { lte: now },
          fim_em: { gt: now },
        },
        orderBy: [{ fim_em: "desc" }, { criado_em: "desc" }],
        select: { motorista_id: true, fim_em: true },
      })
    : [];
  const subscriptionByDriver = new Map<string, string>();
  for (const subscription of activeSubscriptions)
    if (subscription.fim_em && !subscriptionByDriver.has(subscription.motorista_id))
      subscriptionByDriver.set(subscription.motorista_id, subscription.fim_em.toISOString());
  const cases: AdminCase[] = drivers.flatMap((driver) => {
    const registration = registrationFromDriver(driver);
    const subscriptionExpiresAt = subscriptionByDriver.get(driver.user_id);
    return registration
      ? [
          {
            id: driver.user_id,
            registration: {
              ...registration,
              licensePhotoDataUrl: undefined,
            },
            vehicles: driver.veiculo.map(vehicleFromRow),
            ...(subscriptionExpiresAt
              ? {
                  subscription: {
                    active: true as const,
                    expiresAt: subscriptionExpiresAt,
                  },
                }
              : {}),
          },
        ]
      : [];
  });
  const reviews = await database.adminReview.findMany({
    orderBy: { at: "desc" },
  });
  const adminReviews: AdminReview[] = reviews.map((review) => ({
    id: review.id,
    caseId: review.caseUserId,
    version: review.version,
    actor: review.actor,
    at: review.at.toISOString(),
    decision: review.decision as AdminReview["decision"],
    reason: review.reason,
    correctionItems: review.itens_ajuste.filter(isCorrectionItem),
  }));
  return { cases, reviews: adminReviews };
}

function safeAdminImage(value: string | null | undefined) {
  return typeof value === "string" &&
    value.length <= 7_000_000 &&
    /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(value)
    ? value
    : null;
}

export async function loadAdminDocumentNumbers(database: PrismaClient, userId: string) {
  const driver = await database.motorista.findUnique({
    where: { user_id: userId },
    select: { cadastro_status: true, numeros_documentos: true },
  });
  return driver?.cadastro_status ? driver.numeros_documentos : null;
}

export async function loadAdminDocuments(
  database: PrismaClient,
  userId: string,
) {
  const [user, driver] = await Promise.all([
    database.user.findUnique({ where: { id: userId }, select: { image: true } }),
    database.motorista.findUnique({
      where: { user_id: userId },
      select: { cnh_foto_data_url: true },
    }),
  ]);
  return {
    profilePhoto: safeAdminImage(user?.image),
    licensePhoto: safeAdminImage(driver?.cnh_foto_data_url),
  };
}

async function driverRegistrationApproved(
  tx: Transaction,
  userId: string,
): Promise<boolean> {
  const driver = await tx.motorista.findUnique({
    where: { user_id: userId },
    select: {
      cadastro_status: true,
      cadastro_motorista: { select: { status: true } },
    },
  });
  const registrationStatus = driver?.cadastro_motorista
    ? driver.cadastro_motorista.status
    : driver?.cadastro_status;
  return registrationStatus === "APROVADO";
}

async function grantDriverSubscription(
  tx: Transaction,
  userId: string,
): Promise<Date> {
  const now = new Date();
  const active = await tx.vinculo_assinatura.findFirst({
    where: {
      motorista_id: userId,
      status: "ATIVA",
      inicio_em: { lte: now },
      fim_em: { gt: now },
    },
    orderBy: [{ fim_em: "desc" }, { criado_em: "desc" }],
    select: { id: true, fim_em: true },
  });
  if (active?.fim_em) return active.fim_em;

  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const latest = await tx.vinculo_assinatura.findFirst({
    where: { motorista_id: userId },
    orderBy: [{ criado_em: "desc" }, { id: "desc" }],
    select: { id: true },
  });
  if (latest) {
    await tx.vinculo_assinatura.update({
      where: { id: latest.id },
      data: {
        status: "ATIVA",
        inicio_em: now,
        fim_em: expiresAt,
        atualizado_em: now,
      },
    });
  } else {
    await tx.vinculo_assinatura.create({
      data: {
        id: randomUUID(),
        motorista_id: userId,
        status: "ATIVA",
        inicio_em: now,
        fim_em: expiresAt,
        atualizado_em: now,
      },
    });
  }
  return expiresAt;
}

export async function activateAdminDriverSubscription(
  database: PrismaClient,
  userId: string,
): Promise<
  | { subscription: { active: true; expiresAt: string } }
  | { error: Response }
> {
  const expiresAt = await database.$transaction(
    async (tx) =>
      (await driverRegistrationApproved(tx, userId))
        ? grantDriverSubscription(tx, userId)
        : null,
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
  if (!expiresAt)
    return {
      error: Response.json(
        {
          code: "DRIVER_NOT_APPROVED",
          message: "A assinatura só pode ser ativada após a aprovação do cadastro.",
        },
        { status: 409 },
      ),
    };
  return {
    subscription: { active: true, expiresAt: expiresAt.toISOString() },
  };
}

export async function reviewDriverRegistration(
  database: PrismaClient,
  userId: string,
  actor: string,
  input: RecordValue,
): Promise<
  | { case: AdminCase; review: AdminReview }
  | { error: Response }
> {
  const decision = input.decision;
  const activateSubscription = input.activateSubscription === true;
  const reason = typeof input.reason === "string" ? input.reason.trim() : "";
  const checks = input.checks;
  const checked = new Set(Array.isArray(checks) ? checks : []);
  const confirmedItems = adminReviewChecks
    .filter(({ label }) => checked.has(label))
    .map(({ id }) => id);
  const items = adminReviewChecks
    .filter(({ label }) => !checked.has(label))
    .map(({ id }) => id);
  if (
    (decision !== "APROVADO" && decision !== "AJUSTES_SOLICITADOS") ||
    (input.activateSubscription !== undefined &&
      typeof input.activateSubscription !== "boolean") ||
    (activateSubscription && decision !== "APROVADO") ||
    typeof input.expectedVersion !== "string" ||
    !Array.isArray(checks) ||
    checks.length !== confirmedItems.length ||
    reason.length > 1000 ||
    (decision === "AJUSTES_SOLICITADOS" && (reason.length < 10 || !items.length)) ||
    (decision === "APROVADO" && items.length > 0)
  )
    return {
      error: Response.json(
        { code: "INVALID_BODY", message: "Confira a decisão e os dados informados." },
        { status: 422 },
      ),
    };

  const outcome = await database.$transaction(
    async (tx) => {
      const driver = await tx.motorista.findUnique({
        where: { user_id: userId },
        include: {
          user: true,
          veiculo: { where: { ativo: true } },
          cadastro_motorista: true,
        },
      });
      const registration = driver && registrationFromDriver(driver);
      if (
        !driver ||
        !registration ||
        registration.status !== "EM_ANALISE" ||
        registrationVersion(registration) !== input.expectedVersion
      )
        return null;

      const todayInBahia = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Bahia",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
      const expiresOn = registration.license.expiresOn;
      if (
        decision === "APROVADO" &&
        (!registration.documentsSubmitted ||
          expiresOn < todayInBahia ||
          driver.veiculo.length === 0 ||
          driver.veiculo.some(
            (vehicle) =>
              !vehicle.modelo.trim() || !vehicle.placa.trim() || !vehicle.categoria_porte,
          ) ||
          !safeAdminImage(driver.user.image) ||
          !safeAdminImage(registration.licensePhotoDataUrl))
      )
        return { invalid: true as const };

      const at = new Date();
      const updatedDriver = await tx.motorista.update({
        where: { user_id: userId },
        data: {
          cadastro_status: decision,
          revisado_em: at,
          feedback: decision === "AJUSTES_SOLICITADOS" ? reason : null,
          itens_ajuste: items,
        },
        include: {
          user: true,
          veiculo: { where: { ativo: true } },
          cadastro_motorista: true,
        },
      });
      if (driver.cadastro_motorista)
        await tx.cadastro_motorista.update({
          where: { motorista_id: userId },
          data: {
            status: decision,
            motivo_ajuste: decision === "AJUSTES_SOLICITADOS" ? reason : null,
            itens_ajuste: items,
            itens_conferidos: confirmedItems,
            analisado_em: at,
            atualizado_em: at,
          },
        });
      const subscriptionExpiresAt = activateSubscription
        ? await grantDriverSubscription(tx, userId)
        : null;
      const review = await tx.adminReview.create({
        data: {
          id: randomUUID(),
          caseUserId: userId,
          version: input.expectedVersion as string,
          actor,
          at,
          decision,
          reason,
          itens_ajuste: items,
        },
      });
      const updatedRegistration = registrationFromDriver(updatedDriver);
      if (!updatedRegistration) return null;
      return {
        registration: updatedRegistration,
        vehicles: updatedDriver.veiculo.map(vehicleFromRow),
        review,
        subscriptionExpiresAt,
      };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
  if (!outcome)
    return {
      error: Response.json(
        {
          code: "REGISTRATION_CHANGED",
          message:
            "Este cadastro mudou ou já foi analisado. Atualize a lista antes de decidir.",
        },
        { status: 409 },
      ),
    };
  if ("invalid" in outcome)
    return {
      error: Response.json(
        {
          code: "REGISTRATION_INCOMPLETE",
          message:
            "Não é possível aprovar: confira os dados, documentação, foto e veículo.",
        },
        { status: 422 },
      ),
    };
  const review: AdminReview = {
    id: outcome.review.id,
    caseId: outcome.review.caseUserId,
    version: outcome.review.version,
    actor: outcome.review.actor,
    at: outcome.review.at.toISOString(),
    decision: outcome.review.decision as AdminReview["decision"],
    reason: outcome.review.reason,
    correctionItems: outcome.review.itens_ajuste.filter(isCorrectionItem),
  };
  const { licensePhotoDataUrl: _privatePhoto, ...safeRegistration } =
    outcome.registration;
  return {
    case: {
      id: userId,
      registration: safeRegistration,
      vehicles: outcome.vehicles,
      ...(outcome.subscriptionExpiresAt
        ? {
            subscription: {
              active: true as const,
              expiresAt: outcome.subscriptionExpiresAt.toISOString(),
            },
          }
        : {}),
    },
    review,
  };
}
