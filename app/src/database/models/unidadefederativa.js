'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class UnidadeFederativa extends Model {
    static associate(models) {
      UnidadeFederativa.hasMany(models.Cidade, {
        foreignKey: 'uf',
        as: 'cidades'
      });
    }
  }

  UnidadeFederativa.init({
    sigla: { type: DataTypes.CHAR(2), primaryKey: true },
    nome: { type: DataTypes.STRING(32), allowNull: false },
    regiao: {
      type: DataTypes.ENUM('CENTRO_OESTE', 'NORDESTE', 'NORTE', 'SUDESTE', 'SUL'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UnidadeFederativa',
    tableName: 'unidade_federativa',
    timestamps: false,
    underscored: true
  });

  return UnidadeFederativa;
};
