import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pessoaId = searchParams.get('pessoa_id');
    const cnpj = searchParams.get('cnpj');

    const where = {};
    if (pessoaId) where.pessoa_id = Number(pessoaId);
    if (cnpj) where.cnpj = String(cnpj).replace(/\D/g, '');

    const pessoasJuridicas = await models.PessoaJuridica.findAll({
      where,
      attributes: ['pessoa_id', 'cnpj', 'razao_social'],
      include: [
        {
          model: models.Pessoa,
          as: 'dados_pessoais',
          attributes: ['id', 'primeiro_nome', 'ultimo_nome', 'cpf', 'celular'],
          required: false,
        },
      ],
      order: [['razao_social', 'ASC']],
    });

    return NextResponse.json(pessoasJuridicas);
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar pessoas jurídicas', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();

    if (!data?.pessoa_id || !data?.razao_social || !data?.cnpj) {
      await t.rollback();
      return NextResponse.json(
        { error: 'pessoa_id, razao_social e cnpj são obrigatórios' },
        { status: 400 }
      );
    }

    const pessoaId = Number(data.pessoa_id);
    const cnpj = String(data.cnpj).replace(/\D/g, '');

    const pessoa = await models.Pessoa.findByPk(pessoaId, { transaction: t });
    if (!pessoa) {
      await t.rollback();
      return NextResponse.json(
        { error: `Pessoa ${pessoaId} não encontrada` },
        { status: 404 }
      );
    }

    const already = await models.PessoaJuridica.findByPk(pessoaId, { transaction: t });
    if (already) {
      await t.rollback();
      return NextResponse.json(
        { error: 'Essa pessoa já possui cadastro de Pessoa Jurídica' },
        { status: 409 }
      );
    }

    const cnpjExists = await models.PessoaJuridica.findOne({ where: { cnpj }, transaction: t });
    if (cnpjExists) {
      await t.rollback();
      return NextResponse.json(
        { error: 'CNPJ já cadastrado' },
        { status: 409 }
      );
    }

    const pessoaJuridica = await models.PessoaJuridica.create(
      {
        pessoa_id: pessoaId,
        razao_social: String(data.razao_social).trim(),
        cnpj,
      },
      { transaction: t }
    );

    await t.commit();

    return NextResponse.json(pessoaJuridica, {
      status: 201,
      headers: { Location: `/api/pessoas_juridicas/${pessoaJuridica.pessoa_id}` },
    });
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha ao criar pessoa jurídica', details: error.message },
      { status: 500 }
    );
  }
}
