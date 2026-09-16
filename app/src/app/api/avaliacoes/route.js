import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';
import { Op } from 'sequelize';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // média
    if (searchParams.get('media') === '1') {
      const alvo = searchParams.get('alvo'); 
      const id = Number(searchParams.get('id'));
      if (!alvo || !id) return NextResponse.json({ error: 'Parâmetros inválidos para média' }, { status: 400 });

      const isProf = alvo === 'profissional';
      const field = isProf
        ? 'contratacao_proposta_servico_profissional_id'
        : 'contratacao_proposta_servico_cliente_id';

      const media = await models.Avaliacao.findOne({
        where: { [field]: id, do_cliente_para_profissional: isProf },
        attributes: [[models.sequelize.fn('AVG', models.sequelize.col('nota')), 'media']],
        raw: true,
      });

      return NextResponse.json(media);
    }

    const profissionalId = searchParams.get('profissional_id');
    const clienteId = searchParams.get('cliente_id');
    const servicoId = searchParams.get('servico_cliente_id');
    const profPessoaId = searchParams.get('profissional_pessoa_id');
    const doCliente = searchParams.get('do_cliente'); // 0/1

    const where = {};
    if (servicoId) where.contratacao_proposta_servico_cliente_id = Number(servicoId);
    if (profPessoaId) where.contratacao_proposta_servico_profissional_id = Number(profPessoaId);
    if (doCliente !== null && doCliente !== undefined) where.do_cliente_para_profissional = String(doCliente) === '1';

    if (profissionalId) {
      where.contratacao_proposta_servico_profissional_id = Number(profissionalId);
      where.do_cliente_para_profissional = true;

      const list = await models.Avaliacao.findAll({
        where,
        order: [['enviado_em', 'DESC']],
      });

      return NextResponse.json(
        list.map(a => ({
          ...a.toJSON(),
          id: `${a.contratacao_proposta_servico_cliente_id}-${a.contratacao_proposta_servico_profissional_id}-${a.do_cliente_para_profissional ? 1 : 0}`,
        }))
      );
    }

    if (clienteId) {
      const list = await models.Avaliacao.findAll({
        where: { ...(Object.keys(where).length ? where : {}), do_cliente_para_profissional: false },
        include: [{
          model: models.Contratacao,
          as: 'contratacao',
          required: true,
          constraints: false,
          on: {
            '$Avaliacao.contratacao_proposta_servico_cliente_id$': { [Op.col]: 'contratacao.proposta_servico_cliente_id' },
            '$Avaliacao.contratacao_proposta_servico_profissional_id$': { [Op.col]: 'contratacao.proposta_servico_profissional_id' },
          },
          include: [{
            model: models.Proposta,
            as: 'proposta',
            required: true,
            on: {
              '$contratacao.proposta_servico_cliente_id$': { [Op.col]: 'proposta.servico_cliente_id' },
              '$contratacao.proposta_servico_profissional_id$': { [Op.col]: 'proposta.profissional_pessoa_id' },
            },
            include: [{
              model: models.ServicoCliente,
              as: 'demanda',
              required: true,
              where: { pessoa_id: Number(clienteId) },
            }],
          }],
        }],
        order: [['enviado_em', 'DESC']],
      });

      return NextResponse.json(
        list.map(a => ({
          ...a.toJSON(),
          id: `${a.contratacao_proposta_servico_cliente_id}-${a.contratacao_proposta_servico_profissional_id}-${a.do_cliente_para_profissional ? 1 : 0}`,
        }))
      );
    }

    const list = await models.Avaliacao.findAll({ where, order: [['enviado_em', 'DESC']] });
    return NextResponse.json(
      list.map(a => ({
        ...a.toJSON(),
        id: `${a.contratacao_proposta_servico_cliente_id}-${a.contratacao_proposta_servico_profissional_id}-${a.do_cliente_para_profissional ? 1 : 0}`,
      }))
    );
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar avaliações', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();

    const required = [
      'contratacao_proposta_servico_cliente_id',
      'contratacao_proposta_servico_profissional_id',
      'do_cliente_para_profissional',
      'nota',
    ];
    for (const k of required) {
      if (data?.[k] === undefined || data?.[k] === null || data?.[k] === '') {
        await t.rollback();
        return NextResponse.json({ error: `${k} é obrigatório` }, { status: 400 });
      }
    }

    const servicoId = Number(data.contratacao_proposta_servico_cliente_id);
    const profissionalId = Number(data.contratacao_proposta_servico_profissional_id);
    const doCliente = Boolean(data.do_cliente_para_profissional);

    // contratação deve existir
    const contratacao = await models.Contratacao.findOne({
      where: { proposta_servico_cliente_id: servicoId, proposta_servico_profissional_id: profissionalId },
      transaction: t,
    });
    if (!contratacao) {
      await t.rollback();
      return NextResponse.json({ error: 'Contratação não encontrada' }, { status: 404 });
    }

    const exists = await models.Avaliacao.findOne({
      where: {
        contratacao_proposta_servico_cliente_id: servicoId,
        contratacao_proposta_servico_profissional_id: profissionalId,
        do_cliente_para_profissional: doCliente,
      },
      transaction: t,
    });
    if (exists) {
      await t.rollback();
      return NextResponse.json({ error: 'Avaliação já existe' }, { status: 409 });
    }

    const avaliacao = await models.Avaliacao.create(
      {
        contratacao_proposta_servico_cliente_id: servicoId,
        contratacao_proposta_servico_profissional_id: profissionalId,
        do_cliente_para_profissional: doCliente,
        nota: data.nota,
        comentario: data.comentario ?? null,
      },
      { transaction: t }
    );

    await t.commit();

    const id = `${servicoId}-${profissionalId}-${doCliente ? 1 : 0}`;
    return NextResponse.json({ ...avaliacao.toJSON(), id }, { status: 201, headers: { Location: `/api/avaliacoes/${id}` } });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao criar avaliação', details: error.message }, { status: 500 });
  }
}
