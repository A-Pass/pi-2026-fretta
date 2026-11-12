import { prisma } from "@/server/db/prisma";
import { auth } from "@/server/auth/auth";
import type { NextRequest } from "next/server";

// ==========================================
// GET - CONSULTAS
// ==========================================

export async function GET(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Consultar dados do usuário autenticado
  // GET /api/v1/me

  if (path === "/api/v1/me") {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return Response.json(
        {
          code: "UNAUTHORIZED",
          message: "Você precisa estar autenticado.",
        },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        cliente: {
          select: {
            userId: true,
          },
        },
        motorista: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json(
        {
          code: "USER_NOT_FOUND",
          message: "Usuário não encontrado.",
        },
        { status: 404 },
      );
    }

    return Response.json({
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      emailVerified: session.user.emailVerified,
      roles: {
        cliente: user.cliente !== null,
        motorista: user.motorista !== null,
      },
    });
  }

  // 2. Consultar cadastro do motorista
  // GET /api/v1/driver/registration

  if (path === "/api/v1/driver/registration") {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return Response.json(
        {
          code: "UNAUTHORIZED",
          message: "Você precisa estar autenticado.",
        },
        { status: 401 },
      );
    }

    const motorista = await prisma.motorista.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        cadastro: true,
      },
    });

    if (!motorista) {
      return Response.json(
        {
          code: "DRIVER_PROFILE_NOT_FOUND",
          message: "Perfil de motorista não encontrado.",
        },
        { status: 404 },
      );
    }

    if (!motorista.cadastro) {
      return Response.json({
        status: "NAO_ENVIADO",
        cadastroCompleto: false,
        podeRealizarFretes: false,
      });
    }

    return Response.json({
      status: motorista.cadastro.status,
      cadastroCompleto: true,
      podeRealizarFretes: false,
      enviadoEm: motorista.cadastro.enviadoEm,
      analisadoEm: motorista.cadastro.analisadoEm,
      motivoAjuste: motorista.cadastro.motivoAjuste,
    });
  }


if (path === "/api/v1/vehicles") {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        code: "UNAUTHORIZED",
        message: "Você precisa estar autenticado.",
      },
      { status: 401 },
    );
  }

  const motorista = await prisma.motorista.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      userId: true,
    },
  });

  if (!motorista) {
    return Response.json(
      {
        code: "FORBIDDEN",
        message: "É necessário possuir um perfil de motorista.",
      },
      { status: 403 },
    );
  }

  const veiculos = await prisma.veiculo.findMany({
    where: {
      motoristaId: session.user.id,
      ativo: true,
    },
    select: {
      id: true,
      categoria: true,
      modelo: true,
      placa: true,
      capacidadeKg: true,
      descricao: true,
    },
    orderBy: {
      criadoEm: "desc",
    },
  });

  return Response.json({
    vehicles: veiculos.map((veiculo) => ({
      id: veiculo.id,
      category: veiculo.categoria,
      model: veiculo.modelo,
      plate: veiculo.placa,
      capacityKg: veiculo.capacidadeKg,
      description: veiculo.descricao,
    })),
  });
}


  // Outras rotas GET ainda não implementadas
  return Response.json(
    {
      code: "NOT_IMPLEMENTED",
      message: "API real ainda não implementada. Consulte docs/api.md.",
    },
    { status: 501 },
  );
}

// ==========================================
// POST - CADASTROS
// ==========================================

