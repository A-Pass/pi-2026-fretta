import { NextResponse } from 'next/server';
import { models } from '@/database/models';
import { Op } from 'sequelize';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get('cliente_id');
    const profissionalId = searchParams.get('profissional_id');
    const status = searchParams.get('status');
    const de = searchParams.get('de');
    const ate = searchParams.get('ate');
    const include = searchParams.get('include') === '1';

    const where = {};
    if (profissionalId) where.proposta_servico_profissional_id = Number(profissionalId);
    if (status) where.status = status;

    if (de || ate) {
      where.data_hora_agendamento = {};
      if (de) where.data_hora_agendamento[Op.gte] = new Date(de);
      if (ate) where.data_hora_agendamento[Op.lte] = new Date(ate);
    }

    const includeArr = [];
    if (include || clienteId) {
      includeArr.push({
        model: models.Proposta,
        as: 'proposta',
        required: true,
        on: {
          '$Contratacao.proposta_servico_cliente_id$': { [Op.col]: 'proposta.servico_cliente_id' },
          '$Contratacao.proposta_servico_profissional_id$': { [Op.col]: 'proposta.profissional_pessoa_id' },
        },
        include: [
          {
            model: models.ServicoCliente,
            as: 'demanda',
            required: Boolean(clienteId),
            ...(clienteId ? { where: { pessoa_id: Number(clienteId) } } : {}),
          },
          {
            model: models.Profissional,
            as: 'prestador',
            required: false,
            include: [{ model: models.Pessoa, as: 'pessoa', required: false }],
          },
        ],
      });
    }

    const rows = await models.Contratacao.findAll({
      where,
      include: includeArr,
      order: [['data_hora_agendamento', 'ASC']],
    });

    return NextResponse.json(
      rows.map(r => ({
        ...r.toJSON(),
        id: `${r.proposta_servico_cliente_id}-${r.proposta_servico_profissional_id}`,
      }))
    );
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar agendamentos', details: error.message }, { status: 500 });
  }
}
