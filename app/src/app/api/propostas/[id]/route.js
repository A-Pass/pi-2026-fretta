import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';

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
    if (!ids) return NextResponse.json({ error: 'ID inválido. Use "servicoId-profissionalId"' }, { status: 400 });

    const { searchParams } = new URL(request.url);
    const include = searchParams.get('include') === '1';

    const proposta = await models.Proposta.findOne({
      where: {
        servico_cliente_id: ids.servicoId,
        profissional_pessoa_id: ids.profissionalId,
      },
      include: include
        ? [
            { model: models.ServicoCliente, as: 'demanda', required: false },
            {
              model: models.Profissional,
              as: 'prestador',
              required: false,
              include: [{ model: models.Pessoa, as: 'pessoa', required: false }],
            },
          ]
        : [],
    });

    if (!proposta) {
      return NextResponse.json({ error: 'Proposta não encontrada' }, { status: 404 });
    }

    return NextResponse.json(proposta);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar proposta', details: error.message }, { status: 500 });
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

    const proposta = await models.Proposta.findOne({
      where: {
        servico_cliente_id: ids.servicoId,
        profissional_pessoa_id: ids.profissionalId,
      },
      transaction: t,
    });

    if (!proposta) {
      await t.rollback();
      return NextResponse.json({ error: 'Proposta não encontrada' }, { status: 404 });
    }

    const payload = {};
    if (data.valor_proposta !== undefined) payload.valor_proposta = data.valor_proposta;
    if (data.texto_proposta !== undefined) payload.texto_proposta = String(data.texto_proposta).trim();

    await proposta.update(payload, { transaction: t });
    await t.commit();

    return NextResponse.json(proposta);
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao atualizar proposta', details: error.message }, { status: 500 });
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

    const deleted = await models.Proposta.destroy({
      where: {
        servico_cliente_id: ids.servicoId,
        profissional_pessoa_id: ids.profissionalId,
      },
      transaction: t,
    });

    await t.commit();

    if (!deleted) return NextResponse.json({ error: 'Proposta não encontrada' }, { status: 404 });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao remover proposta', details: error.message }, { status: 500 });
  }
}
