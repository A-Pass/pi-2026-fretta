import { prisma } from "@/server/db/prisma";
import { auth } from "@/server/auth/auth";
import type { NextRequest } from "next/server";
import {
  validarCadastroMotorista,
  type CadastroMotoristaInput,
} from "@/server/modules/identity/validators/driver-registration";

import { verificarVeiculoMotorista } from "@/server/modules/identity/services/driver-registration";
import { verificarAdministrador } from "@/server/auth/permissions";
import { podeAlterarStatusCadastro } from "@/server/modules/identity/services/registration-status";
import { Prisma } from "@/generated/prisma/client";
import { verificarPermissaoUpload } from "@/server/modules/identity/services/private-upload-permissions";
import { salvarDocumentoMotorista } from "../../../../server/modules/identity/services/private-file-service";
import { verificarDocumentosMotorista } from "@/server/modules/identity/services/private-file-service";
import { salvarCadastroMotorista } from "@/server/modules/identity/services/driver-registration-persistence";
import {
  listarMensagens,
  enviarMensagem,
  ChatError,
} from "@/server/modules/chat/services/message-service";
import {
  listarNotificacoes,
  marcarNotificacaoLida,
  marcarTodasNotificacoesLidas,
  NotificationError,
} from "@/server/modules/notifications/services/notification-service";
import {
  salvarUpload,
  UploadError,
  obterUpload,
  type FinalidadeUpload,
} from "@/server/modules/uploads/services/upload-service";
import { consultarAssinatura } from "@/server/modules/subscriptions/services/subscription-service";

function extrairDadosCadastro(body: unknown): CadastroMotoristaInput | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }

  const dados = body as Record<string, unknown>;

  if (
    typeof dados.tipoPessoa !== "string" ||
    typeof dados.nomeCompleto !== "string" ||
    typeof dados.cpf !== "string" ||
    typeof dados.cnhNumero !== "string" ||
    typeof dados.cnhCategoria !== "string" ||
    typeof dados.cnhValidade !== "string" ||
    typeof dados.veiculoId !== "string" ||
    (dados.cnpj !== undefined && typeof dados.cnpj !== "string") ||
    (dados.razaoSocial !== undefined &&
      typeof dados.razaoSocial !== "string") ||
    (dados.fotoPerfilId !== undefined &&
      typeof dados.fotoPerfilId !== "string") ||
    (dados.documentoCnhId !== undefined &&
      typeof dados.documentoCnhId !== "string")
  ) {
    return null;
  }

  return {
    tipoPessoa: dados.tipoPessoa as "PF" | "PJ",
    nomeCompleto: dados.nomeCompleto,
    cpf: dados.cpf,
    cnpj: dados.cnpj as string | undefined,
    razaoSocial: dados.razaoSocial as string | undefined,
    cnhNumero: dados.cnhNumero,
    cnhCategoria: dados.cnhCategoria,
    cnhValidade: dados.cnhValidade,
    veiculoId: dados.veiculoId,
    fotoPerfilId: dados.fotoPerfilId as string | undefined,
    documentoCnhId: dados.documentoCnhId as string | undefined,
  };
}

// ==========================================
// GET - CONSULTAS
// ==========================================

