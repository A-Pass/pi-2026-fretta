import {prisma} from '@/lib/prisma.js';

class CidadeRepository {
  /**
   * @param {String} uf 
   */
  async findByUf(uf) {
    return await models.Cidade.findAll({
      where: { uf },
      order: [['nome', 'ASC']]
    });
  }

  async findById(id) {
    return await models.Cidade.findByPk(id, {
      include: [
        { model: models.UnidadeFederativa, as: 'uf_detalhes' },
        { model: models.Bairro, as: 'bairros' }
      ]
    });
  }

  async findByNameAndUf(nome, uf_sigla) {
    return await prisma.cidade.findUnique({
      where: { uf_sigla_nome: {nome, uf_sigla }}
    });
  }

  async create(nome, uf_sigla, cep_generico = null, transaction = prisma) {
    return await transaction.cidade.create({
      data: {nome, uf_sigla, cep_generico}
    });
  }

  async findAll() {
    return await models.Cidade.findAll({
      order: [['uf', 'ASC'], ['nome', 'ASC']]
    });
  }
}

export default new CidadeRepository();