import {prisma} from '@/lib/prisma.js';

const defaultInclude = {
  bairro: {
    include: {
      cidade: {
        include: {
          uf: true,
        },
      },
    }
  }
};

class LogradouroRepository {

  async findByCep(cep) {
    return await prisma.logradouro.findUnique({
      where: { cep },
      include: defaultInclude
    });
  }

  async create(bairro_id, nome, cep, transaction = prisma) {
    return await transaction.Logradouro.create({
      data: { bairro_id, nome, cep },
      include: defaultInclude
    });
  }

  async findById(id) {
    return await models.Logradouro.findByPk(id, {
      include: ['bairro']
    });
  }

  async findByNomeAndBairro(nome, bairro_id) {
    return await prisma.logradouro.findUnique({
      where: { bairro_id_nome: {nome, bairro_id }},
      include: defaultInclude
    });
  }

  async update(id, data, transaction = null) {
    return await models.Logradouro.update(data, {
      where: { id },
      transaction
    });
  }
}

export default new LogradouroRepository();