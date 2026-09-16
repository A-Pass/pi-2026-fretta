'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Contratacao extends Model {
    static associate(models) {
      Contratacao.belongsTo(models.Proposta, {
        foreignKey: 'proposta_servico_cliente_id',
        targetKey: 'servico_cliente_id',
        constraints: false,
        as: 'proposta'
      });
    }
  }

  Contratacao.init({
    proposta_servico_cliente_id: { type: DataTypes.BIGINT, primaryKey: true },
    proposta_servico_profissional_id: { type: DataTypes.BIGINT, primaryKey: true },
    preco_negociado: { type: DataTypes.DECIMAL(7, 2), allowNull: false },
    data_hora_agendamento: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM('SOLICITADO', 'CONFIRMADO', 'FINALIZADO', 'CANCELADO'),
      defaultValue: 'SOLICITADO'
    },
    criado_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    atualizado_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Contratacao',
    tableName: 'contratacao',
    underscored: true,
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  });

  Contratacao.removeAttribute('id');
  return Contratacao;
};
