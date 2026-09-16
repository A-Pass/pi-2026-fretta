import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { prismaToJson } from '@/helpers/serializers';

export async function GET(req, { params }) {
  const {id} = await params
  try {
    const pessoaId = id
    const pessoa = await prisma.Pessoa.findUnique({
      include: {
        enderecos: true,
        profissional: true
      },
      where: {
        id: pessoaId
      }
    })
    
    if (!pessoa) {
      return NextResponse.json({ error: `Pessoa ${params.id} não encontrada` }, { status: 404 });
    }

    return NextResponse.json(prismaToJson(pessoa));
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar pessoa', details: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();

    const pessoa = await models.Pessoa.findByPk(params.id, { transaction: t });
    if (!pessoa) {
      await t.rollback();
      return NextResponse.json({ error: `Pessoa ${params.id} não encontrada` }, { status: 404 });
    }

    // atualiza só o que vier
    const payload = {};
    if (data.primeiro_nome !== undefined) payload.primeiro_nome = String(data.primeiro_nome).trim();
    if (data.ultimo_nome !== undefined) payload.ultimo_nome = String(data.ultimo_nome).trim();
    if (data.cpf !== undefined) payload.cpf = String(data.cpf).replace(/\D/g, '');
    if (data.nascimento !== undefined) payload.nascimento = data.nascimento;
    if (data.celular !== undefined) payload.celular = String(data.celular).trim();
    if (data.foto_perfil !== undefined) payload.foto_perfil = data.foto_perfil ?? null;

    await pessoa.update(payload, { transaction: t });

    if (data.replace_enderecos === true) {
      await models.PessoaEndereco.destroy({ where: { pessoa_id: pessoa.id }, transaction: t });

      if (Array.isArray(data.enderecos)) {
        for (const item of data.enderecos) {
          if (!item?.endereco_id) continue;
          await models.PessoaEndereco.create(
            {
              pessoa_id: pessoa.id,
              endereco_id: Number(item.endereco_id),
              ordem: item.ordem ? Number(item.ordem) : 1,
            },
            { transaction: t }
          );
        }
      }
    }

    await t.commit();
    return NextResponse.json(pessoa);
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao atualizar pessoa', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const pessoa = await models.Pessoa.findByPk(params.id, { transaction: t });
    if (!pessoa) {
      await t.rollback();
      return NextResponse.json({ error: `Pessoa ${params.id} não encontrada` }, { status: 404 });
    }

    // remove vínculos (pessoa_endereco)
    await models.PessoaEndereco.destroy({ where: { pessoa_id: pessoa.id }, transaction: t });

    await pessoa.destroy({ transaction: t });
    await t.commit();

    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao remover pessoa', details: error.message }, { status: 500 });
  }
}
