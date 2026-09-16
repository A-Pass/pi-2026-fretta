import models from '../database/models/index.js';

class PessoaJuridicaRepository {
  /**
   * @param {Object} data 
   */
  async create(data, transaction = null) {
    return await models.PessoaJuridica.create(data, { transaction });
  }

  async findByPessoaId(pessoaId) {
    return await models.PessoaJuridica.findByPk(pessoaId, {
      include: [{ model: models.Pessoa, as: 'dados_pessoais' }]
    });
  }

  async findByCnpj(cnpj) {
    return await models.PessoaJuridica.findOne({
      where: { cnpj }
    });
  }

  async update(pessoaId, data, transaction = null) {
    return await models.PessoaJuridica.update(data, {
      where: { pessoa_id: pessoaId },
      transaction
    });
  }

  async delete(pessoaId, transaction = null) {
    return await models.PessoaJuridica.destroy({
      where: { pessoa_id: pessoaId },
      transaction
    });
  }
}

export default new PessoaJuridicaRepository();