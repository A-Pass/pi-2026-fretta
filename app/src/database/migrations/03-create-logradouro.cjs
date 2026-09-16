'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('logradouro', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      nome: { type: Sequelize.STRING(128), allowNull: false },
      cep: { type: Sequelize.CHAR(8), allowNull: false },
      bairro_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'bairro', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('logradouro'); }
};