'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Bairro extends Model {
    static associate(models) {
      Bairro.belongsTo(models.Cidade, { foreignKey: 'cidade_id', as: 'cidade' });
      Bairro.hasMany(models.Logradouro, { foreignKey: 'bairro_id', as: 'logradouros' });
    }
  }
  Bairro.init({
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    cidade_id: { type: DataTypes.BIGINT, allowNull: false },
    nome: { type: DataTypes.STRING(64), allowNull: false }
  }, {
    sequelize,
    modelName: 'Bairro',
    tableName: 'bairro',
    timestamps: false
  });
  return Bairro;
};