'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ServicoProfissional extends Model {
    static associate(models) {
      ServicoProfissional.belongsTo(models.Profissional, {
        foreignKey: 'profissional_pessoa_id',
        as: 'prestador'
      });
    }
  }

  ServicoProfissional.init({
    id: {
      type: DataTypes.BIGINT, 
      primaryKey: true,
      autoIncrement: true
    },
    profissional_pessoa_id: {
      type: DataTypes.BIGINT, 
      allowNull: false,
      references: {
        model: 'profissional',
        key: 'pessoa_id'
      }
    },
    titulo: {
      type: DataTypes.STRING(50), 
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING(500), 
      allowNull: false
    },
    preco_base: {
      type: DataTypes.DECIMAL(7, 2), 
      allowNull: false
    },
    excluido_em: {
      type: DataTypes.DATE, 
      allowNull: true
    },
    criado_em: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    atualizado_em: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'ServicoProfissional',
    tableName: 'servico_profissional',
    underscored: true,
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  });

  return ServicoProfissional;
};