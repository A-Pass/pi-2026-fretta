import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';

function parseId(id) {
  const raw = String(id);
  const parts = raw.includes('-') ? raw.split('-') : raw.split(':');
  if (parts.length !== 2) return null;
  const servicoId = Number(parts[0]);
  const profissionalId = Number(parts[1]);
  if (!Number.isFinite(servicoId) || !Number.isFinite(profissionalId)) return null;
  return { servicoId, profissionalId };
}

export async function GET(request, { params }) {
  try {
    const ids = parseId(params.id);
    if (!ids) return NextResponse.json({ error: 'ID inválido. Use "servicoId-profissionalId"' }, { status: 400 });

    const ag = await models.Contratacao.findOne({
      where: {
        proposta_servico_cliente_id: ids.servicoId,
        proposta_servico_profissional_id: ids.profissionalId,
      },
    });

    if (!ag) return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    return NextResponse.json({ ...ag.toJSON(), id: params.id });
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar agendamento', details: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const ids = parseId(params.id);
    if (!ids) {
      await t.rollback();
      return NextResponse.json({ error: 'ID inválido. Use "servicoId-profissionalId"' }, { status: 400 });
    }

    const data = await request.json();

    const ag = await models.Contratacao.findOne({
      where: {
        proposta_servico_cliente_id: ids.servicoId,
        proposta_servico_profissional_id: ids.profissionalId,
      },
      transaction: t,
    });

    if (!ag) {
      await t.rollback();
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }

    const payload = {};
    if (data.data_hora_agendamento !== undefined) payload.data_hora_agendamento = data.data_hora_agendamento;
    if (data.status !== undefined) payload.status = data.status;
    if (data.preco_negociado !== undefined) payload.preco_negociado = data.preco_negociado;

    await ag.update(payload, { transaction: t });
    await t.commit();

    return NextResponse.json({ ...ag.toJSON(), id: params.id });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao atualizar agendamento', details: error.message }, { status: 500 });
  }
}
