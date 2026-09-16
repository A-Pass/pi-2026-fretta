'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Endereco extends Model {
    static associate(models) {
      Endereco.belongsTo(models.Logradouro, { foreignKey: 'logradouro_id', as: 'logradouro' });
      Endereco.belongsToMany(models.Pessoa, {
        through: models.PessoaEndereco,
        foreignKey: 'endereco_id',
        otherKey: 'pessoa_id',
        as: 'moradores'
      });
    }
  }
  Endereco.init({
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    logradouro_id: { type: DataTypes.BIGINT, allowNull: false },
    numero: { type: DataTypes.STRING(10), allowNull: false },
    complemento: { type: DataTypes.STRING(128), allowNull: true }
  }, {
    sequelize,
    modelName: 'Endereco',
    tableName: 'endereco',
    underscored: true,
    timestamps: false
  });
  return Endereco;
};