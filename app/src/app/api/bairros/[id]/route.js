import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';

export async function GET(request, { params }) {
  try {
    const item = await models.Bairro.findByPk(params.id, {
      include: [{ model: models.Cidade, as: 'cidade', required: false }],
    });
    if (!item) return NextResponse.json({ error: `Bairro ${params.id} não encontrado` }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar bairro', details: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();
    if (!data?.nome || !data?.cidade_id) {
      await t.rollback();
      return NextResponse.json({ error: 'nome e cidade_id são obrigatórios' }, { status: 400 });
    }

    const item = await models.Bairro.findByPk(params.id, { transaction: t });
    if (!item) {
      await t.rollback();
      return NextResponse.json({ error: `Bairro ${params.id} não encontrado` }, { status: 404 });
    }

    await item.update({ nome: String(data.nome).trim(), cidade_id: Number(data.cidade_id) }, { transaction: t });
    await t.commit();
    return NextResponse.json(item);
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao atualizar bairro', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const item = await models.Bairro.findByPk(params.id, { transaction: t });
    if (!item) {
      await t.rollback();
      return NextResponse.json({ error: `Bairro ${params.id} não encontrado` }, { status: 404 });
    }
    await item.destroy({ transaction: t });
    await t.commit();
    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao remover bairro', details: error.message }, { status: 500 });
  }
}
