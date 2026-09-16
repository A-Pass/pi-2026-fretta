import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';

export async function GET(request, { params }) {
  try {
    const item = await models.Notificacao.findByPk(params.id, {
      include: [{ model: models.Pessoa, as: 'destinatario', required: false }],
    });
    if (!item) return NextResponse.json({ error: `Notificação ${params.id} não encontrada` }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar notificação', details: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();

    const item = await models.Notificacao.findByPk(params.id, { transaction: t });
    if (!item) {
      await t.rollback();
      return NextResponse.json({ error: `Notificação ${params.id} não encontrada` }, { status: 404 });
    }

    const payload = {};
    if (data.titulo !== undefined) payload.titulo = String(data.titulo).trim();
    if (data.descricao !== undefined) payload.descricao = String(data.descricao).trim();

    if (models.Notificacao.rawAttributes?.visualizado_em && data.visualizado_em !== undefined) {
      payload.visualizado_em = data.visualizado_em;
    }

    await item.update(payload, { transaction: t });
    await t.commit();
    return NextResponse.json(item);
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao atualizar notificação', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const item = await models.Notificacao.findByPk(params.id, { transaction: t });
    if (!item) {
      await t.rollback();
      return NextResponse.json({ error: `Notificação ${params.id} não encontrada` }, { status: 404 });
    }
    await item.destroy({ transaction: t });
    await t.commit();
    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao remover notificação', details: error.message }, { status: 500 });
  }
}
