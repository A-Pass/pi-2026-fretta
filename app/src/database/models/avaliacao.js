'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Avaliacao extends Model {
    static associate(models) {
      Avaliacao.belongsTo(models.Contratacao, {
        foreignKey: 'contratacao_proposta_servico_cliente_id',
        targetKey: 'proposta_servico_cliente_id',
        constraints: false,
        as: 'contratacao'
      });
    }
  }

  Avaliacao.init({
    contratacao_proposta_servico_cliente_id: { type: DataTypes.BIGINT, primaryKey: true },
    contratacao_proposta_servico_profissional_id: { type: DataTypes.BIGINT, primaryKey: true },
    do_cliente_para_profissional: { type: DataTypes.BOOLEAN, primaryKey: true },
    comentario: { type: DataTypes.STRING(250), allowNull: true },
    nota: { type: DataTypes.SMALLINT, allowNull: false },
    enviado_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Avaliacao',
    tableName: 'avaliacoes',
    underscored: true,
    timestamps: false
  });

  Avaliacao.removeAttribute('id');
  return Avaliacao;
};
