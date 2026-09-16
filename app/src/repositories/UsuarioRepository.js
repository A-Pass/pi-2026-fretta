import models from '../database/models/index.js';
import { PrismaClient } from '@/generated/prisma/client.js';

const prisma = PrismaClient();

class UsuarioRepository {

  async create(data, transaction = null) {
    return await models.Usuario.create(data, { transaction });
  }

  async findByEmail(email) {
    return await models.Usuario.findOne({
      where: { email },
      include: [{
        model: models.Pessoa,
        as: 'pessoa' 
      }]
    });
  }

  async findById(id) {
    return await models.Usuario.findByPk(id, {
      include: ['pessoa']
    });
  }

  async update(id, data, transaction = null) {
    return await models.Usuario.update(data, {
      where: { id: id }, 
      transaction
    });
  }

  async delete(id, transaction = null) {
    return await models.Usuario.destroy({
      where: { id: id },
      transaction
    });
  }
}

export default new UsuarioRepository();