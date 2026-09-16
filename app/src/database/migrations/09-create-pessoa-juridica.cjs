'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pessoa_juridica', {
      pessoa_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        references: { model: 'pessoa', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      razao_social: { type: Sequelize.STRING(128), allowNull: false },
      cnpj: { type: Sequelize.CHAR(14), allowNull: false, unique: true }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('pessoa_juridica'); }
};