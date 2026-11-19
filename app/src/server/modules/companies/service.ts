import { distanceKm } from "@/contracts/distance";
import type { Address } from "@/contracts";
import { randomUUID } from "node:crypto";
import { companyPlanPriceCents } from "@/contracts/company-plan";
import type { Prisma } from "@/generated/prisma/client";
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
    cadastro: {
      status: "APROVADO" as const,
      cnhValidade: { gte: new Date(today) },
      veiculo: { ativo: true },
    },
  };
}
function activePlan(company: {
  planoAte: Date | null;
  vagas: number;
  cadastroStatus: string;
}) {
  return (
    company.cadastroStatus === "APROVADO" &&
    !!company.planoAte &&
    company.planoAte > new Date() &&
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
      status: true,
      atualizadoEm: true,
      propostaAceitaId: true,
    },
  },
  proposta: {
    select: { id: true, status: true, conversa: { select: { id: true } } },
  },
} satisfies Prisma.AtribuicaoEmpresaInclude;

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
  const company = await tx.empresa.findUnique({ where: { gestorId: userId } });
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
          cadastroStatus: status === "TODOS" ? undefined : status,
          razaoSocial: { not: "" },
        },
        orderBy: { atualizadoEm: "asc" },
        take: 100,
      });
    }
    requireValue(method === "POST" && id, "Operação indisponível.", 404);
    const record = await tx.empresa.findUnique({ where: { id } });
    requireValue(
      record?.cadastroStatus === "EM_ANALISE" &&
        record.razaoSocial &&
        record.gestorId !== userId,
      "Cadastro indisponível para revisão por esta conta.",
      409,
    );
    requireValue(
      body.version === record.atualizadoEm.toISOString(),
      "O cadastro mudou. Atualize a lista.",
      409,
    );
    requireValue(typeof body.approve === "boolean", "Informe uma decisão.");
    requireValue(
      !body.approve || record.documentoCnpjId,
      "Solicite o comprovante do CNPJ antes de aprovar.",
    );
    const updated = await tx.empresa.update({
      where: { id },
      data: {
        cadastroStatus: body.approve ? "APROVADO" : "AJUSTES_SOLICITADOS",
        motivoAjuste: body.approve ? null : text(body.reason, 1000),
      },
    });
    await tx.notificacao.create({
      data: {
        destinatarioId: record.gestorId,
        papelDestinatario: "motorista",
        evento: "CADASTRO_EMPRESA",
        titulo: body.approve
          ? "Cadastro da empresa aprovado"
          : "Ajustes no cadastro da empresa",
        corpo:
          updated.motivoAjuste ?? "Você já pode ativar o plano da empresa.",
      },
    });
    return updated;
  }
  if (method === "GET" && !action) {
    const driver = await tx.motorista.findUnique({
      where: { userId },
      select: {
        codigoPublico: true,
        vinculoEmpresa: { select: { empresa: { select: companyPublic } } },
      },
    });
    const invitations = await tx.conviteEmpresa.findMany({
      where: {
        motoristaId: userId,
        status: "PENDENTE",
        expiraEm: { gt: new Date() },
      },
      select: { id: true, expiraEm: true, empresa: { select: companyPublic } },
    });
    const assignments = await tx.atribuicaoEmpresa.findMany({
      where: {
        OR: [
          { motoristaId: userId },
          ...(company ? [{ empresaId: company.id }] : []),
        ],
      },
      orderBy: { atualizadoEm: "desc" },
      take: 100,
      include: assignmentInclude,
    });
    const members = company
      ? await tx.vinculoEmpresa.findMany({
          where: { empresaId: company.id },
          select: {
            motoristaId: true,
            motorista: {
              select: {
                user: { select: { name: true } },
                disponivel: true,
                cadastro: {
                  select: {
                    status: true,
                    cnhValidade: true,
                    veiculo: { select: { ativo: true } },
                  },
                },
                veiculos: { where: { ativo: true }, select: vehicleSelect },
              },
            },
          },
        })
      : [];
    const outgoing = company
      ? await tx.conviteEmpresa.findMany({
          where: {
            empresaId: company.id,
            status: "PENDENTE",
            expiraEm: { gt: new Date() },
          },
          select: {
            id: true,
            expiraEm: true,
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
      members: members.map(({ motoristaId, motorista }) => ({
        motoristaId,
        available:
          motorista.disponivel &&
          motorista.cadastro?.status === "APROVADO" &&
          motorista.cadastro.cnhValidade >=
            approvedDriver().cadastro.cnhValidade.gte &&
          !!motorista.cadastro.veiculo?.ativo &&
          motorista.veiculos.length > 0,
        motorista: {
          user: motorista.user,
          cadastro: motorista.cadastro && { status: motorista.cadastro.status },
          veiculos: motorista.veiculos,
        },
      })),
      outgoing,
      unread: !!(await tx.notificacao.findFirst({
        where: { destinatarioId: userId, lida: false },
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
          status: "ABERTO",
          clienteId: { not: userId },
          ...(after ? { id: { gt: after } } : {}),
        },
        orderBy: { id: "asc" },
        take: 100,
        select: {
          id: true,
          titulo: true,
          descricao: true,
          categoriaVeiculo: true,
          tipoAgendamento: true,
          dataInicio: true,
          dataFim: true,
          origemSnapshot: true,
          destinoSnapshot: true,
        },
      });
      for (const freight of batch) {
        const pickup = (freight.origemSnapshot as unknown as Address)?.point;
        if (!pickup || !(distanceKm({ lat, lng }, pickup) <= radius)) continue;
        matches.push({
          id: freight.id,
          title: freight.titulo,
          description: freight.descricao ?? "",
          vehicle: freight.categoriaVeiculo,
          schedule: {
            kind:
              freight.tipoAgendamento === "FIXA"
                ? "fixa"
                : freight.tipoAgendamento === "INTERVALO"
                  ? "intervalo"
                  : "combinar",
            start: freight.dataInicio?.toISOString().slice(0, 10),
            end: freight.dataFim?.toISOString().slice(0, 10),
          },
          origin: city(freight.origemSnapshot),
          destination: city(freight.destinoSnapshot),
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
    const logoId = body.logoId == null ? null : text(body.logoId, 100);
    if (logoId)
      requireValue(
        await tx.arquivoUpload.findFirst({
          where: { id: logoId, usuarioId: userId, finalidade: "company" },
          select: { id: true },
        }),
        "Logo indisponível.",
      );
    const documentoCnpjId =
      body.documentId == null
        ? (company?.documentoCnpjId ?? null)
        : text(body.documentId, 100);
    requireValue(
      documentoCnpjId &&
        (await tx.arquivoUpload.findFirst({
          where: {
            id: documentoCnpjId,
            usuarioId: userId,
            finalidade: "company-proof",
          },
          select: { id: true },
        })),
      "Anexe o comprovante do CNPJ em PDF ou foto.",
    );
    const details = {
      logoId,
      documentoCnpjId,
      nome: text(body.name),
      cnpj,
      razaoSocial: text(body.legalName),
      responsavelNome: text(body.contact),
      responsavelEmail: email,
    };
    if (!company)
      return tx.empresa.create({
        data: { ...details, gestorId: userId },
      });
    const requiresReview =
      company.cadastroStatus !== "APROVADO" ||
      company.cnpj !== cnpj ||
      company.documentoCnpjId !== documentoCnpjId ||
      company.razaoSocial !== details.razaoSocial ||
      company.responsavelNome !== details.responsavelNome;
    return tx.empresa.update({
      where: { id: company.id },
      data: {
        ...details,
        motivoAjuste: null,
        cadastroStatus: requiresReview ? "EM_ANALISE" : "APROVADO",
      },
    });
  }
  if (action === "respond-invite" && id) {
    requireValue(
      typeof body.accept === "boolean",
      "Informe uma resposta ao convite.",
    );
    const invitation = await tx.conviteEmpresa.findFirst({
      where: {
        id,
        motoristaId: userId,
        status: "PENDENTE",
        expiraEm: { gt: new Date() },
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
      const occupied = await tx.vinculoEmpresa.count({
        where: { empresaId: invitation.empresaId },
      });
      requireValue(
        occupied < invitation.empresa.vagas,
        "O plano da empresa está sem vagas livres.",
        409,
      );
      requireValue(
        !(await tx.vinculoEmpresa.findUnique({
          where: { motoristaId: userId },
        })),
        "Você já está vinculado a uma empresa.",
        409,
      );
      await tx.vinculoEmpresa.create({
        data: { motoristaId: userId, empresaId: invitation.empresaId },
      });
    }
    await tx.conviteEmpresa.update({
      where: { id },
      data: { status: body.accept ? "ACEITO" : "RECUSADO" },
    });
    await tx.notificacao.create({
      data: {
        destinatarioId: invitation.empresa.gestorId,
        papelDestinatario: "motorista",
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
    const assignment = await tx.atribuicaoEmpresa.findFirst({
      where: {
        id,
        motoristaId: userId,
        status: "PENDENTE",
        frete: { status: "ABERTO" },
      },
      include: {
        empresa: true,
        motorista: { include: { vinculoEmpresa: true } },
        veiculo: true,
        frete: { select: { atualizadoEm: true } },
      },
    });
    requireValue(assignment, "Atribuição indisponível.", 404);
    if (body.accept) {
      requireValue(
        +assignment.freteVersao === +assignment.frete.atualizadoEm,
        "O frete mudou. Peça uma nova atribuição à empresa.",
        409,
      );
      requireValue(
        assignment.motorista.vinculoEmpresa?.empresaId ===
          assignment.empresaId &&
          activePlan(assignment.empresa) &&
          assignment.veiculo.ativo &&
          (await tx.motorista.findFirst({
            where: { userId, ...approvedDriver() },
            select: { userId: true },
          })),
        "O vínculo, a aprovação, o veículo e o plano precisam estar ativos.",
        409,
      );
    }
    await tx.atribuicaoEmpresa.update({
      where: { id },
      data: { status: body.accept ? "CONFIRMADA" : "RECUSADA" },
    });
    await tx.notificacao.create({
      data: {
        destinatarioId: assignment.empresa.gestorId,
        papelDestinatario: "motorista",
        evento: "DISPONIBILIDADE_EMPRESA",
        titulo: body.accept
          ? "Disponibilidade confirmada"
          : "Atribuição recusada",
        corpo: assignment.empresa.nome,
        freteId: assignment.freteId,
      },
    });
    return { ok: true };
  }
  if (action === "leave" || (action === "remove-member" && id)) {
    const driverId = action === "leave" ? userId : id!;
    const membership = await tx.vinculoEmpresa.findFirst({
      where: {
        motoristaId: driverId,
        ...(action === "remove-member"
          ? { empresa: { gestorId: userId } }
          : {}),
      },
    });
    requireValue(membership, "Vínculo indisponível.", 404);
    const open = await tx.atribuicaoEmpresa.findFirst({
      where: {
        empresaId: membership.empresaId,
        motoristaId: driverId,
        status: { in: ["PENDENTE", "CONFIRMADA"] },
        OR: [
          {
            frete: { status: "ABERTO" },
            OR: [{ propostaId: null }, { proposta: { status: "PENDENTE" } }],
          },
          {
            frete: { status: { in: ["AGENDADO", "EM_TRANSPORTE"] } },
            proposta: { status: "ACEITA" },
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
    await tx.vinculoEmpresa.delete({ where: { motoristaId: driverId } });
    return { ok: true };
  }
  requireValue(company, "Só o gestor pode realizar esta operação.", 403);
  if (
    (action === "create-plan-payment" || action === "confirm-plan-payment") &&
    !id
  ) {
    requireValue(
      company.cadastroStatus === "APROVADO",
      "Aguarde a aprovação da empresa para ativar o plano.",
      409,
    );
    requireValue(
      process.env.FRETTA_DEMO_PIX === "true",
      "Pagamento de demonstração indisponível.",
      403,
    );
    const creating = action === "create-plan-payment";
    if (!creating) {
      requireValue(
        company.pixDemoId && body.id === company.pixDemoId,
        "Gere uma nova cobrança de demonstração.",
        409,
      );
    }
    const seats = creating ? body.seats : company.pixDemoVagas;
    requireValue(
      typeof seats === "number" &&
        Number.isInteger(seats) &&
        seats >= 1 &&
        seats <= 50,
      "Informe de 1 a 50 vagas.",
    );
    const occupied = await tx.vinculoEmpresa.count({
      where: { empresaId: company.id },
    });
    requireValue(
      seats >= occupied,
      "Já existem mais motoristas vinculados que as vagas informadas.",
      409,
    );
    if (creating) {
      const paymentId =
        company.pixDemoVagas === seats && company.pixDemoId
          ? company.pixDemoId
          : `pix-empresa-${randomUUID()}`;
      await tx.empresa.update({
        where: { id: company.id },
        data: { pixDemoId: paymentId, pixDemoVagas: seats },
      });
      const price = (companyPlanPriceCents(seats) / 100).toFixed(2);
      return {
        active: false as const,
        id: paymentId,
        code: `FRETTA-DEMONSTRACAO:${paymentId}:BRL${price}`,
      };
    }
    const expiresAt = activePlan(company)
      ? company.planoAte
      : new Date(Date.now() + 30 * 86400000);
    await tx.empresa.update({
      where: { id: company.id },
      data: {
        vagas: seats,
        pixDemoId: null,
        pixDemoVagas: null,
        planoAte: expiresAt,
      },
    });
    return { active: true as const, expiresAt };
  }
  if (action === "cancel-invite" && id) {
    const result = await tx.conviteEmpresa.updateMany({
      where: { id, empresaId: company.id, status: "PENDENTE" },
      data: { status: "CANCELADO" },
    });
    requireValue(result.count, "Convite indisponível.", 404);
    return { ok: true };
  }
  if (action === "cancel-assignment" && id) {
    const assignment = await tx.atribuicaoEmpresa.findFirst({
      where: {
        id,
        empresaId: company.id,
        frete: { status: "ABERTO" },
        status: { in: ["PENDENTE", "CONFIRMADA"] },
      },
    });
    requireValue(assignment, "Atribuição indisponível.", 404);
    if (assignment.propostaId) {
      await tx.oferta.updateMany({
        where: { propostaId: assignment.propostaId, status: "PENDENTE" },
        data: { status: "SUBSTITUIDA" },
      });
      await tx.proposta.updateMany({
        where: { id: assignment.propostaId, status: "PENDENTE" },
        data: { status: "CANCELADA" },
      });
    }
    await tx.atribuicaoEmpresa.update({
      where: { id },
      data: { status: "CANCELADA" },
    });
    return { ok: true };
  }
  requireValue(activePlan(company), "Ative o plano para usar a equipe.", 403);
  if (action === "lookup" || action === "invite") {
    const code = text(body.code, 36).toLowerCase();
    const driver = await tx.motorista.findUnique({
      where: { codigoPublico: code },
      select: {
        userId: true,
        codigoPublico: true,
        user: { select: { name: true } },
        vinculoEmpresa: { select: { motoristaId: true } },
      },
    });
    requireValue(
      driver && !driver.vinculoEmpresa && driver.userId !== userId,
      "Motorista indisponível para convite.",
      404,
    );
    if (action === "lookup")
      return { name: driver.user.name, code: driver.codigoPublico };
    const occupied = await tx.vinculoEmpresa.count({
      where: { empresaId: company.id },
    });
    requireValue(
      occupied < company.vagas,
      "O plano está sem vagas livres.",
      409,
    );
    const where = {
      empresaId_motoristaId: {
        empresaId: company.id,
        motoristaId: driver.userId,
      },
    };
    const prior = await tx.conviteEmpresa.findUnique({ where });
    if (!prior || prior.status !== "PENDENTE" || prior.expiraEm <= new Date()) {
      const expiraEm = new Date(Date.now() + 7 * 86400000);
      await tx.conviteEmpresa.upsert({
        where,
        create: { ...where.empresaId_motoristaId, expiraEm },
        update: { expiraEm, status: "PENDENTE" },
      });
      await tx.notificacao.create({
        data: {
          destinatarioId: driver.userId,
          papelDestinatario: "motorista",
          evento: "CONVITE_EMPRESA",
          titulo: "Convite de empresa",
          corpo: company.nome,
        },
      });
    }
    return { ok: true };
  }
  if (action === "assign" && !id) {
    const freteId = text(body.freightId);
    const motoristaId = text(body.driverId);
    const veiculoId = text(body.vehicleId);
    const freight = await tx.frete.findFirst({
      where: {
        id: freteId,
        status: "ABERTO",
        clienteId: { notIn: [userId, motoristaId] },
      },
    });
    requireValue(freight, "Frete indisponível para esta atribuição.", 409);
    const driver = await tx.motorista.findFirst({
      where: {
        userId: motoristaId,
        ...approvedDriver(),
        vinculoEmpresa: { empresaId: company.id },
        veiculos: { some: { id: veiculoId, ativo: true } },
      },
      select: { userId: true },
    });
    requireValue(
      driver,
      "Selecione um motorista vinculado e aprovado com veículo ativo.",
    );
    const prior = await tx.atribuicaoEmpresa.findUnique({
      where: { empresaId_freteId: { empresaId: company.id, freteId } },
    });
    requireValue(
      !prior ||
        (["RECUSADA", "CANCELADA"].includes(prior.status) &&
          (!prior.propostaId || prior.motoristaId === motoristaId)),
      "Já existe uma atribuição ou negociação da empresa para este frete.",
      409,
    );
    const data = {
      empresaId: company.id,
      motoristaId,
      freteId,
      veiculoId,
      freteVersao: freight.atualizadoEm,
    };
    if (prior)
      await tx.atribuicaoEmpresa.update({
        where: { id: prior.id },
        data: { ...data, status: "PENDENTE" },
      });
    else await tx.atribuicaoEmpresa.create({ data });
    await tx.notificacao.create({
      data: {
        destinatarioId: motoristaId,
        papelDestinatario: "motorista",
        evento: "ATRIBUICAO_EMPRESA",
        titulo: "Novo serviço atribuído",
        corpo: freight.titulo,
      },
    });
    return { ok: true };
  }
  throw new CompanyError(404, "Operação indisponível.");
}
