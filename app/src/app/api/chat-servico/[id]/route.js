import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';

function parseChatId(id) {
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
    const ids = parseChatId(params.id);
    if (!ids) return NextResponse.json({ error: 'ID inválido. Use "servicoId-profissionalId"' }, { status: 400 });

    const historico = await models.ChatServico.findAll({
      where: { proposta_servico_cliente_id: ids.servicoId, proposta_servico_profissional_id: ids.profissionalId },
      order: [['enviado_em', 'ASC']],
    });

    return NextResponse.json(historico);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar chat', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const ids = parseChatId(params.id);
    if (!ids) {
      await t.rollback();
      return NextResponse.json({ error: 'ID inválido. Use "servicoId-profissionalId"' }, { status: 400 });
    }

    await models.ChatServico.destroy({
      where: { proposta_servico_cliente_id: ids.servicoId, proposta_servico_profissional_id: ids.profissionalId },
      transaction: t,
    });

    await t.commit();
    return NextResponse.json({ deleted: true });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao apagar chat', details: error.message }, { status: 500 });
  }
}
