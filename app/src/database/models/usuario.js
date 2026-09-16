'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsTo(models.Pessoa, {
        foreignKey: 'pessoa_id',
        as: 'pessoa'
      });
    }
  }

  Usuario.init({
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(254), allowNull: false, unique: true },
    senha: { type: DataTypes.STRING(80), allowNull: false },
    pessoa_id: { type: DataTypes.BIGINT, allowNull: false }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuario',
    underscored: true,
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  });

  return Usuario;
};
