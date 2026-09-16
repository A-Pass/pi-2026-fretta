import { prisma } from '@/lib/prisma';

class ServicoClienteFotoRepository {
  /**
   * @param {Object} data 
   */
  async create(data, transaction = null) {
    return await models.ServicoClienteFoto.create(data, { transaction });
  }

  async findByServico(servicoId) {
    return await models.ServicoClienteFoto.findAll({
      where: { servico_cliente_id: servicoId },
      order: [['ordem', 'ASC']]
    });
  }

  async findSpecific(servico_cliente_id, md5) {
    return await prisma.servico_cliente_foto.findUnique({
      where: {
        servico_cliente_id_md5: {servico_cliente_id, md5 }}
    });
  }

  async delete(servicoId, md5, transaction = null) {
    return await models.ServicoClienteFoto.destroy({
      where: {
        servico_cliente_id: servicoId,
        md5: md5
      },
      transaction
    });
  }

  async deleteAllFromServico(servicoId, transaction = null) {
    return await models.ServicoClienteFoto.destroy({
      where: { servico_cliente_id: servicoId },
      transaction
    });
  }
}

export default new ServicoClienteFotoRepository();