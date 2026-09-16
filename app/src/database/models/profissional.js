'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Profissional extends Model {
    static associate(models) {
      Profissional.belongsTo(models.Pessoa, { foreignKey: 'pessoa_id', as: 'pessoa' });
      Profissional.hasMany(models.ServicoProfissional, { foreignKey: 'profissional_pessoa_id', as: 'servicos' });
    }
  }
  Profissional.init({
    pessoa_id: { type: DataTypes.BIGINT, primaryKey: true },
    titulo: { type: DataTypes.STRING(50), allowNull: false }
  }, {
    sequelize,
    modelName: 'Profissional',
    tableName: 'profissional',
    underscored: true,
    timestamps: false
  });
  return Profissional;
};