import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pessoa_id = searchParams.get('pessoa_id');
    const limit = searchParams.get('limit');

    const where = {};
    if (pessoa_id) where.pessoa_id = Number(pessoa_id);

    const items = await models.Notificacao.findAll({
      where,
      order: [['enviado_em', 'DESC']],
      ...(limit ? { limit: Number(limit) } : {}),
      include: [{ model: models.Pessoa, as: 'destinatario', required: false }],
    });

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar notificações', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();
    if (!data?.pessoa_id || !data?.titulo || !data?.descricao) {
      await t.rollback();
      return NextResponse.json({ error: 'pessoa_id, titulo e descricao são obrigatórios' }, { status: 400 });
    }

    const payload = {
      pessoa_id: Number(data.pessoa_id),
      titulo: String(data.titulo).trim(),
      descricao: String(data.descricao).trim(),
    };

    if (models.Notificacao.rawAttributes?.visualizado_em && data.visualizado_em !== undefined) {
      payload.visualizado_em = data.visualizado_em;
    }

    const created = await models.Notificacao.create(payload, { transaction: t });
    await t.commit();

    return NextResponse.json(created, { status: 201, headers: { Location: `/api/notificacoes/${created.id}` } });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao criar notificação', details: error.message }, { status: 500 });
  }
}
