'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ChatServico extends Model {
    static associate(models) {
      ChatServico.belongsTo(models.Proposta, {
        foreignKey: 'proposta_servico_cliente_id',
        targetKey: 'servico_cliente_id',
        constraints: false,
        as: 'contexto_proposta'
      });
    }
  }

  ChatServico.init({
    proposta_servico_cliente_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: { model: 'proposta', key: 'servico_cliente_id' }
    },
    proposta_servico_profissional_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: { model: 'proposta', key: 'profissional_pessoa_id' }
    },
    enviado_em: {
      type: DataTypes.DATE,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    remetente: {
      type: DataTypes.ENUM('PROFISSIONAL', 'CLIENTE'),
      allowNull: false
    },
    mensagem: {
      type: DataTypes.STRING(500),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ChatServico',
    tableName: 'chat_servico',
    underscored: true,
    timestamps: false
  });

  ChatServico.removeAttribute('id');
  return ChatServico;
};
