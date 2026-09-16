'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Proposta extends Model {
    static associate(models) {
      Proposta.belongsTo(models.ServicoCliente, { foreignKey: 'servico_cliente_id', as: 'demanda' });
      Proposta.belongsTo(models.Profissional, { foreignKey: 'profissional_pessoa_id', as: 'prestador' });
    }
  }
  Proposta.init({
    servico_cliente_id: { type: DataTypes.BIGINT, primaryKey: true },
    profissional_pessoa_id: { type: DataTypes.BIGINT, primaryKey: true },
    valor_proposta: { type: DataTypes.DECIMAL(7, 2), allowNull: false },
    texto_proposta: { type: DataTypes.STRING(500), allowNull: false }, 
    criado_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Proposta',
    tableName: 'proposta',
    underscored: true,
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: false
  });
  Proposta.removeAttribute('id');
  return Proposta;
};