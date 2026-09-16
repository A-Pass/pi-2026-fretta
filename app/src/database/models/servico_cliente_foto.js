'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ServicoClienteFoto extends Model {
    static associate(models) {
      ServicoClienteFoto.belongsTo(models.ServicoCliente, {
        foreignKey: 'servico_cliente_id',
        as: 'servico_cliente'
      });
    }
  }

  ServicoClienteFoto.init({
    servico_cliente_id: {
      type: DataTypes.BIGINT, 
      primaryKey: true, 
      allowNull: false,
      references: { model: 'servico_cliente', key: 'id' }
    },
    md5: {
      type: DataTypes.CHAR(32),
      primaryKey: true, 
      allowNull: false
    },
    uri_img: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ordem: {
      type: DataTypes.SMALLINT, 
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ServicoClienteFoto',
    tableName: 'servico_cliente_foto',
    underscored: true,
    timestamps: false 
  });

  return ServicoClienteFoto;
};