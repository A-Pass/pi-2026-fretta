import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';
import { Op } from 'sequelize';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cidade_id = searchParams.get('cidade_id');
    const nome = searchParams.get('nome');
    const exact = searchParams.get('exact');

    const where = {};
    if (cidade_id) where.cidade_id = Number(cidade_id);
    if (nome) {
      const n = String(nome).trim();
      where.nome = exact === '1' ? n : { [Op.iLike]: `%${n}%` };
    }

    const items = await models.Bairro.findAll({
      where,
      include: [{ model: models.Cidade, as: 'cidade', required: false }],
      order: [['nome', 'ASC']],
    });

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar bairros', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();
    if (!data?.nome || !data?.cidade_id) {
      await t.rollback();
      return NextResponse.json({ error: 'nome e cidade_id são obrigatórios' }, { status: 400 });
    }

    const payload = { nome: String(data.nome).trim(), cidade_id: Number(data.cidade_id) };

    const exists = await models.Bairro.findOne({ where: payload, transaction: t });
    if (exists) {
      await t.rollback();
      return NextResponse.json({ error: 'Bairro já existe (nome + cidade_id)' }, { status: 409 });
    }

    const created = await models.Bairro.create(payload, { transaction: t });
    await t.commit();

    return NextResponse.json(created, { status: 201, headers: { Location: `/api/bairros/${created.id}` } });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao criar bairro', details: error.message }, { status: 500 });
  }
}
