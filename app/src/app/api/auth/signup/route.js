import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';
import PasswordCrypt from '@/helpers/PasswordCrypt';

export async function POST(request) {
  const t = await sequelize.transaction();

  try {
    const body = await request.json();

    const required = [
      'primeiro_nome',
      'ultimo_nome',
      'cpf',
      'nascimento',
      'celular',
      'email',
      'senha'
    ];

    for (const k of required) {
      if (!body?.[k]) {
        await t.rollback();
        return NextResponse.json(
          { error: `${k} é obrigatório` },
          { status: 400 }
        );
      }
    }

    const email = body.email.trim().toLowerCase();

    const emailExists = await models.Usuario.findOne({
      where: { email },
      transaction: t
    });

    if (emailExists) {
      await t.rollback();
      return NextResponse.json(
        { error: 'E-mail já cadastrado' },
        { status: 409 }
      );
    }

    const cpf = body.cpf.replace(/\D/g, '');

    const cpfExists = await models.Pessoa.findOne({
      where: { cpf },
      transaction: t
    });

    if (cpfExists) {
      await t.rollback();
      return NextResponse.json(
        { error: 'CPF já cadastrado' },
        { status: 409 }
      );
    }

    const pessoa = await models.Pessoa.create(
      {
        primeiro_nome: body.primeiro_nome.trim(),
        ultimo_nome: body.ultimo_nome.trim(),
        cpf,
        nascimento: body.nascimento,
        celular: body.celular.trim(),
        foto_perfil: body.foto_perfil ?? null
      },
      { transaction: t }
    );

    const usuario = await models.Usuario.create(
      {
        email,
        senha: PasswordCrypt.encrypt(body.senha),
        pessoa_id: pessoa.id
      },
      { transaction: t }
    );

    await t.commit();

    return NextResponse.json(
      {
        usuario: {
          id: usuario.id,
          email: usuario.email,
          pessoa_id: usuario.pessoa_id
        },
        pessoa
      },
      { status: 201 }
    );
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha no cadastro', details: error.message },
      { status: 500 }
    );
  }
}
