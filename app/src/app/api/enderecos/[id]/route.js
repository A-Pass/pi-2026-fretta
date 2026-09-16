import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';

export async function GET(request, { params }) {
  try {
    const item = await models.Endereco.findByPk(params.id, {
      include: [
        {
          model: models.Logradouro,
          as: 'logradouro',
          required: false,
          include: [{ model: models.Bairro, as: 'bairro', required: false, include: [{ model: models.Cidade, as: 'cidade', required: false }] }],
        },
        { model: models.Pessoa, as: 'moradores', required: false },
      ],
    });

    if (!item) return NextResponse.json({ error: `Endereço ${params.id} não encontrado` }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar endereço', details: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();

    const item = await models.Endereco.findByPk(params.id, { transaction: t });
    if (!item) {
      await t.rollback();
      return NextResponse.json({ error: `Endereço ${params.id} não encontrado` }, { status: 404 });
    }

    const payload = {};
    if (data.logradouro_id !== undefined) payload.logradouro_id = Number(data.logradouro_id);
    if (data.numero !== undefined) payload.numero = String(data.numero).trim();
    if (data.complemento !== undefined) payload.complemento = data.complemento ?? null;

    await item.update(payload, { transaction: t });
    await t.commit();
    return NextResponse.json(item);
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao atualizar endereço', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const item = await models.Endereco.findByPk(params.id, { transaction: t });
    if (!item) {
      await t.rollback();
      return NextResponse.json({ error: `Endereço ${params.id} não encontrado` }, { status: 404 });
    }
    await item.destroy({ transaction: t });
    await t.commit();
    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao remover endereço', details: error.message }, { status: 500 });
  }
}
