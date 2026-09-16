import {prisma} from '@/lib/prisma.js'

class BairroRepository {

  async create(nome, cidade_id, transaction = prisma) {
    return await transaction.bairro.create({data: {nome, cidade_id}});
  }

  async findById(id) {
    return await models.Bairro.findByPk(id, {
      include: [{ model: models.Cidade, as: 'cidade' }]
    });
  }

  async findByCidade(cidadeId) {
    return await models.Bairro.findAll({
      where: { cidade_id: cidadeId },
      order: [['nome', 'ASC']] 
    });
  }

  async findByNameAndCidade(nome, cidade_id) {
    return await prisma.bairro.findUnique({
      where: { cidade_id_nome: {nome, cidade_id}}
    });
  }

  async update(id, data, transaction = null) {
    return await models.Bairro.update(data, {
      where: { id },
      transaction
    });
  }
}

export default new BairroRepository();