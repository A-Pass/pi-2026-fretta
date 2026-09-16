import models from '../database/models/index.js';

class NotificacaoRepository {
  /**
   * @param {Object} data 
   */
  async create(data, transaction = null) {
    return await models.Notificacao.create(data, { transaction });
  }

  async findByPessoa(pessoaId) {
    return await models.Notificacao.findAll({
      where: { pessoa_id: pessoaId },
      order: [['enviado_em', 'DESC']]
    });
  }

  async findLatest(pessoaId, limit = 10) {
    return await models.Notificacao.findAll({
      where: { pessoa_id: pessoaId },
      order: [['enviado_em', 'DESC']],
      limit: limit
    });
  }

  async delete(id, transaction = null) {
    return await models.Notificacao.destroy({
      where: { id },
      transaction
    });
  }

  async clearAll(pessoaId, transaction = null) {
    return await models.Notificacao.destroy({
      where: { pessoa_id: pessoaId },
      transaction
    });
  }
}

export default new NotificacaoRepository();