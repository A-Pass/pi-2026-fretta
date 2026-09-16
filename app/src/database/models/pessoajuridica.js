'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PessoaJuridica extends Model {
    static associate(models) {
      PessoaJuridica.belongsTo(models.Pessoa, { foreignKey: 'pessoa_id', as: 'dados_pessoais' });
    }
  }
  PessoaJuridica.init({
    pessoa_id: { type: DataTypes.BIGINT, primaryKey: true },
    razao_social: { type: DataTypes.STRING(128), allowNull: false },
    cnpj: { type: DataTypes.CHAR(14), allowNull: false, unique: true }
  }, {
    sequelize,
    modelName: 'PessoaJuridica',
    tableName: 'pessoa_juridica',
    underscored: true,
    timestamps: false
  });
  return PessoaJuridica;
};