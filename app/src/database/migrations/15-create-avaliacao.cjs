'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('avaliacoes', {
      contratacao_proposta_servico_cliente_id: { type: Sequelize.BIGINT, primaryKey: true },
      contratacao_proposta_servico_profissional_id: { type: Sequelize.BIGINT, primaryKey: true },
      do_cliente_para_profissional: { type: Sequelize.BOOLEAN, primaryKey: true },
      nota: { type: Sequelize.SMALLINT, allowNull: false }, // Trocado de TINYINT para SMALLINT
      comentario: { type: Sequelize.STRING(250), allowNull: true },
      enviado_em: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addConstraint('avaliacoes', {
      fields: ['contratacao_proposta_servico_cliente_id', 'contratacao_proposta_servico_profissional_id'],
      type: 'foreign key',
      name: 'fk_avaliacoes_contratacao',
      references: { table: 'contratacao', fields: ['proposta_servico_cliente_id', 'proposta_servico_profissional_id'] }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('avaliacoes'); }
};