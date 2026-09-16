'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Cidade extends Model {
    static associate(models) {
      Cidade.belongsTo(models.UnidadeFederativa, { foreignKey: 'uf', as: 'uf_detalhes' });
      Cidade.hasMany(models.Bairro, { foreignKey: 'cidade_id', as: 'bairros' });
    }
  }
  Cidade.init({
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(64), allowNull: false },
    uf: { type: DataTypes.CHAR(2), allowNull: false } 
  }, {
    sequelize,
    modelName: 'Cidade',
    tableName: 'cidade',
    timestamps: false
  });
  return Cidade;
};