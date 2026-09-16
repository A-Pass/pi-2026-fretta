import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import EnderecoRepository from '@/repositories/EnderecoRepository'
import { prismaToJson } from '@/helpers/serializers';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    const enderecos = await EnderecoRepository.findByPessoaId(session.user.id);

    return NextResponse.json(prismaToJson(enderecos));
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar endereços', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const data = await request.json();
    let { cep, uf, cidade, bairro, logradouro, numero, complemento, referencia } = data;
    cep=cep.replace(/\D/g, "")

    if (!cep, !uf, !cidade, !bairro, !logradouro, !numero, !complemento, !referencia) {
      return NextResponse.json(
        { error: "cep, uf, cidade, bairro, logradouro, número e complemento são obrigatórios" },
        { status: 400 }
      );
    }

    const endereco = await EnderecoRepository.createForPessoa(
      cep, uf, cidade, bairro, logradouro,
      numero, complemento, referencia, session.user.id
    );

    return NextResponse.json(prismaToJson(endereco), {
      status: 201,
      headers: { Location: `/api/enderecos/${endereco.id}` },
    });
  } catch (error) {
    console.error("Erro ao criar endereço:", error);
    return NextResponse.json(
      { error: "Falha ao criar endereço", details: error.message },
      { status: 500 }
    );
  }
}