import models from '../database/models/index.js';

import { PrismaClient } from '@/generated/prisma/client.js';

const prisma = PrismaClient();

class PessoaRepository {
  async create(dadosPessoa, transaction = null) {
    return await models.Pessoa.create(dadosPessoa, { transaction });
  }

  async findAll() {
    return await models.Pessoa.findAll({
      include: [
        { model: models.Usuario, as: 'usuario' },
        { model: models.Profissional, as: 'profissional' },
        { model: models.Endereco, as: 'enderecos_lista' }
      ]
    });
  }

  async findById(id) {
    return await prisma.pessoa.findUnique({
      where: {
        id: id
      }
    });
  }

  async findByCpf(cpf) {
    return await models.Pessoa.findOne({
      where: { cpf }
    });
  }

  async update(id, novosDados, transaction = null) {
    return await models.Pessoa.update(novosDados, {
      where: { id },
      transaction
    });
  }

  async delete(id, transaction = null) {
    return await models.Pessoa.destroy({
      where: { id },
      transaction
    });
  }
}

export default new PessoaRepository();
