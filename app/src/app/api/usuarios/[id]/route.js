import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';
import PasswordCrypt from '@/helpers/PasswordCrypt';

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const includePessoa = searchParams.get('pessoa') === '1'; 

    const include = [];
    if (includePessoa) {
      include.push({
        model: models.Pessoa,
        as: 'pessoa',
        attributes: ['id', 'primeiro_nome', 'ultimo_nome', 'cpf', 'celular'],
        required: false,
      });
    }

    const usuario = await models.Usuario.findByPk(params.id, {
      attributes: ['id', 'email', 'pessoa_id', 'criado_em', 'atualizado_em'],
      include,
    });

    if (!usuario) {
      return NextResponse.json(
        { error: `Usuário ${params.id} não encontrado` },
        { status: 404 }
      );
    }

    return NextResponse.json(usuario);
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar usuário', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();

    const usuario = await models.Usuario.findByPk(params.id, { transaction: t });
    if (!usuario) {
      await t.rollback();
      return NextResponse.json(
        { error: `Usuário ${params.id} não encontrado` },
        { status: 404 }
      );
    }

    const payload = {};

    if (data.email !== undefined) {
      payload.email = String(data.email).trim().toLowerCase();

      // checa duplicidade
      const exists = await models.Usuario.findOne({ where: { email: payload.email }, transaction: t });
      if (exists && String(exists.id) !== String(usuario.id)) {
        await t.rollback();
        return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 409 });
      }
    }

    if (data.senha !== undefined) {
      payload.senha = PasswordCrypt.encrypt(String(data.senha));
    }

    if (data.pessoa_id !== undefined) {
      const pessoa = await models.Pessoa.findByPk(Number(data.pessoa_id), { transaction: t });
      if (!pessoa) {
        await t.rollback();
        return NextResponse.json(
          { error: `Pessoa ${data.pessoa_id} não encontrada` },
          { status: 404 }
        );
      }
      payload.pessoa_id = Number(data.pessoa_id);
    }

    await usuario.update(payload, { transaction: t });
    await t.commit();

    return NextResponse.json({
      id: usuario.id,
      email: usuario.email,
      pessoa_id: usuario.pessoa_id,
      criado_em: usuario.criado_em,
      atualizado_em: usuario.atualizado_em,
    });
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha ao atualizar usuário', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const t = await sequelize.transaction();
  try {
    const usuario = await models.Usuario.findByPk(params.id, { transaction: t });
    if (!usuario) {
      await t.rollback();
      return NextResponse.json(
        { error: `Usuário ${params.id} não encontrado` },
        { status: 404 }
      );
    }

    await usuario.destroy({ transaction: t });
    await t.commit();

    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha ao remover usuário', details: error.message },
      { status: 500 }
    );
  }
}
