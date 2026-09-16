import models from '../database/models/index.js';
import { Op } from 'sequelize';

class ContratacaoRepository {
  async create(data, transaction = null) {
    return await models.Contratacao.create(data, { transaction });
  }

  async findOne(servicoId, profissionalId) {
    return await models.Contratacao.findOne({
      where: {
        proposta_servico_cliente_id: servicoId,
        proposta_servico_profissional_id: profissionalId
      },
      include: [{
        model: models.Proposta,
        as: 'proposta',
        required: true,
        on: {
          '$Contratacao.proposta_servico_cliente_id$': { [Op.col]: 'proposta.servico_cliente_id' },
          '$Contratacao.proposta_servico_profissional_id$': { [Op.col]: 'proposta.profissional_pessoa_id' }
        },
        include: ['demanda', 'prestador']
      }]
    });
  }

  async findByCliente(clienteId) {
    return await models.Contratacao.findAll({
      include: [{
        model: models.Proposta,
        as: 'proposta',
        required: true,
        on: {
          '$Contratacao.proposta_servico_cliente_id$': { [Op.col]: 'proposta.servico_cliente_id' },
          '$Contratacao.proposta_servico_profissional_id$': { [Op.col]: 'proposta.profissional_pessoa_id' }
        },
        include: [{
          model: models.ServicoCliente,
          as: 'demanda',
          required: true,
          where: { pessoa_id: clienteId }
        }, {
          model: models.Profissional,
          as: 'prestador',
          include: ['pessoa']
        }]
      }],
      order: [['data_hora_agendamento', 'ASC']]
    });
  }

  async findByProfissional(profissionalId) {
    return await models.Contratacao.findAll({
      where: { proposta_servico_profissional_id: profissionalId },
      include: [{
        model: models.Proposta,
        as: 'proposta',
        required: true,
        on: {
          '$Contratacao.proposta_servico_cliente_id$': { [Op.col]: 'proposta.servico_cliente_id' },
          '$Contratacao.proposta_servico_profissional_id$': { [Op.col]: 'proposta.profissional_pessoa_id' }
        },
        include: ['demanda']
      }],
      order: [['data_hora_agendamento', 'ASC']]
    });
  }

  async updateStatus(servicoId, profissionalId, status, transaction = null) {
    return await models.Contratacao.update(
      { status },
      {
        where: {
          proposta_servico_cliente_id: servicoId,
          proposta_servico_profissional_id: profissionalId
        },
        transaction
      }
    );
  }
}

export default new ContratacaoRepository();
