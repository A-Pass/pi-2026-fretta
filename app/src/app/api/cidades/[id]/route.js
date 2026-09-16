import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';

export async function GET(request, { params }) {
  try {
    const item = await models.Cidade.findByPk(params.id, {
      include: [
        { model: models.UnidadeFederativa, as: 'uf_detalhes', required: false },
        { model: models.Bairro, as: 'bairros', required: false },
      ],
    });

    if (!item) return NextResponse.json({ error: `Cidade ${params.id} não encontrada` }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar cidade', details: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();
    if (!data?.nome || !data?.uf) {
      await t.rollback();
      return NextResponse.json({ error: 'nome e uf são obrigatórios' }, { status: 400 });
    }

    const item = await models.Cidade.findByPk(params.id, { transaction: t });
    if (!item) {
      await t.rollback();
      return NextResponse.json({ error: `Cidade ${params.id} não encontrada` }, { status: 404 });
    }

    await item.update({ nome: String(data.nome).trim(), uf: String(data.uf).toUpperCase() }, { transaction: t });
    await t.commit();
    return NextResponse.json(item);
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao atualizar cidade', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const item = await models.Cidade.findByPk(params.id, { transaction: t });
    if (!item) {
      await t.rollback();
      return NextResponse.json({ error: `Cidade ${params.id} não encontrada` }, { status: 404 });
    }
    await item.destroy({ transaction: t });
    await t.commit();
    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao remover cidade', details: error.message }, { status: 500 });
  }
}
