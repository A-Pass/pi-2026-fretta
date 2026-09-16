import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';
import { Op } from 'sequelize';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uf = searchParams.get('uf');
    const nome = searchParams.get('nome');
    const exact = searchParams.get('exact'); 

    const where = {};
    if (uf) where.uf = String(uf).toUpperCase();
    if (nome) {
      const n = String(nome).trim();
      where.nome = exact === '1' ? n : { [Op.iLike]: `%${n}%` };
    }

    const items = await models.Cidade.findAll({
      where,
      attributes: ['id', 'nome', 'uf'],
      order: [['uf', 'ASC'], ['nome', 'ASC']],
    });

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar cidades', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();
    if (!data?.nome || !data?.uf) {
      await t.rollback();
      return NextResponse.json({ error: 'nome e uf são obrigatórios' }, { status: 400 });
    }

    const payload = { nome: String(data.nome).trim(), uf: String(data.uf).toUpperCase() };

    const exists = await models.Cidade.findOne({ where: payload, transaction: t });
    if (exists) {
      await t.rollback();
      return NextResponse.json({ error: 'Cidade já existe (nome + uf)' }, { status: 409 });
    }

    const created = await models.Cidade.create(payload, { transaction: t });
    await t.commit();

    return NextResponse.json(created, { status: 201, headers: { Location: `/api/cidades/${created.id}` } });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao criar cidade', details: error.message }, { status: 500 });
  }
}
