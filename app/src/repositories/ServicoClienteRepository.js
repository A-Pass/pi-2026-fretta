import { prisma } from "@/lib/prisma";

class ServicoClienteRepository {

  async create(pessoa_id, titulo, descricao, data_hora_agendamento, valor_oferecido, arquivos, transaction = prisma) {

    return await transaction.servico_cliente.create({
      data: {
        pessoa_id, titulo, descricao, data_hora_agendamento, valor_oferecido, 
        fotos: {
          create: arquivos
        }
      }
    });
  }

  async findById(id) {
    return await prisma.servico_cliente.findUnique({
      where:{id},
      include: {
        fotos: true
      }
    });
  }

  async findOpenServices(pessoa_id) {
    return await prisma.servico_cliente.findMany({
      where: { status: 'ABERTO', pessoa_id},
      include: {
        fotos: true
      },
      orderBy: {
        criado_em: 'desc'
      }
    });
  }

  async findByPessoa(pessoaId) {
    return await models.ServicoCliente.findAll({
      where: { pessoa_id: pessoaId },
      order: [['criado_em', 'DESC']]
    });
  }

  async update(id, data, transaction = null) {
    return await models.ServicoCliente.update(data, {
      where: { id },
      transaction
    });
  }

  async delete(id, transaction = null) {
    return await models.ServicoCliente.destroy({
      where: { id },
      transaction
    });
  }
}

export default new ServicoClienteRepository();