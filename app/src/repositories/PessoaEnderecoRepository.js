import models from '../database/models/index.js';

class PessoaEnderecoRepository {
  /**
   * @param {Object} data 
   */
  async create(data, transaction = null) {
    return await models.PessoaEndereco.create(data, { transaction });
  }

  async findSpecific(pessoaId, enderecoId) {
    return await models.PessoaEndereco.findOne({
      where: {
        pessoa_id: pessoaId,
        endereco_id: enderecoId
      }
    });
  }

  async findByPessoa(pessoaId) {
    return await models.PessoaEndereco.findAll({
      where: { pessoa_id: pessoaId },
      order: [['ordem', 'ASC']],
      include: [
        { 
          model: models.Endereco, 
          include: ['logradouro'] 
        }
      ]
    });
  }

  async updateOrder(pessoaId, enderecoId, novaOrdem, transaction = null) {
    return await models.PessoaEndereco.update(
      { ordem: novaOrdem },
      {
        where: {
          pessoa_id: pessoaId,
          endereco_id: enderecoId
        },
        transaction
      }
    );
  }

  async delete(pessoaId, enderecoId, transaction = null) {
    return await models.PessoaEndereco.destroy({
      where: {
        pessoa_id: pessoaId,
        endereco_id: enderecoId
      },
      transaction
    });
  }
}

export default new PessoaEnderecoRepository();