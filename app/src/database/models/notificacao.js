'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Notificacao extends Model {
    static associate(models) {
      Notificacao.belongsTo(models.Pessoa, { 
        foreignKey: 'pessoa_id',
        as: 'destinatario'
      });
    }
  }
  Notificacao.init({
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true }, 
    pessoa_id: { 
      type: DataTypes.BIGINT, 
      allowNull: false,
      references: { model: 'pessoa', key: 'id' } 
    },
    titulo: { type: DataTypes.STRING(50), allowNull: false },
    descricao: { type: DataTypes.STRING(255), allowNull: false },
    visualizado_em: { type: DataTypes.DATE, allowNull: true },

    enviado_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Notificacao',
    tableName: 'notificacao',
    underscored: true,
    timestamps: false 
  });
  return Notificacao;
};