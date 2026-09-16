import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';
import { Op } from 'sequelize';

const STATUS_VALIDOS = new Set(['SOLICITADO', 'CONFIRMADO', 'FINALIZADO', 'CANCELADO']);

function parseCompositeId(id) {
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
    const ids = parseCompositeId(params.id);
    if (!ids) {
      return NextResponse.json({ error: 'ID inválido. Use "servicoId-profissionalId"' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const include = searchParams.get('include') === '1';

    const contratacao = await models.Contratacao.findOne({
      where: {
        proposta_servico_cliente_id: ids.servicoId,
        proposta_servico_profissional_id: ids.profissionalId,
      },
      attributes: [
        'proposta_servico_cliente_id',
        'proposta_servico_profissional_id',
        'preco_negociado',
        'data_hora_agendamento',
        'status',
        'criado_em',
        'atualizado_em',
      ],
      include: include
        ? [
            {
              model: models.Proposta,
              as: 'proposta',
              required: true,
              on: {
                '$Contratacao.proposta_servico_cliente_id$': { [Op.col]: 'proposta.servico_cliente_id' },
                '$Contratacao.proposta_servico_profissional_id$': { [Op.col]: 'proposta.profissional_pessoa_id' },
              },
              include: [
                { model: models.ServicoCliente, as: 'demanda', required: false },
                {
                  model: models.Profissional,
                  as: 'prestador',
                  required: false,
                  include: [{ model: models.Pessoa, as: 'pessoa', required: false }],
                },
              ],
            },
          ]
        : [],
    });

    if (!contratacao) {
      return NextResponse.json({ error: 'Contratação não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ ...contratacao.toJSON(), id: params.id });
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar contratação', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const ids = parseCompositeId(params.id);
    if (!ids) {
      await t.rollback();
      return NextResponse.json({ error: 'ID inválido. Use "servicoId-profissionalId"' }, { status: 400 });
    }

    const data = await request.json();

    const contratacao = await models.Contratacao.findOne({
      where: {
        proposta_servico_cliente_id: ids.servicoId,
        proposta_servico_profissional_id: ids.profissionalId,
      },
      transaction: t,
    });

    if (!contratacao) {
      await t.rollback();
      return NextResponse.json({ error: 'Contratação não encontrada' }, { status: 404 });
    }

    const payload = {};
    if (data.preco_negociado !== undefined) payload.preco_negociado = data.preco_negociado;
    if (data.data_hora_agendamento !== undefined) payload.data_hora_agendamento = data.data_hora_agendamento;

    if (data.status !== undefined) {
      if (!STATUS_VALIDOS.has(data.status)) {
        await t.rollback();
        return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
      }
      payload.status = data.status;
    }

    await contratacao.update(payload, { transaction: t });
    await t.commit();

    return NextResponse.json({ ...contratacao.toJSON(), id: params.id });
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha ao atualizar contratação', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const ids = parseCompositeId(params.id);
    if (!ids) {
      await t.rollback();
      return NextResponse.json({ error: 'ID inválido. Use "servicoId-profissionalId"' }, { status: 400 });
    }

    const deleted = await models.Contratacao.destroy({
      where: {
        proposta_servico_cliente_id: ids.servicoId,
        proposta_servico_profissional_id: ids.profissionalId,
      },
      transaction: t,
    });

    await t.commit();

    if (!deleted) {
      return NextResponse.json({ error: 'Contratação não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha ao remover contratação', details: error.message },
      { status: 500 }
    );
  }
}