export async function GET(request: NextRequest) {
  // GET /api/v1/uploads/:id
  const uploadMatch = request.nextUrl.pathname.match(
    /^\/api\/v1\/uploads\/([^/]+)$/,
  );

  if (uploadMatch) {
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

    let arquivoId: string;

    try {
      arquivoId = decodeURIComponent(uploadMatch[1]);
    } catch {
      return Response.json(
        {
          code: "INVALID_FILE_ID",
          message: "Identificador do arquivo inválido.",
        },
        { status: 422 },
      );
    }

    try {
      const arquivo = await obterUpload(arquivoId, session.user.id);

      return new Response(new Uint8Array(arquivo.bytes), {
        status: 200,
        headers: {
          "Content-Type": arquivo.mimeType,
          "Content-Disposition": "inline",
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (error) {
      if (error instanceof UploadError) {
        return Response.json(
          {
            code: error.code,
            message: error.message,
          },
          { status: error.status },
        );
      }

      console.error("Erro ao recuperar upload:", error);

      return Response.json(
        {
          code: "INTERNAL_ERROR",
          message: "Não foi possível recuperar o arquivo.",
        },
        { status: 500 },
      );
    }
  }

  const path = request.nextUrl.pathname;

  // GET /api/v1/subscription
  if (path === "/api/v1/subscription") {
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

    try {
      const resultado = await consultarAssinatura(session.user.id);

      return Response.json(resultado, { status: 200 });
    } catch (error) {
      console.error("Erro ao consultar assinatura:", error);

      return Response.json(
        {
          code: "INTERNAL_ERROR",
          message: "Não foi possível consultar a assinatura.",
        },
        { status: 500 },
      );
    }
  }

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
            cadastro: {
              select: {
                status: true,
                motivoAjuste: true,
              },
            },
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
    const statusCadastro =
      user.motorista === null
        ? null
        : (user.motorista.cadastro?.status ?? "NAO_ENVIADO");

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

      driverRegistration: {
        status: statusCadastro,
        cadastroCompleto:
          user.motorista?.cadastro !== null &&
          user.motorista?.cadastro !== undefined,
        precisaCompletarCadastro:
          user.motorista !== null && statusCadastro !== "APROVADO",
        motivoAjuste: user.motorista?.cadastro?.motivoAjuste ?? null,
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
        capacityKg: veiculo.capacidadeKg ?? undefined,
        description: veiculo.descricao,
      })),
    });
  }

  if (path === "/api/v1/admin/me") {
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

    const administrador = await verificarAdministrador(session.user.id);

    if (!administrador) {
      return Response.json(
        {
          code: "FORBIDDEN",
          message: "Acesso permitido apenas para administradores.",
        },
        { status: 403 },
      );
    }

    return Response.json({
      administrador: true,
    });
  }

  // GET /api/v1/conversations/:id/messages
  const rotaMensagens = path.match(
    /^\/api\/v1\/conversations\/([^/]+)\/messages$/,
  );

  if (rotaMensagens) {
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

    let conversaId: string;

    try {
      conversaId = decodeURIComponent(rotaMensagens[1]);
    } catch {
      return Response.json(
        {
          code: "INVALID_CONVERSATION_ID",
          message: "Identificador da conversa inválido.",
        },
        { status: 422 },
      );
    }

    const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;

    try {
      const resultado = await listarMensagens(
        conversaId,
        session.user.id,
        cursor,
      );

      return Response.json(resultado, { status: 200 });
    } catch (error) {
      if (error instanceof ChatError) {
        return Response.json(
          {
            code: error.code,
            message: error.message,
          },
          { status: error.status },
        );
      }

      console.error("Erro ao consultar mensagens:", error);

      return Response.json(
        {
          code: "INTERNAL_ERROR",
          message: "Não foi possível consultar as mensagens.",
        },
        { status: 500 },
      );
    }
  }
  if (path === "/api/v1/notifications") {
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

    const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;

    try {
      const resultado = await listarNotificacoes(session.user.id, cursor);

      return Response.json(resultado, { status: 200 });
    } catch (error) {
      if (error instanceof NotificationError) {
        return Response.json(
          {
            code: error.code,
            message: error.message,
          },
          { status: error.status },
        );
      }

      console.error("Erro ao consultar notificações:", error);

      return Response.json(
        {
          code: "INTERNAL_ERROR",
          message: "Não foi possível consultar as notificações.",
        },
        { status: 500 },
      );
    }
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

  // POST /api/v1/uploads
  if (path === "/api/v1/uploads") {
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

    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.toLowerCase().startsWith("multipart/form-data;")) {
      return Response.json(
        {
          code: "INVALID_CONTENT_TYPE",
          message: "Envie a imagem usando multipart/form-data.",
        },
        { status: 415 },
      );
    }

    let formData: FormData;

    try {
      formData = await request.formData();
    } catch {
      return Response.json(
        {
          code: "INVALID_FORM_DATA",
          message: "Os dados do formulário são inválidos.",
        },
        { status: 400 },
      );
    }

    const purpose = formData.get("purpose");

    if (
      purpose !== "freight" &&
      purpose !== "profile" &&
      purpose !== "company"
    ) {
      return Response.json(
        {
          code: "INVALID_UPLOAD_PURPOSE",
          message: "A finalidade deve ser freight, profile ou company.",
        },
        { status: 422 },
      );
    }
    const arquivo = formData.get("file");

    if (!(arquivo instanceof File)) {
      return Response.json(
        {
          code: "FILE_REQUIRED",
          message: "Selecione uma imagem para enviar no campo file.",
        },
        { status: 422 },
      );
    }

    const tamanhoMaximo = 5 * 1024 * 1024;

    if (arquivo.size === 0 || arquivo.size > tamanhoMaximo) {
      return Response.json(
        {
          code: "INVALID_FILE_SIZE",
          message: "A imagem deve ter no máximo 5 MB e não pode estar vazia.",
        },
        { status: 422 },
      );
    }

    try {
      const bytes = Buffer.from(await arquivo.arrayBuffer());

      const resultado = await salvarUpload(
        session.user.id,
        bytes,
        purpose as FinalidadeUpload,
      );

      return Response.json(resultado, { status: 201 });
    } catch (error) {
      if (error instanceof UploadError) {
        return Response.json(
          {
            code: error.code,
            message: error.message,
          },
          { status: error.status },
        );
      }

      console.error("Erro ao realizar upload:", error);

      return Response.json(
        {
          code: "UPLOAD_FAILED",
          message: "Não foi possível armazenar a imagem.",
        },
        { status: 500 },
      );
    }
  }

  // POST /api/v1/notifications/read-all
  if (path === "/api/v1/notifications/read-all") {
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
    try {
      const resultado = await marcarTodasNotificacoesLidas(session.user.id);
      return Response.json(resultado, { status: 200 });
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error);
      return Response.json(
        {
          code: "INTERNAL_ERROR",
          message: "Não foi possível atualizar as notificações.",
        },
        { status: 500 },
      );
    }
  }
  // POST /api/v1/conversations/:id/messages
  const rotaMensagens = path.match(
    /^\/api\/v1\/conversations\/([^/]+)\/messages$/,
  );
  if (rotaMensagens) {
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
    let conversaId: string;
    try {
      conversaId = decodeURIComponent(rotaMensagens[1]);
    } catch {
      return Response.json(
        {
          code: "INVALID_CONVERSATION_ID",
          message: "Identificador da conversa inválido.",
        },
        { status: 422 },
      );
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          code: "INVALID_JSON",
          message: "JSON inválido.",
        },
        { status: 400 },
      );
    }
    try {
      const mensagem = await enviarMensagem(conversaId, session.user.id, body);
      return Response.json(mensagem, { status: 201 });
    } catch (error) {
      if (error instanceof ChatError) {
        return Response.json(
          {
            code: error.code,
            message: error.message,
          },
          { status: error.status },
        );
      }
      console.error("Erro ao enviar mensagem:", error);
      return Response.json(
        {
          code: "INTERNAL_ERROR",
          message: "Não foi possível enviar a mensagem.",
        },
        { status: 500 },
      );
    }
  }
  if (path === "/api/v1/driver/registration/uploads") {
    const permissao = await verificarPermissaoUpload(request.headers);
    if (!permissao.autorizado) {
      return Response.json(
        {
          code: permissao.code,
          message: permissao.message,
        },
        { status: permissao.status },
      );
    }
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("multipart/form-data;")) {
      return Response.json(
        {
          code: "INVALID_CONTENT_TYPE",
          message: "Envie o arquivo usando multipart/form-data.",
        },
        { status: 415 },
      );
    }
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return Response.json(
        {
          code: "INVALID_FORM_DATA",
          message: "Os dados do formulário são inválidos.",
        },
        { status: 400 },
      );
    }
    const tipo = formData.get("tipo");
    const arquivo = formData.get("arquivo");
    if (tipo !== "FOTO_PERFIL" && tipo !== "CNH") {
      return Response.json(
        {
          code: "INVALID_FILE_TYPE",
          message: "O tipo deve ser FOTO_PERFIL ou CNH.",
        },
        { status: 422 },
      );
    }
    if (!(arquivo instanceof File)) {
      return Response.json(
        {
          code: "FILE_REQUIRED",
          message: "Selecione uma imagem para enviar.",
        },
        { status: 422 },
      );
    }
    const tamanhoMaximo = 5 * 1024 * 1024;
    if (arquivo.size === 0 || arquivo.size > tamanhoMaximo) {
      return Response.json(
        {
          code: "INVALID_FILE_SIZE",
          message: "O arquivo deve ter no máximo 5 MB e não pode estar vazio.",
        },
        { status: 422 },
      );
    }
    try {
      const bytes = Buffer.from(await arquivo.arrayBuffer());
      const documento = await salvarDocumentoMotorista({
        motoristaId: permissao.motoristaId,
        tipo,
        bytes,
      });
      return Response.json(documento, { status: 201 });
    } catch (error) {
      if (
        error instanceof Error &&
        ["INVALID_FILE_SIZE", "INVALID_FILE_TYPE"].includes(error.message)
      ) {
        return Response.json(
          {
            code: error.message,
            message: "O arquivo enviado é inválido.",
          },
          { status: 422 },
        );
      }
      console.error("Falha ao armazenar documento privado:", error);
      return Response.json(
        {
          code: "UPLOAD_FAILED",
          message: "Não foi possível armazenar o documento.",
        },
        { status: 500 },
      );
    }
  }
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
        statusCadastro: motorista.cadastro?.status ?? "NAO_ENVIADO",
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
        capacidadeKg: typeof capacidadeKg === "number" ? capacidadeKg : null,
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
  if (path === "/api/v1/driver/registration") {
    // 1. Verificar a autenticação
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
    // 2. Verificar o perfil de motorista
    const motorista = await prisma.motorista.findUnique({
      where: {
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
    if (!motorista) {
      return Response.json(
        {
          code: "FORBIDDEN",
          message: "É necessário possuir um perfil de motorista.",
        },
        { status: 403 },
      );
    }
    // 3. Impedir novo envio de cadastro aprovado
    if (motorista.cadastro?.status === "APROVADO") {
      return Response.json(
        {
          code: "REGISTRATION_ALREADY_APPROVED",
          message: "O cadastro do motorista já está aprovado.",
        },
        { status: 409 },
      );
    }
    // 4. Ler o JSON enviado
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
    // 5. Verificar os tipos dos campos
    const dados = extrairDadosCadastro(body);
    if (!dados) {
      return Response.json(
        {
          code: "INVALID_INPUT",
          message: "Os dados do cadastro são inválidos ou incompletos.",
        },
        { status: 422 },
      );
    }
    // 6. Validar CPF, CNPJ e CNH
    const erros = validarCadastroMotorista(dados);
    if (erros.length > 0) {
      return Response.json(
        {
          code: "VALIDATION_ERROR",
          message: erros.join(" "),
        },
        { status: 422 },
      );
    }
    // 7. Verificar se o veículo pertence ao motorista
    const veiculoValido = await verificarVeiculoMotorista(
      session.user.id,
      dados.veiculoId,
    );
    if (!veiculoValido) {
      return Response.json(
        {
          code: "INVALID_VEHICLE",
          message: "Veículo não encontrado ou não autorizado.",
        },
        { status: 422 },
      );
    }
    // 8. Exigir os identificadores dos documentos.
    if (!dados.fotoPerfilId?.trim() || !dados.documentoCnhId?.trim()) {
      return Response.json(
        {
          code: "DOCUMENTS_REQUIRED",
          message: "A foto de perfil e o documento da CNH são obrigatórios.",
        },
        { status: 422 },
      );
    }
    // 9. Verificar propriedade e tipos dos documentos.
    const documentosValidos = await verificarDocumentosMotorista(
      session.user.id,
      dados.fotoPerfilId,
      dados.documentoCnhId,
    );
    if (!documentosValidos) {
      return Response.json(
        {
          code: "INVALID_DOCUMENTS",
          message: "Documentos não encontrados, inválidos ou não autorizados.",
        },
        { status: 422 },
      );
    }
    try {
      const cadastro = await salvarCadastroMotorista(session.user.id, {
        ...dados,
        fotoPerfilId: dados.fotoPerfilId,
        documentoCnhId: dados.documentoCnhId,
      });
      return Response.json(
        {
          id: cadastro.id,
          status: cadastro.status,
          enviadoEm: cadastro.enviadoEm,
          message: "Cadastro enviado para análise com sucesso.",
        },
        { status: 201 },
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "REGISTRATION_NOT_EDITABLE"
      ) {
        return Response.json(
          {
            code: "REGISTRATION_NOT_EDITABLE",
            message: "Este cadastro não pode ser reenviado no status atual.",
          },
          { status: 409 },
        );
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return Response.json(
            {
              code: "REGISTRATION_CONFLICT",
              message: "Já existe um cadastro com esses dados.",
            },
            { status: 409 },
          );
        }
        if (error.code === "P2034") {
          return Response.json(
            {
              code: "REGISTRATION_CONFLICT",
              message:
                "O cadastro foi alterado simultaneamente. Tente novamente.",
            },
            { status: 409 },
          );
        }
      }
      console.error("Falha ao salvar cadastro de motorista:", error);
      return Response.json(
        {
          code: "REGISTRATION_FAILED",
          message: "Não foi possível salvar o cadastro.",
        },
        { status: 500 },
      );
    }
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

export async function PATCH(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // PATCH /api/v1/notifications/:id

  const rotaNotificacao = path.match(/^\/api\/v1\/notifications\/([^/]+)$/);

  if (rotaNotificacao) {
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

    let notificacaoId: string;

    try {
      notificacaoId = decodeURIComponent(rotaNotificacao[1]);
    } catch {
      return Response.json(
        {
          code: "INVALID_NOTIFICATION_ID",

          message: "Identificador inválido.",
        },

        { status: 422 },
      );
    }

    try {
      const resultado = await marcarNotificacaoLida(
        notificacaoId,

        session.user.id,
      );

      return Response.json(resultado, { status: 200 });
    } catch (error) {
      if (error instanceof NotificationError) {
        return Response.json(
          {
            code: error.code,

            message: error.message,
          },

          { status: error.status },
        );
      }

      console.error("Erro ao atualizar notificação:", error);

      return Response.json(
        {
          code: "INTERNAL_ERROR",

          message: "Não foi possível atualizar a notificação.",
        },

        { status: 500 },
      );
    }
  }

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

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          code: "INVALID_JSON",

          message: "Informe um JSON válido.",
        },

        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return Response.json(
        {
          code: "INVALID_INPUT",

          message: "Informe um objeto JSON válido.",
        },

        { status: 422 },
      );
    }

    const dados = body as Record<string, unknown>;

    if (Object.keys(dados).length !== 1 || typeof dados.name !== "string") {
      return Response.json(
        {
          code: "INVALID_INPUT",

          message: "Apenas o campo name pode ser atualizado.",
        },

        { status: 422 },
      );
    }

    const name = dados.name.trim();

    if (name.length < 2 || name.length > 100) {
      return Response.json(
        {
          code: "INVALID_INPUT",

          message: "O nome deve conter entre 2 e 100 caracteres.",
        },

        { status: 422 },
      );
    }

    const usuario = await prisma.user.update({
      where: {
        id: session.user.id,
      },

      data: {
        name,
      },

      select: {
        id: true,

        name: true,

        email: true,

        image: true,
      },
    });

    return Response.json(usuario);
  }

  const vehicleMatch = path.match(/^\/api\/v1\/vehicles\/([^/]+)$/);

  if (vehicleMatch) {
    const vehicleId = vehicleMatch[1];

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

    const veiculo = await prisma.veiculo.findFirst({
      where: {
        id: vehicleId,

        motoristaId: session.user.id,

        ativo: true,
      },
    });

    if (!veiculo) {
      return Response.json(
        {
          code: "VEHICLE_NOT_FOUND",

          message: "Veículo não encontrado.",
        },

        { status: 404 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          code: "INVALID_JSON",

          message: "Informe um JSON válido.",
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

    const dados = body as Record<string, unknown>;

    const alteracoes: {
      categoria?: string;

      modelo?: string;

      placa?: string;

      capacidadeKg?: number | null;

      descricao?: string;
    } = {};

    const camposPermitidos = [
      "category",

      "model",

      "plate",

      "capacityKg",

      "description",
    ];

    if (Object.keys(dados).some((campo) => !camposPermitidos.includes(campo))) {
      return Response.json(
        {
          code: "INVALID_INPUT",

          message: "O corpo contém campos não permitidos.",
        },

        { status: 422 },
      );
    }

    if (dados.category !== undefined) {
      if (typeof dados.category !== "string" || !dados.category.trim()) {
        return Response.json(
          { code: "INVALID_INPUT", message: "Categoria inválida." },

          { status: 422 },
        );
      }

      alteracoes.categoria = dados.category.trim();
    }

    if (dados.model !== undefined) {
      if (typeof dados.model !== "string" || !dados.model.trim()) {
        return Response.json(
          { code: "INVALID_INPUT", message: "Modelo inválido." },

          { status: 422 },
        );
      }

      alteracoes.modelo = dados.model.trim();
    }

    if (dados.plate !== undefined) {
      if (
        typeof dados.plate !== "string" ||
        !/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(
          dados.plate.trim().toUpperCase(),
        )
      ) {
        return Response.json(
          { code: "INVALID_INPUT", message: "Placa inválida." },

          { status: 422 },
        );
      }

      alteracoes.placa = dados.plate.trim().toUpperCase();
    }

    if (dados.capacityKg !== undefined) {
      if (
        dados.capacityKg !== null &&
        (typeof dados.capacityKg !== "number" ||
          !Number.isFinite(dados.capacityKg) ||
          dados.capacityKg <= 0)
      ) {
        return Response.json(
          { code: "INVALID_INPUT", message: "Capacidade inválida." },

          { status: 422 },
        );
      }

      alteracoes.capacidadeKg = dados.capacityKg;
    }

    if (dados.description !== undefined) {
      if (typeof dados.description !== "string") {
        return Response.json(
          { code: "INVALID_INPUT", message: "Descrição inválida." },

          { status: 422 },
        );
      }

      alteracoes.descricao = dados.description.trim();
    }

    if (Object.keys(alteracoes).length === 0) {
      return Response.json(
        {
          code: "INVALID_INPUT",

          message: "Informe pelo menos um campo para atualizar.",
        },

        { status: 422 },
      );
    }

    if (alteracoes.placa && alteracoes.placa !== veiculo.placa) {
      const placaExistente = await prisma.veiculo.findUnique({
        where: { placa: alteracoes.placa },

        select: { id: true },
      });

      if (placaExistente) {
        return Response.json(
          {
            code: "VEHICLE_ALREADY_EXISTS",

            message: "Já existe um veículo com essa placa.",
          },

          { status: 409 },
        );
      }
    }

    try {
      const atualizado = await prisma.veiculo.update({
        where: {
          id: veiculo.id,

          motoristaId: session.user.id,

          ativo: true,
        },

        data: alteracoes,
      });

      return Response.json({
        id: atualizado.id,

        category: atualizado.categoria,

        model: atualizado.modelo,

        plate: atualizado.placa,

        capacityKg: atualizado.capacidadeKg ?? undefined,

        description: atualizado.descricao,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return Response.json(
            {
              code: "VEHICLE_ALREADY_EXISTS",

              message: "Já existe um veículo com essa placa.",
            },

            { status: 409 },
          );
        }

        if (error.code === "P2025") {
          return Response.json(
            {
              code: "VEHICLE_NOT_FOUND",

              message: "Veículo não encontrado ou desativado.",
            },

            { status: 404 },
          );
        }
      }

      throw error;
    }
  }

  if (path === "/api/v1/admin/driver/registration") {
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

    const administrador = await verificarAdministrador(session.user.id);

    if (!administrador) {
      return Response.json(
        {
          code: "FORBIDDEN",

          message: "Acesso permitido apenas para administradores.",
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

          message: "Informe um JSON válido.",
        },

        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return Response.json(
        {
          code: "INVALID_INPUT",

          message: "Dados inválidos.",
        },

        { status: 422 },
      );
    }

    const dados = body as Record<string, unknown>;

    const motoristaId = dados.motoristaId;

    const novoStatus = dados.status;

    const motivoAjuste = dados.motivoAjuste;

    if (
      typeof motoristaId !== "string" ||
      !motoristaId.trim() ||
      (novoStatus !== "APROVADO" && novoStatus !== "AJUSTES_SOLICITADOS") ||
      (motivoAjuste !== undefined && typeof motivoAjuste !== "string")
    ) {
      return Response.json(
        {
          code: "INVALID_INPUT",

          message: "Motorista ou status inválido.",
        },

        { status: 422 },
      );
    }

    if (
      novoStatus === "AJUSTES_SOLICITADOS" &&
      (typeof motivoAjuste !== "string" || !motivoAjuste.trim())
    ) {
      return Response.json(
        {
          code: "INVALID_INPUT",

          message: "Informe o motivo dos ajustes.",
        },

        { status: 422 },
      );
    }

    const cadastro = await prisma.cadastroMotorista.findUnique({
      where: {
        motoristaId,
      },

      select: {
        id: true,

        status: true,
      },
    });

    if (!cadastro) {
      return Response.json(
        {
          code: "REGISTRATION_NOT_FOUND",

          message: "Cadastro de motorista não encontrado.",
        },

        { status: 404 },
      );
    }

    if (!podeAlterarStatusCadastro(cadastro.status, novoStatus, "ADMIN")) {
      return Response.json(
        {
          code: "INVALID_STATUS_TRANSITION",

          message: "Transição de status não permitida.",
        },

        { status: 409 },
      );
    }

    // Atualização condicional para evitar aprovações concorrentes

    const resultado = await prisma.cadastroMotorista.updateMany({
      where: {
        id: cadastro.id,

        status: cadastro.status,
      },

      data: {
        status: novoStatus,

        motivoAjuste:
          novoStatus === "AJUSTES_SOLICITADOS" ? motivoAjuste!.trim() : null,

        analisadoEm: new Date(),
      },
    });

    if (resultado.count !== 1) {
      return Response.json(
        {
          code: "REGISTRATION_CONFLICT",

          message: "O cadastro foi alterado por outra operação.",
        },

        { status: 409 },
      );
    }

    return Response.json({
      message: "Situação cadastral atualizada com sucesso.",

      status: novoStatus,
    });
  }

  return Response.json(
    {
      code: "NOT_IMPLEMENTED",

      message: "Endpoint ainda não implementado.",
    },

    { status: 501 },
  );
}

export async function DELETE(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const vehicleMatch = path.match(/^\/api\/v1\/vehicles\/([^/]+)$/);

  if (vehicleMatch) {
    const vehicleId = vehicleMatch[1];

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

    const cadastroVinculado = await prisma.cadastroMotorista.findFirst({
      where: {
        motoristaId: session.user.id,
        veiculoId: vehicleId,
        status: {
          in: ["EM_ANALISE", "APROVADO"],
        },
      },
      select: {
        id: true,
      },
    });

    if (cadastroVinculado) {
      return Response.json(
        {
          code: "VEHICLE_IN_USE",
          message:
            "Este veículo está vinculado a um cadastro de motorista em análise ou aprovado.",
        },
        { status: 409 },
      );
    }

    const resultado = await prisma.veiculo.updateMany({
      where: {
        id: vehicleId,
        motoristaId: session.user.id,
        ativo: true,
      },
      data: {
        ativo: false,
      },
    });

    if (resultado.count === 0) {
      return Response.json(
        {
          code: "VEHICLE_NOT_FOUND",
          message: "Veículo não encontrado ou já desativado.",
        },
        { status: 404 },
      );
    }

    return Response.json({
      message: "Veículo desativado com sucesso.",
    });
  }

  return Response.json(
    {
      code: "NOT_IMPLEMENTED",
      message: "Endpoint ainda não implementado.",
    },
    { status: 501 },
  );
}
