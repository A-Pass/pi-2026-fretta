'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('proposta', {
      servico_cliente_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        references: { model: 'servico_cliente', key: 'id' }
      },
      profissional_pessoa_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        references: { model: 'profissional', key: 'pessoa_id' }
      },
      valor_proposta: { type: Sequelize.DECIMAL(7, 2), allowNull: false },
      texto_proposta: { type: Sequelize.STRING(500), allowNull: false },
      criado_em: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('proposta'); }
};