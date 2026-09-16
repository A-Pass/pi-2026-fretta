import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';

function parseAvaliacaoId(id) {
  const raw = String(id);
  const parts = raw.includes('-') ? raw.split('-') : raw.split(':');
  if (parts.length !== 3) return null;

  const servicoId = Number(parts[0]);
  const profissionalId = Number(parts[1]);
  const doCliente = parts[2] === '1';

  if (!Number.isFinite(servicoId) || !Number.isFinite(profissionalId)) return null;
  return { servicoId, profissionalId, doCliente };
}

export async function GET(request, { params }) {
  try {
    const ids = parseAvaliacaoId(params.id);
    if (!ids) return NextResponse.json({ error: 'ID inválido. Use "servicoId-profissionalId-doCliente"' }, { status: 400 });

    const avaliacao = await models.Avaliacao.findOne({
      where: {
        contratacao_proposta_servico_cliente_id: ids.servicoId,
        contratacao_proposta_servico_profissional_id: ids.profissionalId,
        do_cliente_para_profissional: ids.doCliente,
      },
    });

    if (!avaliacao) return NextResponse.json({ error: 'Avaliação não encontrada' }, { status: 404 });

    return NextResponse.json({ ...avaliacao.toJSON(), id: params.id });
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar avaliação', details: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const ids = parseAvaliacaoId(params.id);
    if (!ids) {
      await t.rollback();
      return NextResponse.json({ error: 'ID inválido. Use "servicoId-profissionalId-doCliente"' }, { status: 400 });
    }

    const data = await request.json();

    const avaliacao = await models.Avaliacao.findOne({
      where: {
        contratacao_proposta_servico_cliente_id: ids.servicoId,
        contratacao_proposta_servico_profissional_id: ids.profissionalId,
        do_cliente_para_profissional: ids.doCliente,
      },
      transaction: t,
    });

    if (!avaliacao) {
      await t.rollback();
      return NextResponse.json({ error: 'Avaliação não encontrada' }, { status: 404 });
    }

    const payload = {};
    if (data.nota !== undefined) payload.nota = data.nota;
    if (data.comentario !== undefined) payload.comentario = data.comentario;

    await avaliacao.update(payload, { transaction: t });
    await t.commit();

    return NextResponse.json({ ...avaliacao.toJSON(), id: params.id });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao atualizar avaliação', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const ids = parseAvaliacaoId(params.id);
    if (!ids) {
      await t.rollback();
      return NextResponse.json({ error: 'ID inválido. Use "servicoId-profissionalId-doCliente"' }, { status: 400 });
    }

    const deleted = await models.Avaliacao.destroy({
      where: {
        contratacao_proposta_servico_cliente_id: ids.servicoId,
        contratacao_proposta_servico_profissional_id: ids.profissionalId,
        do_cliente_para_profissional: ids.doCliente,
      },
      transaction: t,
    });

    await t.commit();

    if (!deleted) return NextResponse.json({ error: 'Avaliação não encontrada' }, { status: 404 });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao remover avaliação', details: error.message }, { status: 500 });
  }
}
