'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cidade', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      nome: { type: Sequelize.STRING(64), allowNull: false },
      uf: { type: Sequelize.CHAR(2), allowNull: false }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('cidade'); }
};