export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 3. Ativar perfil de cliente
  // POST /api/v1/me/client

  if (path === "/api/v1/me/client") {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return Response.json(
        {
          code: "UNAUTHORIZED",
          message: "Você precisa estar autenticado.",
        },
        { status: 401 },
      );
    }

    const cliente = await prisma.cliente.upsert({
      where: {
        userId: session.user.id,
      },
      update: {},
      create: {
        userId: session.user.id,
      },
    });

    return Response.json(
      {
        message: "Perfil de cliente ativado com sucesso.",
        cliente: {
          userId: cliente.userId,
          createdAt: cliente.createdAt,
        },
      },
      { status: 200 },
    );
  }

  // 4. Ativar perfil de motorista
  // POST /api/v1/me/driver

  if (path === "/api/v1/me/driver") {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return Response.json(
        {
          code: "UNAUTHORIZED",
          message: "Você precisa estar autenticado.",
        },
        { status: 401 },
      );
    }

    const motorista = await prisma.motorista.upsert({
      where: {
        userId: session.user.id,
      },
      update: {},
      create: {
        userId: session.user.id,
      },
      include: {
        cadastro: {
          select: {
            status: true,
          },
        },
      },
    });

    return Response.json({
      message: "Perfil de motorista ativado com sucesso.",
      motorista: {
        userId: motorista.userId,
        disponivel: motorista.disponivel,
        cadastroCompleto: motorista.cadastro !== null,
        statusCadastro:
          motorista.cadastro?.status ?? "NAO_ENVIADO",
      },
    });
  }


if (path === "/api/v1/vehicles") {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        code: "UNAUTHORIZED",
        message: "Você precisa estar autenticado.",
      },
      { status: 401 },
    );
  }

  const motorista = await prisma.motorista.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!motorista) {
    return Response.json(
      {
        code: "FORBIDDEN",
        message: "É necessário possuir um perfil de motorista.",
      },
      { status: 403 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        code: "INVALID_JSON",
        message: "O corpo da requisição deve conter um JSON válido.",
      },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json(
      {
        code: "INVALID_INPUT",
        message: "Dados do veículo inválidos.",
      },
      { status: 422 },
    );
  }

  const data = body as Record<string, unknown>;

  const categoria = data.category;
  const modelo = data.model;
  const placa = data.plate;
  const capacidadeKg = data.capacityKg;
  const descricao = data.description;

  if (
    typeof categoria !== "string" ||
    !categoria.trim() ||
    typeof modelo !== "string" ||
    !modelo.trim() ||
    typeof placa !== "string" ||
    !/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(placa.trim().toUpperCase()) ||
    (capacidadeKg !== undefined &&
      (typeof capacidadeKg !== "number" ||
        !Number.isFinite(capacidadeKg) ||
        capacidadeKg <= 0)) ||
    (descricao !== undefined && typeof descricao !== "string")
  ) {
    return Response.json(
      {
        code: "INVALID_INPUT",
        message: "Confira os dados informados para o veículo.",
      },
      { status: 422 },
    );
  }

  const placaNormalizada = placa.trim().toUpperCase();

  const placaExistente = await prisma.veiculo.findUnique({
    where: {
      placa: placaNormalizada,
    },
    select: {
      id: true,
    },
  });

  if (placaExistente) {
    return Response.json(
      {
        code: "VEHICLE_ALREADY_EXISTS",
        message: "Já existe um veículo cadastrado com essa placa.",
      },
      { status: 409 },
    );
  }

  const veiculo = await prisma.veiculo.create({
    data: {
      motoristaId: session.user.id,
      categoria: categoria.trim(),
      modelo: modelo.trim(),
      placa: placaNormalizada,
      capacidadeKg:
        typeof capacidadeKg === "number" ? capacidadeKg : null,
      descricao: typeof descricao === "string" ? descricao.trim() : "",
    },
  });

  return Response.json(
    {
      id: veiculo.id,
      category: veiculo.categoria,
      model: veiculo.modelo,
      plate: veiculo.placa,
      capacityKg: veiculo.capacidadeKg,
      description: veiculo.descricao,
    },
    { status: 201 },
  );
}


  // Outras rotas POST ainda não implementadas
  return Response.json(
    {
      code: "NOT_IMPLEMENTED",
      message: "Endpoint ainda não implementado.",
    },
    { status: 501 },
  );
}

// ==========================================
// PATCH E DELETE - AINDA NÃO IMPLEMENTADOS
// ==========================================

export async function PATCH() {
  return Response.json(
    {
      code: "NOT_IMPLEMENTED",
      message: "Endpoint ainda não implementado.",
    },
    { status: 501 },
  );
}

export async function DELETE() {
  return Response.json(
    {
      code: "NOT_IMPLEMENTED",
      message: "Endpoint ainda não implementado.",
    },
    { status: 501 },
  );
}
