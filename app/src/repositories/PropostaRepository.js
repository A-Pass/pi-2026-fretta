import models from '../database/models/index.js';

class PropostaRepository {
  /**
   * @param {Object} data 
   */
  async create(data, transaction = null) {
    return await models.Proposta.create(data, { transaction });
  }

  async findByServico(servicoId) {
    return await models.Proposta.findAll({
      where: { servico_cliente_id: servicoId },
      include: [
        { 
          model: models.Profissional, 
          as: 'prestador',
          include: ['pessoa'] 
        }
      ],
      order: [['criado_em', 'DESC']]
    });
  }

  async findByProfissional(profissionalId) {
    return await models.Proposta.findAll({
      where: { profissional_pessoa_id: profissionalId },
      include: [{ model: models.ServicoCliente, as: 'demanda' }],
      order: [['criado_em', 'DESC']]
    });
  }

  async findOne(servicoId, profissionalId) {
    return await models.Proposta.findOne({
      where: {
        servico_cliente_id: servicoId,
        profissional_pessoa_id: profissionalId
      },
      include: ['demanda', 'prestador']
    });
  }

  async update(servicoId, profissionalId, data, transaction = null) {
    return await models.Proposta.update(data, {
      where: {
        servico_cliente_id: servicoId,
        profissional_pessoa_id: profissionalId
      },
      transaction
    });
  }

  async delete(servicoId, profissionalId, transaction = null) {
    return await models.Proposta.destroy({
      where: {
        servico_cliente_id: servicoId,
        profissional_pessoa_id: profissionalId
      },
      transaction
    });
  }
}

export default new PropostaRepository();