'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('endereco', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      numero: { type: Sequelize.STRING(10), allowNull: false },
      complemento: { type: Sequelize.STRING(128), allowNull: true },
      logradouro_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'logradouro', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('endereco'); }
};