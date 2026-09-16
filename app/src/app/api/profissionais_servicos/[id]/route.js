import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const includePrestador = searchParams.get('prestador') === '1'; 

    const include = [];
    if (includePrestador) {
      include.push({
        model: models.Profissional,
        as: 'prestador',
        required: false,
        include: [{ model: models.Pessoa, as: 'pessoa', required: false }],
      });
    }

    const servico = await models.ServicoProfissional.findByPk(params.id, {
      attributes: [
        'id',
        'profissional_pessoa_id',
        'titulo',
        'descricao',
        'preco_base',
        'excluido_em',
        'criado_em',
        'atualizado_em',
      ],
      include,
    });

    if (!servico) {
      return NextResponse.json(
        { error: `Serviço profissional ${params.id} não encontrado` },
        { status: 404 }
      );
    }

    return NextResponse.json(servico);
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar serviço do profissional', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();

    const servico = await models.ServicoProfissional.findByPk(params.id, { transaction: t });
    if (!servico) {
      await t.rollback();
      return NextResponse.json(
        { error: `Serviço profissional ${params.id} não encontrado` },
        { status: 404 }
      );
    }

    const payload = {};
    if (data.titulo !== undefined) payload.titulo = String(data.titulo).trim();
    if (data.descricao !== undefined) payload.descricao = String(data.descricao).trim();
    if (data.preco_base !== undefined) payload.preco_base = data.preco_base;

    if (data.profissional_pessoa_id !== undefined) {
      const prof = await models.Profissional.findByPk(Number(data.profissional_pessoa_id), {
        transaction: t,
      });
      if (!prof) {
        await t.rollback();
        return NextResponse.json(
          { error: `Profissional ${data.profissional_pessoa_id} não encontrado` },
          { status: 404 }
        );
      }
      payload.profissional_pessoa_id = Number(data.profissional_pessoa_id);
    }

    await servico.update(payload, { transaction: t });
    await t.commit();

    return NextResponse.json(servico);
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha ao atualizar serviço do profissional', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const servico = await models.ServicoProfissional.findByPk(params.id, { transaction: t });
    if (!servico) {
      await t.rollback();
      return NextResponse.json(
        { error: `Serviço profissional ${params.id} não encontrado` },
        { status: 404 }
      );
    }

    await servico.update({ excluido_em: new Date() }, { transaction: t });
    await t.commit();

    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha ao remover serviço do profissional', details: error.message },
      { status: 500 }
    );
  }
}
