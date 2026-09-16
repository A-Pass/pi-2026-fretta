'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ServicoClienteDirecionado extends Model {
    static associate(models) {
      ServicoClienteDirecionado.belongsTo(models.ServicoCliente, {
        foreignKey: 'servico_cliente_id',
        as: 'servico'
      });

      ServicoClienteDirecionado.belongsTo(models.Profissional, {
        foreignKey: 'profissional_pessoa_id',
        as: 'profissional'
      });
    }
  }

  ServicoClienteDirecionado.init({
    servico_cliente_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: { model: 'servico_cliente', key: 'id' }
    },
    profissional_pessoa_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      references: { model: 'profissional', key: 'pessoa_id' }
    }
  }, {
    sequelize,
    modelName: 'ServicoClienteDirecionado',
    tableName: 'servico_cliente_direcionado',
    underscored: true,
    timestamps: false
  });

  ServicoClienteDirecionado.removeAttribute('id');
  return ServicoClienteDirecionado;
};
