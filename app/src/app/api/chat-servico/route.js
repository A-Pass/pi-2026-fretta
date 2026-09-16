import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const servicoId = Number(searchParams.get('servico_cliente_id'));
    const profissionalId = Number(searchParams.get('profissional_pessoa_id'));

    if (!servicoId || !profissionalId) {
      return NextResponse.json({ error: 'servico_cliente_id e profissional_pessoa_id são obrigatórios' }, { status: 400 });
    }

    const historico = await models.ChatServico.findAll({
      where: { proposta_servico_cliente_id: servicoId, proposta_servico_profissional_id: profissionalId },
      order: [['enviado_em', 'ASC']],
    });

    return NextResponse.json(historico);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar chat', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();

    const required = ['proposta_servico_cliente_id', 'proposta_servico_profissional_id', 'remetente', 'mensagem'];
    for (const k of required) {
      if (!data?.[k]) {
        await t.rollback();
        return NextResponse.json({ error: `${k} é obrigatório` }, { status: 400 });
      }
    }

    const proposta = await models.Proposta.findOne({
      where: {
        servico_cliente_id: Number(data.proposta_servico_cliente_id),
        profissional_pessoa_id: Number(data.proposta_servico_profissional_id),
      },
      transaction: t,
    });

    if (!proposta) {
      await t.rollback();
      return NextResponse.json({ error: 'Proposta não encontrada para este chat' }, { status: 404 });
    }

    const msg = await models.ChatServico.create(
      {
        proposta_servico_cliente_id: Number(data.proposta_servico_cliente_id),
        proposta_servico_profissional_id: Number(data.proposta_servico_profissional_id),
        remetente: data.remetente,
        mensagem: String(data.mensagem).trim(),
      },
      { transaction: t }
    );

    await t.commit();
    return NextResponse.json(msg, { status: 201 });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao enviar mensagem', details: error.message }, { status: 500 });
  }
}
