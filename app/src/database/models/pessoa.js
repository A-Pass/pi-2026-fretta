'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Pessoa extends Model {
    static associate(models) {
      Pessoa.hasOne(models.Usuario, { foreignKey: 'pessoa_id', as: 'usuario' });

      Pessoa.hasOne(models.Profissional, { foreignKey: 'pessoa_id', as: 'profissional' });
      Pessoa.hasOne(models.PessoaJuridica, { foreignKey: 'pessoa_id', as: 'pessoa_juridica' });
      
      Pessoa.belongsToMany(models.Endereco, {
        through: models.PessoaEndereco,
        foreignKey: 'pessoa_id',
        otherKey: 'endereco_id',
        as: 'enderecos_lista'
      });
    }
  }

  Pessoa.init({
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    primeiro_nome: { type: DataTypes.STRING(64), allowNull: false },
    ultimo_nome: { type: DataTypes.STRING(64), allowNull: false },
    foto_perfil: { type: DataTypes.STRING(255), allowNull: true },
    cpf: { type: DataTypes.CHAR(11), allowNull: false, unique: true },
    nascimento: { type: DataTypes.DATEONLY, allowNull: false },
    celular: { type: DataTypes.STRING(14), allowNull: false }
  }, {
    sequelize,
    modelName: 'Pessoa',
    tableName: 'pessoa',
    underscored: true,
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  });

  return Pessoa;
};
