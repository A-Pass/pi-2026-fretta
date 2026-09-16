import { NextResponse } from 'next/server';
import { models, sequelize } from '@/database/models';
import { Op } from 'sequelize';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const pessoaId = searchParams.get('pessoa_id');      
    const status = searchParams.get('status');           
    const q = searchParams.get('q');                     
    const includeCliente = searchParams.get('cliente') === '1';      
    const includeFotos = searchParams.get('fotos') === '1';          
    const includePropostas = searchParams.get('propostas') === '1';  

    const where = {};
    if (pessoaId) where.pessoa_id = Number(pessoaId);
    if (status) where.status = status;

    if (q) {
      const term = String(q).trim();
      where[Op.or] = [
        { titulo: { [Op.iLike]: `%${term}%` } },
        { descricao: { [Op.iLike]: `%${term}%` } },
      ];
    }

    const include = [];

    if (includeCliente) {
      include.push({
        model: models.Pessoa,
        as: 'cliente',
        attributes: ['id', 'primeiro_nome', 'ultimo_nome', 'cpf', 'celular', 'foto_perfil'],
        required: false,
      });
    }

    if (includeFotos) {
      include.push({
        model: models.ServicoClienteFoto,
        as: 'fotos', 
        attributes: ['md5', 'uri_img', 'ordem'],
        required: false,
      });
    }

    if (includePropostas) {
      include.push({
        model: models.Proposta,
        as: 'propostas', 
        attributes: ['servico_cliente_id', 'profissional_pessoa_id', 'valor_proposta', 'texto_proposta', 'criado_em'],
        required: false,
        include: [
          {
            model: models.Profissional,
            as: 'prestador',
            required: false,
            include: [{ model: models.Pessoa, as: 'pessoa', required: false }],
          },
        ],
      });
    }

    const servicos = await models.ServicoCliente.findAll({
      where,
      attributes: ['id', 'pessoa_id', 'titulo', 'descricao', 'valor_oferecido', 'status', 'criado_em'],
      include,
      order: [['criado_em', 'DESC']],
    });

    return NextResponse.json(servicos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Falha ao buscar serviços', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const t = await sequelize.transaction();
  try {
    const data = await request.json();

    const required = ['pessoa_id', 'titulo', 'descricao'];
    for (const k of required) {
      if (!data?.[k]) {
        await t.rollback();
        return NextResponse.json({ error: `${k} é obrigatório` }, { status: 400 });
      }
    }

    const cliente = await models.Pessoa.findByPk(Number(data.pessoa_id), { transaction: t });
    if (!cliente) {
      await t.rollback();
      return NextResponse.json({ error: `Pessoa ${data.pessoa_id} não encontrada` }, { status: 404 });
    }

    const servico = await models.ServicoCliente.create(
      {
        pessoa_id: Number(data.pessoa_id),
        titulo: String(data.titulo).trim(),
        descricao: String(data.descricao).trim(),
        valor_oferecido: data.valor_oferecido ?? null,
        status: data.status ?? 'ABERTO',
      },
      { transaction: t }
    );

    if (Array.isArray(data.fotos) && data.fotos.length > 0) {
      for (const f of data.fotos) {
        if (!f?.md5 || !f?.uri_img) continue;
        await models.ServicoClienteFoto.create(
          {
            servico_cliente_id: servico.id,
            md5: String(f.md5),
            uri_img: String(f.uri_img),
            ordem: f.ordem ? Number(f.ordem) : 1,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();

    return NextResponse.json(servico, {
      status: 201,
      headers: { Location: `/api/servicos/${servico.id}` },
    });
  } catch (error) {
    await t.rollback();
    return NextResponse.json(
      { error: 'Falha ao criar serviço', details: error.message },
      { status: 500 }
    );
  }
}
