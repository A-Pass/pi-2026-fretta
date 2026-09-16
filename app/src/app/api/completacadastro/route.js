import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // 👈 tua instância better-auth

function onlyDigits(value = "") {
  return value.replace(/\D/g, "");
}

export async function POST(request) {
  // 🔐 Pega sessão no server
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Não autenticado" },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "FormData inválido" },
      { status: 400 }
    );
  }

  // 📥 Campos vindos do form
  const cpf = formData.get("cpf");
  const nascimento = formData.get("nascimento");
  const celular = formData.get("celular");

  // 🔎 Validação de obrigatórios
  if (!cpf || !nascimento || !celular) {
    return NextResponse.json(
      {
        error: "Campos obrigatórios ausentes",
        required: ["cpf", "nascimento", "celular"],
      },
      { status: 400 }
    );
  }

  const cpfDigits = onlyDigits(String(cpf));
  const celularDigits = onlyDigits(String(celular));

  if (cpfDigits.length !== 11) {
    return NextResponse.json(
      { error: "CPF inválido" },
      { status: 400 }
    );
  }

  if (celularDigits.length < 10 || celularDigits.length > 11) {
    return NextResponse.json(
      { error: "Celular inválido" },
      { status: 400 }
    );
  }

  const isProfissional = formData.get("isProfissional") == "on"

  const nascimentoDate = new Date(String(nascimento));
  if (isNaN(nascimentoDate.getTime())) {
    return NextResponse.json(
      { error: "Data de nascimento inválida" },
      { status: 400 }
    );
  }

  try {
    const pessoa = await prisma.$transaction(async (tx) => {
      // 🔎 Já existe pessoa para este user?
      const existingPessoa = await tx.pessoa.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (existingPessoa) {
        throw new Error("PESSOA_ALREADY_EXISTS");
      }

      // 🔎 CPF único
      const cpfExists = await tx.pessoa.findUnique({
        where: { cpf: cpfDigits },
        select: { id: true },
      });

      if (cpfExists) {
        throw new Error("CPF_ALREADY_EXISTS");
      }

      // ✅ Cria pessoa
      const created = await tx.pessoa.create({
        data: {
          id: userId, // 🔗 FK com User
          cpf: cpfDigits,
          nascimento: nascimentoDate,
          celular: celularDigits,
        },
      });

      if (isProfissional) {
        const profissional = await tx.profissional.create({
          data: {
            pessoa_id: created.id,
            titulo: "profissional"
          }
        });
      }

      return created;
    });

    return NextResponse.json(pessoa, {
      status: 201,
      headers: {
        Location: `/api/pessoas/${pessoa.id}`,
      },
    });
  } catch (err) {
    console.error("❌ Erro ao completar cadastro:", err);

    if (err.message === "PESSOA_ALREADY_EXISTS") {
      return NextResponse.json(
        { error: "Cadastro já foi completado" },
        { status: 409 }
      );
    }

    if (err.message === "CPF_ALREADY_EXISTS") {
      return NextResponse.json(
        { error: "CPF já cadastrado" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Falha ao completar cadastro" },
      { status: 500 }
    );
  }
}
