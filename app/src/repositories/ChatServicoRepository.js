import models from '../database/models/index.js';

class ChatServicoRepository {
  /**
   * @param {Object} data 
   */
  async create(data, transaction = null) {
    return await models.ChatServico.create(data, { transaction });
  }

  async getHistorico(servicoId, profissionalId) {
    return await models.ChatServico.findAll({
      where: {
        proposta_servico_cliente_id: servicoId,
        proposta_servico_profissional_id: profissionalId
      },
      order: [['enviado_em', 'ASC']]
    });
  }

  async findLastMessage(servicoId, profissionalId) {
    return await models.ChatServico.findOne({
      where: {
        proposta_servico_cliente_id: servicoId,
        proposta_servico_profissional_id: profissionalId
      },
      order: [['enviado_em', 'DESC']]
    });
  }

  async deleteChatHistory(servicoId, profissionalId, transaction = null) {
    return await models.ChatServico.destroy({
      where: {
        proposta_servico_cliente_id: servicoId,
        proposta_servico_profissional_id: profissionalId
      },
      transaction
    });
  }
}

export default new ChatServicoRepository();