import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';

export async function GET(request, { params }) {
  try {
    const pessoaJuridica = await models.PessoaJuridica.findByPk(params.pessoa_id, {
      attributes: ['pessoa_id', 'cnpj', 'razao_social'],
      include: [
        {
          model: models.Pessoa,
          as: 'dados_pessoais',
          attributes: ['id', 'primeiro_nome', 'ultimo_nome', 'cpf', 'celular'],
          required: false,
        },
      ],
    });

    if (!pessoaJuridica) {
      return NextResponse.json(
        { error: `Pessoa jurídica da pessoa ${params.pessoa_id} não encontrada` },
        { status: 404 }
      );
    }

    return NextResponse.json(pessoaJuridica);
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar pessoa jurídica', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();

    const pj = await models.PessoaJuridica.findByPk(params.pessoa_id, { transaction: t });
    if (!pj) {
      await t.rollback();
      return NextResponse.json(
        { error: `Pessoa jurídica da pessoa ${params.pessoa_id} não encontrada` },
        { status: 404 }
      );
    }

    const payload = {};
    if (data.razao_social !== undefined) payload.razao_social = String(data.razao_social).trim();
    if (data.cnpj !== undefined) payload.cnpj = String(data.cnpj).replace(/\D/g, '');

    if (payload.cnpj) {
      const exists = await models.PessoaJuridica.findOne({
        where: { cnpj: payload.cnpj },
        transaction: t,
      });

      if (exists && String(exists.pessoa_id) !== String(params.pessoa_id)) {
        await t.rollback();
        return NextResponse.json({ error: 'CNPJ já cadastrado' }, { status: 409 });
      }
    }

    await pj.update(payload, { transaction: t });
    await t.commit();

    return NextResponse.json(pj);
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha ao atualizar pessoa jurídica', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const pj = await models.PessoaJuridica.findByPk(params.pessoa_id, { transaction: t });
    if (!pj) {
      await t.rollback();
      return NextResponse.json(
        { error: `Pessoa jurídica da pessoa ${params.pessoa_id} não encontrada` },
        { status: 404 }
      );
    }

    await pj.destroy({ transaction: t });
    await t.commit();

    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha ao remover pessoa jurídica', details: error.message },
      { status: 500 }
    );
  }
}
