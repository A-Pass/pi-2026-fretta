'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PessoaEndereco extends Model {
    static associate(models) {
      PessoaEndereco.belongsTo(models.Pessoa, { foreignKey: 'pessoa_id' });
      PessoaEndereco.belongsTo(models.Endereco, { foreignKey: 'endereco_id' });
    }
  }
  PessoaEndereco.init({
    pessoa_id: { type: DataTypes.BIGINT, primaryKey: true },
    endereco_id: { type: DataTypes.BIGINT, primaryKey: true },
    ordem: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 1 }
  }, {
    sequelize,
    modelName: 'PessoaEndereco',
    tableName: 'pessoa_endereco',
    underscored: true,
    timestamps: false
  });
  PessoaEndereco.removeAttribute('id');
  return PessoaEndereco;
};