import models from '../database/models/index.js';

class ProfissionalRepository {

  async create(data, transaction = null) {
    return await models.Profissional.create(data, { transaction });
  }

  async findById(pessoaId) {
    return await models.Profissional.findByPk(pessoaId, {
      include: [
        { model: models.Pessoa, as: 'pessoa' },
        { model: models.ServicoProfissional, as: 'servicos' }
      ]
    });
  }

  async findAll() {
    return await models.Profissional.findAll({
      include: [{ model: models.Pessoa, as: 'pessoa' }]
    });
  }

  async update(pessoaId, data, transaction = null) {
    return await models.Profissional.update(data, {
      where: { pessoa_id: pessoaId },
      transaction
    });
  }
  
  async delete(pessoaId, transaction = null) {
    return await models.Profissional.destroy({
      where: { pessoa_id: pessoaId },
      transaction
    });
  }
}

export default new ProfissionalRepository();