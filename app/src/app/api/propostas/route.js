import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';
import { Op } from 'sequelize';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const servicoId = searchParams.get('servico_cliente_id');
    const profissionalId = searchParams.get('profissional_pessoa_id');
    const clienteId = searchParams.get('cliente_id');
    const include = searchParams.get('include') === '1';

    const where = {};
    if (servicoId) where.servico_cliente_id = Number(servicoId);
    if (profissionalId) where.profissional_pessoa_id = Number(profissionalId);

    const includes = [];
    if (include) {
      const demandaInclude = {
        model: models.ServicoCliente,
        as: 'demanda',
        required: false,
      };

      if (clienteId) {
        demandaInclude.required = true;
        demandaInclude.where = { pessoa_id: Number(clienteId) };
      }

      includes.push(demandaInclude);

      includes.push({
        model: models.Profissional,
        as: 'prestador',
        required: false,
        include: [{ model: models.Pessoa, as: 'pessoa', required: false }],
      });
    }

    const propostas = await models.Proposta.findAll({
      where,
      attributes: ['servico_cliente_id', 'profissional_pessoa_id', 'valor_proposta', 'texto_proposta', 'criado_em'],
      include: includes,
      order: [['criado_em', 'DESC']],
    });

    return NextResponse.json(propostas);
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar propostas', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();

    const required = ['servico_cliente_id', 'profissional_pessoa_id', 'valor_proposta', 'texto_proposta'];
    for (const k of required) {
      if (data?.[k] === undefined || data?.[k] === null || data?.[k] === '') {
        await t.rollback();
        return NextResponse.json({ error: `${k} é obrigatório` }, { status: 400 });
      }
    }

    const servicoId = Number(data.servico_cliente_id);
    const profissionalId = Number(data.profissional_pessoa_id);

    const demanda = await models.ServicoCliente.findByPk(servicoId, { transaction: t });
    if (!demanda) {
      await t.rollback();
      return NextResponse.json({ error: `Serviço do cliente ${servicoId} não encontrado` }, { status: 404 });
    }

    const profissional = await models.Profissional.findByPk(profissionalId, { transaction: t });
    if (!profissional) {
      await t.rollback();
      return NextResponse.json({ error: `Profissional ${profissionalId} não encontrado` }, { status: 404 });
    }

    const exists = await models.Proposta.findOne({
      where: { servico_cliente_id: servicoId, profissional_pessoa_id: profissionalId },
      transaction: t,
    });

    if (exists) {
      await t.rollback();
      return NextResponse.json({ error: 'Já existe proposta para esse serviço e profissional' }, { status: 409 });
    }

    const proposta = await models.Proposta.create(
      {
        servico_cliente_id: servicoId,
        profissional_pessoa_id: profissionalId,
        valor_proposta: data.valor_proposta,
        texto_proposta: String(data.texto_proposta).trim(),
      },
      { transaction: t }
    );

    await t.commit();

    return NextResponse.json(proposta, {
      status: 201,
      headers: { Location: `/api/propostas/${servicoId}/${profissionalId}` },
    });
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha ao criar proposta', details: error.message },
      { status: 500 }
    );
  }
}
