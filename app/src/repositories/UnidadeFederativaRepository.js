import models from '../database/models/index.js';

class UnidadeFederativaRepository {
  async findAll() {
    return await models.UnidadeFederativa.findAll({
      order: [['nome', 'ASC']]
    });
  }

  async findBySigla(sigla) {
    return await models.UnidadeFederativa.findByPk(sigla.toUpperCase());
  }

  async findByRegiao(regiao) {
    return await models.UnidadeFederativa.findAll({
      where: { regiao },
      order: [['nome', 'ASC']]
    });
  }

  async findWithCidades(sigla) {
    return await models.UnidadeFederativa.findByPk(sigla.toUpperCase(), {
      include: [{ model: models.Cidade, as: 'cidades' }]
    });
  }
}

export default new UnidadeFederativaRepository();
