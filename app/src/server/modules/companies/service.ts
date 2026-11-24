import { distanceKm } from "@/contracts/distance";
import type { Address } from "@/contracts";
import { randomUUID } from "node:crypto";
import type { Prisma } from "@/server/generated/prisma/client";
import { validarCNPJ } from "@/server/modules/identity/validators/cnpj";

export class CompanyError extends Error {
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
  if (!condition) throw new CompanyError(status, message);
}
function text(value: unknown, max = 120) {
  requireValue(
    typeof value === "string" && value.trim() && value.trim().length <= max,
    "Confira os campos informados.",
  );
  return value.trim();
}
export function approvedDriver() {
  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "America/Bahia",
  });
  return {
    disponivel: true,
    OR: [
      {
        cadastro_motorista: { is: null },
        cadastro_status: "APROVADO",
        cnh_validade: { gte: new Date(today) },
        veiculo: { some: { ativo: true } },
      },
      {
        cadastro_motorista: {
          is: {
            status: "APROVADO" as const,
            cnh_validade: { gte: new Date(today) },
            veiculo: { is: { ativo: true } },
          },
        },
      },
    ],
  };
}
function minimumLicenseDate() {
  return new Date(
    new Date().toLocaleDateString("sv-SE", { timeZone: "America/Bahia" }),
  );
}
function activePlan(company: {
  plano_ate: Date | null;
  vagas: number;
  cadastro_status: string;
}) {
  return (
    company.cadastro_status === "APROVADO" &&
    !!company.plano_ate &&
    company.plano_ate > new Date() &&
    company.vagas > 0
  );
}
const companyPublic = { id: true, nome: true } as const;
const vehicleSelect = {
  id: true,
  categoria: true,
  modelo: true,
  ativo: true,
} as const;
const assignmentInclude = {
  empresa: { select: companyPublic },
  motorista: { select: { user: { select: { name: true } } } },
  veiculo: { select: vehicleSelect },
  frete: {
    select: {
      id: true,
      titulo: true,
      status_frete_enum: true,
      atualizado_em: true,
      proposta_aceita_id: true,
    },
  },
  proposta: {
    select: { id: true, status_proposta: true },
  },
} satisfies Prisma.atribuicao_empresaInclude;

function city(value: Prisma.JsonValue) {
  const point = value as {
    city?: string;
    cidade?: string;
    neighborhood?: string;
    bairro?: string;
  } | null;
  return [point?.neighborhood ?? point?.bairro, point?.city ?? point?.cidade]
    .filter(Boolean)
    .join(", ");
}

