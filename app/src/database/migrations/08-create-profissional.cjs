'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('profissional', {
      pessoa_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        references: { model: 'pessoa', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      titulo: { type: Sequelize.STRING(50), allowNull: false }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('profissional'); }
};