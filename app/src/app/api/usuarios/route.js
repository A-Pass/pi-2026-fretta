import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';
import PasswordCrypt from '@/helpers/PasswordCrypt';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const pessoaId = searchParams.get('pessoa_id');
    const includePessoa = searchParams.get('pessoa') === '1'; 

    const where = {};
    if (email) where.email = String(email).trim().toLowerCase();
    if (pessoaId) where.pessoa_id = Number(pessoaId);

    const include = [];
    if (includePessoa) {
      include.push({
        model: models.Pessoa,
        as: 'pessoa',
        attributes: ['id', 'primeiro_nome', 'ultimo_nome', 'cpf', 'celular'],
        required: false,
      });
    }

    const usuarios = await models.Usuario.findAll({
      where,
      attributes: ['id', 'email', 'pessoa_id', 'criado_em', 'atualizado_em'],
      include,
      order: [['email', 'ASC']],
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar usuários', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();

    if (!data?.email || !data?.senha || !data?.pessoa_id) {
      await t.rollback();
      return NextResponse.json(
        { error: 'email, senha e pessoa_id são obrigatórios' },
        { status: 400 }
      );
    }

    const email = String(data.email).trim().toLowerCase();

    const emailExists = await models.Usuario.findOne({ where: { email }, transaction: t });
    if (emailExists) {
      await t.rollback();
      return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 409 });
    }

    const pessoa = await models.Pessoa.findByPk(Number(data.pessoa_id), { transaction: t });
    if (!pessoa) {
      await t.rollback();
      return NextResponse.json(
        { error: `Pessoa ${data.pessoa_id} não encontrada` },
        { status: 404 }
      );
    }

    const usuario = await models.Usuario.create(
      {
        email,
        senha: PasswordCrypt.encrypt(String(data.senha)),
        pessoa_id: Number(data.pessoa_id),
      },
      { transaction: t }
    );

    await t.commit();

    return NextResponse.json(
      { id: usuario.id, email: usuario.email, pessoa_id: usuario.pessoa_id, criado_em: usuario.criado_em, atualizado_em: usuario.atualizado_em },
      {
        status: 201,
        headers: { Location: `/api/usuarios/${usuario.id}` },
      }
    );
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha ao criar usuário', details: error.message },
      { status: 500 }
    );
  }
}
