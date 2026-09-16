'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bairro', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      nome: { type: Sequelize.STRING(64), allowNull: false },
      cidade_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'cidade', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('bairro'); }
};