import models from '../database/models/index.js';

class ServicoClienteDirecionadoRepository {
  async create(data, transaction = null) {
    return await models.ServicoClienteDirecionado.create(data, { transaction });
  }

  async findByProfissional(profissionalId) {
    return await models.ServicoClienteDirecionado.findAll({
      where: { profissional_pessoa_id: profissionalId },
      include: [{ model: models.ServicoCliente, as: 'servico' }]
    });
  }

  async findSpecific(servicoId, profissionalId) {
    return await models.ServicoClienteDirecionado.findOne({
      where: {
        servico_cliente_id: servicoId,
        profissional_pessoa_id: profissionalId
      }
    });
  }

  async delete(servicoId, profissionalId, transaction = null) {
    return await models.ServicoClienteDirecionado.destroy({
      where: {
        servico_cliente_id: servicoId,
        profissional_pessoa_id: profissionalId
      },
      transaction
    });
  }
}

export default new ServicoClienteDirecionadoRepository();
