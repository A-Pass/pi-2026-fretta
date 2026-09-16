'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('servico_profissional', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },

      profissional_pessoa_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'profissional', key: 'pessoa_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      titulo: { type: Sequelize.STRING(50), allowNull: false },
      descricao: { type: Sequelize.STRING(500), allowNull: false },
      preco_base: { type: Sequelize.DECIMAL(7, 2), allowNull: false },

      excluido_em: { type: Sequelize.DATE, allowNull: true },

      criado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      atualizado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('servico_profissional');
  }
};
