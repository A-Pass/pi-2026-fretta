'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuario', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      email: { type: Sequelize.STRING(254), allowNull: false, unique: true },
      senha: { type: Sequelize.STRING(80), allowNull: false },
      pessoa_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'pessoa', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      criado_em: { type: Sequelize.DATE, allowNull: false },
      atualizado_em: { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('usuario'); }
};