'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ServicoCliente extends Model {
    static associate(models) {
      ServicoCliente.belongsTo(models.Pessoa, { foreignKey: 'pessoa_id', as: 'cliente' });
    }
  }
  ServicoCliente.init({
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    pessoa_id: { type: DataTypes.BIGINT, allowNull: false },
    titulo: { type: DataTypes.STRING(50), allowNull: false },
    descricao: { type: DataTypes.STRING(500), allowNull: false },
    valor_oferecido: { type: DataTypes.DECIMAL(7, 2), allowNull: true },
    status: {
      type: DataTypes.ENUM('ABERTO', 'NEGOCIANDO', 'CONTRATADO', 'CANCELADO'),
      defaultValue: 'ABERTO'
    }
  }, {
    sequelize,
    modelName: 'ServicoCliente',
    tableName: 'servico_cliente',
    underscored: true,
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: false
  });
  return ServicoCliente;
};