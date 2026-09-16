'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Logradouro extends Model {
    static associate(models) {
      Logradouro.belongsTo(models.Bairro, { foreignKey: 'bairro_id', as: 'bairro' });
      Logradouro.hasMany(models.Endereco, { foreignKey: 'logradouro_id', as: 'enderecos' });
    }
  }
  Logradouro.init({
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    bairro_id: { type: DataTypes.BIGINT, allowNull: false },
    cep: { type: DataTypes.CHAR(8), allowNull: false },
    nome: { type: DataTypes.STRING(128), allowNull: false }
  }, {
    sequelize,
    modelName: 'Logradouro',
    tableName: 'logradouro',
    underscored: true,
    timestamps: false
  });
  return Logradouro;
};