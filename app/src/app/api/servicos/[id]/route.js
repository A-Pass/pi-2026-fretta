import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const includeCliente = searchParams.get('cliente') === '1';
    const includeFotos = searchParams.get('fotos') === '1';
    const includePropostas = searchParams.get('propostas') === '1';

    const include = [];

    if (includeCliente) {
      include.push({
        model: models.Pessoa,
        as: 'cliente',
        attributes: ['id', 'primeiro_nome', 'ultimo_nome', 'cpf', 'celular', 'foto_perfil'],
        required: false,
      });
    }

    if (includeFotos) {
      include.push({
        model: models.ServicoClienteFoto,
        as: 'fotos',
        attributes: ['md5', 'uri_img', 'ordem'],
        required: false,
      });
    }

    if (includePropostas) {
      include.push({
        model: models.Proposta,
        as: 'propostas',
        attributes: ['servico_cliente_id', 'profissional_pessoa_id', 'valor_proposta', 'texto_proposta', 'criado_em'],
        required: false,
        include: [
          {
            model: models.Profissional,
            as: 'prestador',
            required: false,
            include: [{ model: models.Pessoa, as: 'pessoa', required: false }],
          },
        ],
      });
    }

    const servico = await models.ServicoCliente.findByPk(params.id, {
      attributes: ['id', 'pessoa_id', 'titulo', 'descricao', 'valor_oferecido', 'status', 'criado_em'],
      include,
    });

    if (!servico) {
      return NextResponse.json({ error: `Serviço ${params.id} não encontrado` }, { status: 404 });
    }

    return NextResponse.json(servico);
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar serviço', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();

    const servico = await models.ServicoCliente.findByPk(params.id, { transaction: t });
    if (!servico) {
      await t.rollback();
      return NextResponse.json({ error: `Serviço ${params.id} não encontrado` }, { status: 404 });
    }

    const payload = {};
    if (data.titulo !== undefined) payload.titulo = String(data.titulo).trim();
    if (data.descricao !== undefined) payload.descricao = String(data.descricao).trim();
    if (data.valor_oferecido !== undefined) payload.valor_oferecido = data.valor_oferecido;
    if (data.status !== undefined) payload.status = data.status;

    await servico.update(payload, { transaction: t });

    if (data.replace_fotos === true) {
      await models.ServicoClienteFoto.destroy({
        where: { servico_cliente_id: servico.id },
        transaction: t,
      });

      if (Array.isArray(data.fotos)) {
        for (const f of data.fotos) {
          if (!f?.md5 || !f?.uri_img) continue;
          await models.ServicoClienteFoto.create(
            {
              servico_cliente_id: servico.id,
              md5: String(f.md5),
              uri_img: String(f.uri_img),
              ordem: f.ordem ? Number(f.ordem) : 1,
            },
            { transaction: t }
          );
        }
      }
    }

    await t.commit();
    return NextResponse.json(servico);
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha ao atualizar serviço', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const servico = await models.ServicoCliente.findByPk(params.id, { transaction: t });
    if (!servico) {
      await t.rollback();
      return NextResponse.json({ error: `Serviço ${params.id} não encontrado` }, { status: 404 });
    }

    await models.ServicoClienteFoto.destroy({
      where: { servico_cliente_id: servico.id },
      transaction: t,
    });

    await servico.destroy({ transaction: t });
    await t.commit();

    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha ao remover serviço', details: error.message },
      { status: 500 }
    );
  }
}
