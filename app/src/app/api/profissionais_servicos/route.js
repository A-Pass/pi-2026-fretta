import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';
import { Op } from 'sequelize';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const profissionalId = searchParams.get('profissional_id'); 
    const termo = searchParams.get('q'); 
    const includePrestador = searchParams.get('prestador') === '1'; 
    const incluirExcluidos = searchParams.get('excluidos') === '1'; 

    const where = {};

    if (profissionalId) where.profissional_pessoa_id = Number(profissionalId);
    if (!incluirExcluidos) where.excluido_em = null;

    if (termo) {
      where.titulo = { [Op.iLike]: `%${String(termo).trim()}%` };
    }

    const include = [];
    if (includePrestador) {
      include.push({
        model: models.Profissional,
        as: 'prestador',
        required: false,
        include: [{ model: models.Pessoa, as: 'pessoa', required: false }],
      });
    }

    const servicos = await models.ServicoProfissional.findAll({
      where,
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
      order: [['titulo', 'ASC']],
    });

    return NextResponse.json(servicos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar serviços do profissional', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();

    const required = ['profissional_pessoa_id', 'titulo', 'descricao', 'preco_base'];
    for (const k of required) {
      if (data?.[k] === undefined || data?.[k] === null || data?.[k] === '') {
        await t.rollback();
        return NextResponse.json({ error: `${k} é obrigatório` }, { status: 400 });
      }
    }

    const profissional = await models.Profissional.findByPk(Number(data.profissional_pessoa_id), {
      transaction: t,
    });
    if (!profissional) {
      await t.rollback();
      return NextResponse.json(
        { error: `Profissional ${data.profissional_pessoa_id} não encontrado` },
        { status: 404 }
      );
    }

    const servico = await models.ServicoProfissional.create(
      {
        profissional_pessoa_id: Number(data.profissional_pessoa_id),
        titulo: String(data.titulo).trim(),
        descricao: String(data.descricao).trim(),
        preco_base: data.preco_base,
      },
      { transaction: t }
    );

    await t.commit();

    return NextResponse.json(servico, {
      status: 201,
      headers: { Location: `/api/profissionais_servicos/${servico.id}` },
    });
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha ao criar serviço do profissional', details: error.message },
      { status: 500 }
    );
  }
}
