import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';
import { Op } from 'sequelize';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cpf = searchParams.get('cpf');
    const nome = searchParams.get('nome'); 
    const includeEnderecos = searchParams.get('enderecos') === '1'; 

    const where = {};
    if (cpf) where.cpf = String(cpf).replace(/\D/g, '');

    if (nome) {
      const n = String(nome).trim();
      where[Op.or] = [
        { primeiro_nome: { [Op.iLike]: `%${n}%` } },
        { ultimo_nome: { [Op.iLike]: `%${n}%` } },
      ];
    }

    const include = [];

    if (includeEnderecos) {
      include.push({
        model: models.Endereco,
        as: 'enderecos_lista',
        through: { attributes: ['ordem'] }, 
        required: false,
        include: [
          {
            model: models.Logradouro,
            as: 'logradouro',
            required: false,
            include: [
              {
                model: models.Bairro,
                as: 'bairro',
                required: false,
                include: [{ model: models.Cidade, as: 'cidade', required: false }],
              },
            ],
          },
        ],
      });
    }

    const pessoas = await models.Pessoa.findAll({
      where,
      attributes: ['id', 'primeiro_nome', 'ultimo_nome', 'cpf', 'nascimento', 'celular', 'foto_perfil'],
      include,
      order: [['primeiro_nome', 'ASC'], ['ultimo_nome', 'ASC']],
    });

    return NextResponse.json(pessoas);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao buscar pessoas', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();

    const required = ['primeiro_nome', 'ultimo_nome', 'cpf', 'nascimento', 'celular'];
    for (const k of required) {
      if (!data?.[k]) {
        await t.rollback();
        return NextResponse.json({ error: `${k} é obrigatório` }, { status: 400 });
      }
    }

    const cpf = String(data.cpf).replace(/\D/g, '');

    const cpfExists = await models.Pessoa.findOne({ where: { cpf }, transaction: t });
    if (cpfExists) {
      await t.rollback();
      return NextResponse.json({ error: 'CPF já cadastrado' }, { status: 409 });
    }

    const pessoa = await models.Pessoa.create(
      {
        primeiro_nome: String(data.primeiro_nome).trim(),
        ultimo_nome: String(data.ultimo_nome).trim(),
        cpf,
        nascimento: data.nascimento,
        celular: String(data.celular).trim(),
        foto_perfil: data.foto_perfil ?? null,
      },
      { transaction: t }
    );

    if (Array.isArray(data.enderecos) && data.enderecos.length > 0) {
      for (const item of data.enderecos) {
        if (!item?.endereco_id) continue;
        await models.PessoaEndereco.create(
          {
            pessoa_id: pessoa.id,
            endereco_id: Number(item.endereco_id),
            ordem: item.ordem ? Number(item.ordem) : 1,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    return NextResponse.json(pessoa, {
      status: 201,
      headers: { Location: `/api/pessoas/${pessoa.id}` },
    });
  } catch (error) {
    await t.rollback();
    return NextResponse.json({ error: 'Falha ao criar pessoa', details: error.message }, { status: 500 });
  }
}
