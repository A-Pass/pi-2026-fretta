import models from '../database/models/index.js';
import { Op } from 'sequelize';

class ServicoProfissionalRepository {

  async create(data, transaction = null) {
    return await models.ServicoProfissional.create(data, { transaction });
  }

  async findById(id) {
    return await models.ServicoProfissional.findByPk(id, {
      include: [{ model: models.Profissional, as: 'prestador', include: ['pessoa'] }]
    });
  }

  async findByProfissional(profissionalId) {
    return await models.ServicoProfissional.findAll({
      where: {
        profissional_pessoa_id: profissionalId,
        excluido_em: null
      },
      order: [['titulo', 'ASC']]
    });
  }

  /**
   * @param {String} termo 
   */
  async search(termo) {
    return await models.ServicoProfissional.findAll({
      where: {
        titulo: { [Op.iLike]: `%${termo}%` },
        excluido_em: null
      },
      include: ['prestador']
    });
  }

  async update(id, data, transaction = null) {
    return await models.ServicoProfissional.update(data, {
      where: { id },
      transaction
    });
  }

  async softDelete(id, transaction = null) {
    return await models.ServicoProfissional.update(
      { excluido_em: new Date() },
      { where: { id }, transaction }
    );
  }
}

export default new ServicoProfissionalRepository();