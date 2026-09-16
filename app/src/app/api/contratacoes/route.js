import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';
import { Op } from 'sequelize';

const STATUS_VALIDOS = new Set(['SOLICITADO', 'CONFIRMADO', 'FINALIZADO', 'CANCELADO']);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const clienteId = searchParams.get('cliente_id');
    const profissionalId = searchParams.get('profissional_id');
    const status = searchParams.get('status');
    const include = searchParams.get('include') === '1';

    const where = {};
    if (status) where.status = status;

    if (profissionalId) where.proposta_servico_profissional_id = Number(profissionalId);

    const includeArr = [];

    if (include || clienteId) {
      const propostaInclude = {
        model: models.Proposta,
        as: 'proposta',
        required: true,
        on: {
          '$Contratacao.proposta_servico_cliente_id$': { [Op.col]: 'proposta.servico_cliente_id' },
          '$Contratacao.proposta_servico_profissional_id$': { [Op.col]: 'proposta.profissional_pessoa_id' },
        },
        include: [],
      };

      const demandaInclude = {
        model: models.ServicoCliente,
        as: 'demanda',
        required: false,
      };

      if (clienteId) {
        demandaInclude.required = true;
        demandaInclude.where = { pessoa_id: Number(clienteId) };
      }

      propostaInclude.include.push(demandaInclude);

      propostaInclude.include.push({
        model: models.Profissional,
        as: 'prestador',
        required: false,
        include: [{ model: models.Pessoa, as: 'pessoa', required: false }],
      });

      includeArr.push(propostaInclude);
    }

    const contratacoes = await models.Contratacao.findAll({
      where,
      attributes: [
        'proposta_servico_cliente_id',
        'proposta_servico_profissional_id',
        'preco_negociado',
        'data_hora_agendamento',
        'status',
        'criado_em',
        'atualizado_em',
      ],
      include: includeArr,
      order: [['data_hora_agendamento', 'ASC']],
    });

    return NextResponse.json(contratacoes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar contratações', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();

    const required = [
      'proposta_servico_cliente_id',
      'proposta_servico_profissional_id',
      'preco_negociado',
      'data_hora_agendamento',
    ];
    for (const k of required) {
      if (data?.[k] === undefined || data?.[k] === null || data?.[k] === '') {
        await t.rollback();
        return NextResponse.json({ error: `${k} é obrigatório` }, { status: 400 });
      }
    }

    const servicoId = Number(data.proposta_servico_cliente_id);
    const profissionalId = Number(data.proposta_servico_profissional_id);

    const status = data.status ?? 'SOLICITADO';
    if (!STATUS_VALIDOS.has(status)) {
      await t.rollback();
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
    }

    const proposta = await models.Proposta.findOne({
      where: { servico_cliente_id: servicoId, profissional_pessoa_id: profissionalId },
      transaction: t,
    });

    if (!proposta) {
      await t.rollback();
      return NextResponse.json(
        { error: 'Não existe proposta para esses IDs (serviço/profissional)' },
        { status: 404 }
      );
    }

    const exists = await models.Contratacao.findOne({
      where: {
        proposta_servico_cliente_id: servicoId,
        proposta_servico_profissional_id: profissionalId,
      },
      transaction: t,
    });

    if (exists) {
      await t.rollback();
      return NextResponse.json({ error: 'Já existe contratação para essa proposta' }, { status: 409 });
    }

    const contratacao = await models.Contratacao.create(
      {
        proposta_servico_cliente_id: servicoId,
        proposta_servico_profissional_id: profissionalId,
        preco_negociado: data.preco_negociado,
        data_hora_agendamento: data.data_hora_agendamento,
        status,
      },
      { transaction: t }
    );

    await t.commit();

    const compositeId = `${servicoId}-${profissionalId}`;

    return NextResponse.json(
      { ...contratacao.toJSON(), id: compositeId },
      {
        status: 201,
        headers: { Location: `/api/contratacoes/${compositeId}` },
      }
    );
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha ao criar contratação', details: error.message },
      { status: 500 }
    );
  }
}
