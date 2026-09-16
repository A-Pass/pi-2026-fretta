'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pessoa_endereco', {
      pessoa_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        references: { model: 'pessoa', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      endereco_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        references: { model: 'endereco', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      ordem: { type: Sequelize.SMALLINT, allowNull: false, defaultValue: 1 }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('pessoa_endereco'); }
};