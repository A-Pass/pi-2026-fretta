import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';
import { Op } from 'sequelize';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bairro_id = searchParams.get('bairro_id');
    const cep = searchParams.get('cep');
    const nome = searchParams.get('nome');

    const where = {};
    if (bairro_id) where.bairro_id = Number(bairro_id);
    if (cep) where.cep = String(cep).replace(/\D/g, '');
    if (nome) where.nome = { [Op.iLike]: `%${String(nome).trim()}%` };

    const items = await models.Logradouro.findAll({
      where,
      include: [
        {
          model: models.Bairro,
          as: 'bairro',
          required: false,
          include: [{ model: models.Cidade, as: 'cidade', required: false }],
        },
      ],
      order: [['nome', 'ASC']],
    });

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar logradouros', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();
    if (!data?.nome || !data?.cep || !data?.bairro_id) {
      await t.rollback();
      return NextResponse.json({ error: 'nome, cep e bairro_id são obrigatórios' }, { status: 400 });
    }

    const payload = {
      nome: String(data.nome).trim(),
      cep: String(data.cep).replace(/\D/g, ''),
      bairro_id: Number(data.bairro_id),
    };

    const created = await models.Logradouro.create(payload, { transaction: t });
    await t.commit();

    return NextResponse.json(created, { status: 201, headers: { Location: `/api/logradouros/${created.id}` } });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao criar logradouro', details: error.message }, { status: 500 });
  }
}
