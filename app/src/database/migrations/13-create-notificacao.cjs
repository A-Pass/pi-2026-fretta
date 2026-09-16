'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notificacao', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      pessoa_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'pessoa', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      titulo: { type: Sequelize.STRING(50), allowNull: false },
      descricao: { type: Sequelize.STRING(255), allowNull: false },
      visualizado_em: { type: Sequelize.DATE, allowNull: true },
      enviado_em: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('notificacao'); }
};