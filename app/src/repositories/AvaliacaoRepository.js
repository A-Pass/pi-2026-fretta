import models from '../database/models/index.js';
import { Op } from 'sequelize';

class AvaliacaoRepository {
  async create(data, transaction = null) {
    return await models.Avaliacao.create(data, { transaction });
  }

  async findByProfissional(profissionalId) {
    return await models.Avaliacao.findAll({
      where: {
        contratacao_proposta_servico_profissional_id: profissionalId,
        do_cliente_para_profissional: true
      },
      order: [['enviado_em', 'DESC']]
    });
  }

  async findByCliente(clienteId) {
    return await models.Avaliacao.findAll({
      where: { do_cliente_para_profissional: false },
      include: [{
        model: models.Contratacao,
        as: 'contratacao',
        required: true,
        constraints: false,
        on: {
          '$Avaliacao.contratacao_proposta_servico_cliente_id$': { [Op.col]: 'contratacao.proposta_servico_cliente_id' },
          '$Avaliacao.contratacao_proposta_servico_profissional_id$': { [Op.col]: 'contratacao.proposta_servico_profissional_id' }
        },
        include: [{
          model: models.Proposta,
          as: 'proposta',
          required: true,
          on: {
            '$contratacao.proposta_servico_cliente_id$': { [Op.col]: 'proposta.servico_cliente_id' },
            '$contratacao.proposta_servico_profissional_id$': { [Op.col]: 'proposta.profissional_pessoa_id' }
          },
          include: [{
            model: models.ServicoCliente,
            as: 'demanda',
            required: true,
            where: { pessoa_id: clienteId }
          }]
        }]
      }],
      order: [['enviado_em', 'DESC']]
    });
  }

  async findSpecific(servicoId, profissionalId, doCliente) {
    return await models.Avaliacao.findOne({
      where: {
        contratacao_proposta_servico_cliente_id: servicoId,
        contratacao_proposta_servico_profissional_id: profissionalId,
        do_cliente_para_profissional: doCliente
      }
    });
  }

  async getMediaNota(id, isProfissional = true) {
    const field = isProfissional
      ? 'contratacao_proposta_servico_profissional_id'
      : 'contratacao_proposta_servico_cliente_id';

    return await models.Avaliacao.findOne({
      where: {
        [field]: id,
        do_cliente_para_profissional: isProfissional
      },
      attributes: [[models.sequelize.fn('AVG', models.sequelize.col('nota')), 'media']],
      raw: true
    });
  }
}

export default new AvaliacaoRepository();
