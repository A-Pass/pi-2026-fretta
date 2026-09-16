'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chat_servico', {
      proposta_servico_cliente_id: { type: Sequelize.BIGINT, primaryKey: true },
      proposta_servico_profissional_id: { type: Sequelize.BIGINT, primaryKey: true },
      enviado_em: { type: Sequelize.DATE, primaryKey: true, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      remetente: { type: Sequelize.ENUM('PROFISSIONAL', 'CLIENTE'), allowNull: false },
      mensagem: { type: Sequelize.STRING(500), allowNull: false }
    });

    await queryInterface.addConstraint('chat_servico', {
      fields: ['proposta_servico_cliente_id', 'proposta_servico_profissional_id'],
      type: 'foreign key',
      name: 'fk_chat_proposta',
      references: { table: 'proposta', fields: ['servico_cliente_id', 'profissional_pessoa_id'] },
      onDelete: 'CASCADE'
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('chat_servico'); }
};