export async function companyOperation(
  tx: Prisma.TransactionClient,
  userId: string,
  method: string,
  parts: string[],
  body: Record<string, unknown>,
) {
  const [action, id] = parts;
  const company = await tx.empresa.findUnique({ where: { gestor_id: userId } });
  if (action === "review") {
    const admin = await tx.user.findFirst({
      where: { id: userId, papel: "ADMIN" },
      select: { id: true },
    });
    requireValue(admin, "Acesso exclusivo da administração.", 403);
    if (method === "GET" && !id) {
      const status = body.status ?? "EM_ANALISE";
      requireValue(
        status === "TODOS" ||
          status === "EM_ANALISE" ||
          status === "APROVADO" ||
          status === "AJUSTES_SOLICITADOS",
        "Situação inválida.",
      );
      return tx.empresa.findMany({
        where: {
          cadastro_status: status === "TODOS" ? undefined : status,
          razao_social: { not: "" },
        },
        orderBy: { atualizado_em: "asc" },
        take: 100,
      });
    }
    requireValue(method === "POST" && id, "Operação indisponível.", 404);
    const record = await tx.empresa.findUnique({ where: { id } });
    requireValue(
      record?.cadastro_status === "EM_ANALISE" &&
        record.razao_social &&
        record.gestor_id !== userId,
      "Cadastro indisponível para revisão por esta conta.",
      409,
    );
    requireValue(
      body.version === record.atualizado_em.toISOString(),
      "O cadastro mudou. Atualize a lista.",
      409,
    );
    requireValue(typeof body.approve === "boolean", "Informe uma decisão.");
    requireValue(
      !body.approve ||       record.documento_cnpj_id,
      "Solicite o comprovante do CNPJ antes de aprovar.",
    );
    const updated = await tx.empresa.update({
      where: { id },
      data: {
        cadastro_status: body.approve ? "APROVADO" : "AJUSTES_SOLICITADOS",
        motivo_ajuste: body.approve ? null : text(body.reason, 1000),
      },
    });
    await tx.notificacao.create({
      data: {
        id: randomUUID(),
        destinatario_id: record.gestor_id,
        papel_destinatario: "motorista",
        evento: "CADASTRO_EMPRESA",
        titulo: body.approve
          ? "Cadastro da empresa aprovado"
          : "Ajustes no cadastro da empresa",
        corpo:
          updated.motivo_ajuste ?? "Você já pode ativar o plano da empresa.",
      },
    });
    return updated;
  }
  if (method === "GET" && !action) {
    const driver = await tx.motorista.findUnique({
      where: { user_id: userId },
      select: {
        codigo_publico: true,
        vinculo_empresa: { select: { empresa: { select: companyPublic } } },
      },
    });
    const invitations = await tx.convite_empresa.findMany({
      where: {
        motorista_id: userId,
        status: "PENDENTE",
        expira_em: { gt: new Date() },
      },
      select: { id: true, expira_em: true, empresa: { select: companyPublic } },
    });
    const assignments = await tx.atribuicao_empresa.findMany({
      where: {
        OR: [
          { motorista_id: userId },
          ...(company ? [{ empresa_id: company.id }] : []),
        ],
      },
      orderBy: { atualizado_em: "desc" },
      take: 100,
      include: assignmentInclude,
    });
    const members = company
      ? await tx.vinculo_empresa.findMany({
          where: { empresa_id: company.id },
          select: {
            motorista_id: true,
            motorista: {
              select: {
                user: { select: { name: true } },
                disponivel: true,
                cadastro_motorista: {
                  select: {
                    status: true,
                    cnh_validade: true,
                    veiculo: { select: { ativo: true } },
                  },
                },
                veiculo: { where: { ativo: true }, select: vehicleSelect },
              },
            },
          },
        })
      : [];
    const outgoing = company
      ? await tx.convite_empresa.findMany({
          where: {
            empresa_id: company.id,
            status: "PENDENTE",
            expira_em: { gt: new Date() },
          },
          select: {
            id: true,
            expira_em: true,
            motorista: { select: { user: { select: { name: true } } } },
          },
        })
      : [];
    return {
      accountId: userId,
      company,
      driver,
      invitations,
      assignments,
      members: members.map(({ motorista_id, motorista }) => ({
        motorista_id,
        available:
          motorista.disponivel &&
          motorista.cadastro_motorista?.status === "APROVADO" &&
          motorista.cadastro_motorista.cnh_validade >= minimumLicenseDate() &&
          !!motorista.cadastro_motorista.veiculo?.ativo &&
          motorista.veiculo.length > 0,
        motorista: {
          user: motorista.user,
          cadastro_motorista: motorista.cadastro_motorista && { status: motorista.cadastro_motorista.status },
          veiculo: motorista.veiculo,
        },
      })),
      outgoing,
      unread: !!(await tx.notificacao.findFirst({
        where: { destinatario_id: userId, lida: false },
        select: { id: true },
      })),
      demoPayments: process.env.FRETTA_DEMO_PIX === "true",
      opportunities: [],
    };
  }
  if (method === "GET" && action === "opportunities" && !id) {
    requireValue(
      company && activePlan(company),
      "Ative o plano para buscar fretes.",
      403,
    );
    const lat = Number(body.lat ?? NaN),
      lng = Number(body.lng ?? NaN),
      radius = Number(body.radius ?? NaN);
    requireValue(
      Math.abs(lat) <= 90 &&
        Math.abs(lng) <= 180 &&
        Number.isInteger(radius) &&
        radius >= 1 &&
        radius <= 300,
      "Confira o ponto de partida e indique um raio de 1 a 300 km.",
    );
    const matches = [];
    let after: string | undefined;
    while (matches.length < 100) {
      const batch = await tx.frete.findMany({
        where: {
          status_frete_enum: "ABERTO",
          cliente_id: { not: userId },
          ...(after ? { id: { gt: after } } : {}),
        },
        orderBy: { id: "asc" },
        take: 100,
        select: {
          id: true,
          titulo: true,
          descricao: true,
          categoria_porte: true,
          tipo_agendamento_enum: true,
          data_coleta_prevista: true,
          data_entrega_prevista: true,
          endereco_frete_endereco_origem_idToendereco: true,
          endereco_frete_endereco_destino_idToendereco: true,
        },
      });
      for (const freight of batch) {
        const origin = freight.endereco_frete_endereco_origem_idToendereco;
        const pickup =
          origin?.latitude == null || origin.longitude == null
            ? undefined
            : { lat: Number(origin.latitude), lng: Number(origin.longitude) };
        if (!pickup || !(distanceKm({ lat, lng }, pickup) <= radius)) continue;
        matches.push({
          id: freight.id,
          title: freight.titulo,
          description: freight.descricao ?? "",
          vehicle: freight.categoria_porte,
          schedule: {
            kind:
              freight.tipo_agendamento_enum === "FIXA"
                ? "fixa"
                : freight.tipo_agendamento_enum === "INTERVALO"
                  ? "intervalo"
                  : "combinar",
            start: freight.data_coleta_prevista?.toISOString().slice(0, 10),
            end: freight.data_entrega_prevista?.toISOString().slice(0, 10),
          },
          origin: origin ? `${origin.bairro ?? ""}, ${origin.cidade}` : "",
          destination: freight.endereco_frete_endereco_destino_idToendereco
            ? `${freight.endereco_frete_endereco_destino_idToendereco.bairro ?? ""}, ${freight.endereco_frete_endereco_destino_idToendereco.cidade}`
            : "",
        });
        if (matches.length === 100) break;
      }
      if (batch.length < 100) break;
      after = batch.at(-1)?.id;
    }
    return { items: matches };
  }
  requireValue(
    method === "POST" && parts.length <= 2,
    "Operação indisponível.",
    404,
  );
  if ((action === "create" || action === "edit") && !id) {
    requireValue(
      action === "create" ? !company : company,
      "Confira o cadastro da empresa.",
      409,
    );
    const cnpj = text(body.cnpj, 22).replace(/[.\/\s-]/g, "");
    requireValue(
      /^\d{14}$/.test(cnpj) && validarCNPJ(cnpj),
      "Informe um CNPJ com dígitos verificadores válidos.",
    );
    const email = text(body.email, 254);
    requireValue(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      "Confira o e-mail do responsável.",
    );
    const logo_id = body.logo_id == null ? null : text(body.logo_id, 100);
    if (logo_id)
      requireValue(
        await tx.arquivo_upload.findFirst({
          where: { id: logo_id, usuario_id: userId, finalidade: "company" },
          select: { id: true },
        }),
        "Logo indisponível.",
      );
    const documento_cnpj_id =
      body.documentId == null
        ? (company?.documento_cnpj_id ?? null)
        : text(body.documentId, 100);
    requireValue(
      documento_cnpj_id &&
        (await tx.arquivo_upload.findFirst({
          where: {
            id: documento_cnpj_id,
            usuario_id: userId,
            finalidade: "company-proof",
          },
          select: { id: true },
        })),
      "Anexe o comprovante do CNPJ em PDF ou foto.",
    );
    const details = {
      logo_id,
      documento_cnpj_id,
      nome: text(body.name),
      cnpj,
      razao_social: text(body.legalName),
      responsavel_nome: text(body.contact),
      responsavel_email: email,
    };
    if (!company)
      return tx.empresa.create({
        data: {
          ...details,
          id: randomUUID(),
          gestor_id: userId,
          atualizado_em: new Date(),
        },
      });
    const requiresReview =
      company.cadastro_status !== "APROVADO" ||
      company.cnpj !== cnpj ||
      company.documento_cnpj_id !== documento_cnpj_id ||
      company.razao_social !== details.razao_social ||
      company.responsavel_nome !== details.responsavel_nome;
    return tx.empresa.update({
      where: { id: company.id },
      data: {
        ...details,
        motivo_ajuste: null,
        cadastro_status: requiresReview ? "EM_ANALISE" : "APROVADO",
      },
    });
  }
  if (action === "respond-invite" && id) {
    requireValue(
      typeof body.accept === "boolean",
      "Informe uma resposta ao convite.",
    );
    const invitation = await tx.convite_empresa.findFirst({
      where: {
        id,
        motorista_id: userId,
        status: "PENDENTE",
        expira_em: { gt: new Date() },
      },
      include: { empresa: true },
    });
    requireValue(invitation, "Convite indisponível.", 404);
    if (body.accept) {
      requireValue(
        activePlan(invitation.empresa),
        "A empresa precisa ativar o plano.",
        409,
      );
      const occupied = await tx.vinculo_empresa.count({
        where: { empresa_id: invitation.empresa_id },
      });
      requireValue(
        occupied < invitation.empresa.vagas,
        "O plano da empresa está sem vagas livres.",
        409,
      );
      requireValue(
        !(await tx.vinculo_empresa.findUnique({
          where: { motorista_id: userId },
        })),
        "Você já está vinculado a uma empresa.",
        409,
      );
      await tx.vinculo_empresa.create({
        data: { motorista_id: userId, empresa_id: invitation.empresa_id },
      });
    }
    await tx.convite_empresa.update({
      where: { id },
      data: { status: body.accept ? "ACEITO" : "RECUSADO" },
    });
    await tx.notificacao.create({
      data: {
        id: randomUUID(),
        destinatario_id: invitation.empresa.gestor_id,
        papel_destinatario: "motorista",
        evento: "VINCULO_EMPRESA",
        titulo: body.accept ? "Convite aceito" : "Convite recusado",
        corpo: invitation.empresa.nome,
      },
    });
    return { ok: true };
  }
  if (action === "respond-assignment" && id) {
    requireValue(
      typeof body.accept === "boolean",
      "Informe se pode realizar o serviço.",
    );
    const assignment = await tx.atribuicao_empresa.findFirst({
      where: {
        id,
        motorista_id: userId,
        status: "PENDENTE",
        frete: { status_frete_enum: "ABERTO" },
      },
      include: {
        empresa: true,
        motorista: { include: { vinculo_empresa: true } },
        veiculo: true,
        frete: { select: { atualizado_em: true } },
      },
    });
    requireValue(assignment, "Atribuição indisponível.", 404);
    if (body.accept) {
      requireValue(
        +assignment.frete_versao === +assignment.frete.atualizado_em,
        "O frete mudou. Peça uma nova atribuição à empresa.",
        409,
      );
      requireValue(
        assignment.motorista.vinculo_empresa?.empresa_id ===
          assignment.empresa_id &&
          activePlan(assignment.empresa) &&
          assignment.veiculo.ativo &&
          (await tx.motorista.findFirst({
            where: { user_id: userId, ...approvedDriver() },
            select: { user_id: true },
          })),
        "O vínculo, a aprovação, o veículo e o plano precisam estar ativos.",
        409,
      );
    }
    await tx.atribuicao_empresa.update({
      where: { id },
      data: { status: body.accept ? "CONFIRMADA" : "RECUSADA" },
    });
    await tx.notificacao.create({
      data: {
        id: randomUUID(),
        destinatario_id: assignment.empresa.gestor_id,
        papel_destinatario: "motorista",
        evento: "DISPONIBILIDADE_EMPRESA",
        titulo: body.accept
          ? "Disponibilidade confirmada"
          : "Atribuição recusada",
        corpo: assignment.empresa.nome,
        frete_id: assignment.frete_id,
      },
    });
    return { ok: true };
  }
  if (action === "leave" || (action === "remove-member" && id)) {
    const driverId = action === "leave" ? userId : id!;
    const membership = await tx.vinculo_empresa.findFirst({
      where: {
        motorista_id: driverId,
        ...(action === "remove-member"
          ? { empresa: { gestor_id: userId } }
          : {}),
      },
    });
    requireValue(membership, "Vínculo indisponível.", 404);
    const open = await tx.atribuicao_empresa.findFirst({
      where: {
        empresa_id: membership.empresa_id,
        motorista_id: driverId,
        status: { in: ["PENDENTE", "CONFIRMADA"] },
        OR: [
          {
            frete: { status_frete_enum: "ABERTO" },
            OR: [{ proposta_id: null }, { proposta: { status_proposta: "PENDENTE" } }],
          },
          {
            frete: { status_frete_enum: { in: ["ACEITO", "EM_TRANSPORTE"] } },
            proposta: { status_proposta: "ACEITA" },
          },
        ],
      },
      select: { id: true },
    });
    requireValue(
      !open,
      "Resolva os serviços em aberto antes de encerrar o vínculo.",
      409,
    );
    await tx.vinculo_empresa.delete({ where: { motorista_id: driverId } });
    return { ok: true };
  }
  requireValue(company, "Só o gestor pode realizar esta operação.", 403);
  if (
    (action === "create-plan-payment" || action === "confirm-plan-payment") &&
    !id
  ) {
    throw new CompanyError(
      501,
      "A ativação de planos de empresa não está disponível neste protótipo.",
    );
  }
  if (action === "cancel-invite" && id) {
    const result = await tx.convite_empresa.updateMany({
      where: { id, empresa_id: company.id, status: "PENDENTE" },
      data: { status: "CANCELADO" },
    });
    requireValue(result.count, "Convite indisponível.", 404);
    return { ok: true };
  }
  if (action === "cancel-assignment" && id) {
    const assignment = await tx.atribuicao_empresa.findFirst({
      where: {
        id,
        empresa_id: company.id,
        frete: { status_frete_enum: "ABERTO" },
        status: { in: ["PENDENTE", "CONFIRMADA"] },
      },
    });
    requireValue(assignment, "Atribuição indisponível.", 404);
    if (assignment.proposta_id) {
      await tx.ofertaProposta.updateMany({
        where: { propostaId: assignment.proposta_id, status: "PENDENTE" },
        data: { status: "SUBSTITUIDA" },
      });
      await tx.proposta.updateMany({
        where: { id: assignment.proposta_id, status_proposta: "PENDENTE" },
        data: { status_proposta: "CANCELADA" },
      });
    }
    await tx.atribuicao_empresa.update({
      where: { id },
      data: { status: "CANCELADA" },
    });
    return { ok: true };
  }
  requireValue(activePlan(company), "Ative o plano para usar a equipe.", 403);
  if (action === "lookup" || action === "invite") {
    const code = text(body.code, 36).toLowerCase();
    const driver = await tx.motorista.findUnique({
      where: { codigo_publico: code },
      select: {
        user_id: true,
        codigo_publico: true,
        user: { select: { name: true } },
        vinculo_empresa: { select: { motorista_id: true } },
      },
    });
    requireValue(
      driver && !driver.vinculo_empresa && driver.user_id !== userId,
      "Motorista indisponível para convite.",
      404,
    );
    if (action === "lookup")
      return { name: driver.user.name, code: driver.codigo_publico };
    const occupied = await tx.vinculo_empresa.count({
      where: { empresa_id: company.id },
    });
    requireValue(
      occupied < company.vagas,
      "O plano está sem vagas livres.",
      409,
    );
    const where = {
      empresa_id_motorista_id: {
        empresa_id: company.id,
        motorista_id: driver.user_id,
      },
    };
    const prior = await tx.convite_empresa.findUnique({ where });
    if (!prior || prior.status !== "PENDENTE" || prior.expira_em <= new Date()) {
      const expira_em = new Date(Date.now() + 7 * 86400000);
      await tx.convite_empresa.upsert({
        where,
        create: {
          ...where.empresa_id_motorista_id,
          id: randomUUID(),
          expira_em,
        },
        update: { expira_em, status: "PENDENTE" },
      });
      await tx.notificacao.create({
        data: {
          id: randomUUID(),
          destinatario_id: driver.user_id,
          papel_destinatario: "motorista",
          evento: "CONVITE_EMPRESA",
          titulo: "Convite de empresa",
          corpo: company.nome,
        },
      });
    }
    return { ok: true };
  }
  if (action === "assign" && !id) {
    const frete_id = text(body.freightId);
    const motorista_id = text(body.driverId);
    const veiculoId = text(body.vehicleId);
    const freight = await tx.frete.findFirst({
      where: {
        id: frete_id,
        status_frete_enum: "ABERTO",
        cliente_id: { notIn: [userId, motorista_id] },
      },
    });
    requireValue(freight, "Frete indisponível para esta atribuição.", 409);
    const driver = await tx.motorista.findFirst({
      where: {
        user_id: motorista_id,
        ...approvedDriver(),
        vinculo_empresa: { empresa_id: company.id },
        veiculo: { some: { id: veiculoId, ativo: true } },
      },
      select: { user_id: true },
    });
    requireValue(
      driver,
      "Selecione um motorista vinculado e aprovado com veículo ativo.",
    );
    const prior = await tx.atribuicao_empresa.findUnique({
      where: { empresa_id_frete_id: { empresa_id: company.id, frete_id } },
    });
    requireValue(
      !prior ||
        (["RECUSADA", "CANCELADA"].includes(prior.status) &&
          (!prior.proposta_id || prior.motorista_id === motorista_id)),
      "Já existe uma atribuição ou negociação da empresa para este frete.",
      409,
    );
    const data = {
      empresa_id: company.id,
      motorista_id,
      frete_id,
      id: randomUUID(),
      veiculo_id: veiculoId,
      frete_versao: freight.atualizado_em,
      atualizado_em: new Date(),
    };
    if (prior)
      await tx.atribuicao_empresa.update({
        where: { id: prior.id },
        data: { ...data, status: "PENDENTE" },
      });
    else await tx.atribuicao_empresa.create({ data });
    await tx.notificacao.create({
      data: {
        id: randomUUID(),
        destinatario_id: motorista_id,
        papel_destinatario: "motorista",
        evento: "ATRIBUICAO_EMPRESA",
        titulo: "Novo serviço atribuído",
        corpo: freight.titulo,
      },
    });
    return { ok: true };
  }
  throw new CompanyError(404, "Operação indisponível.");
}
