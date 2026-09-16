import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';

export async function GET(request, { params }) {
  try {
    const item = await models.Logradouro.findByPk(params.id, {
      include: [
        {
          model: models.Bairro,
          as: 'bairro',
          required: false,
          include: [{ model: models.Cidade, as: 'cidade', required: false }],
        },
      ],
    });
    if (!item) return NextResponse.json({ error: `Logradouro ${params.id} não encontrado` }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar logradouro', details: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();
    if (!data?.nome || !data?.cep || !data?.bairro_id) {
      await t.rollback();
      return NextResponse.json({ error: 'nome, cep e bairro_id são obrigatórios' }, { status: 400 });
    }

    const item = await models.Logradouro.findByPk(params.id, { transaction: t });
    if (!item) {
      await t.rollback();
      return NextResponse.json({ error: `Logradouro ${params.id} não encontrado` }, { status: 404 });
    }

    await item.update(
      {
        nome: String(data.nome).trim(),
        cep: String(data.cep).replace(/\D/g, ''),
        bairro_id: Number(data.bairro_id),
      },
      { transaction: t }
    );

    await t.commit();
    return NextResponse.json(item);
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao atualizar logradouro', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const item = await models.Logradouro.findByPk(params.id, { transaction: t });
    if (!item) {
      await t.rollback();
      return NextResponse.json({ error: `Logradouro ${params.id} não encontrado` }, { status: 404 });
    }
    await item.destroy({ transaction: t });
    await t.commit();
    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao remover logradouro', details: error.message }, { status: 500 });
  }
}
