'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pessoa', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      primeiro_nome: { type: Sequelize.STRING(64), allowNull: false },
      ultimo_nome: { type: Sequelize.STRING(64), allowNull: false },
      cpf: { type: Sequelize.CHAR(11), allowNull: false, unique: true },
      nascimento: { type: Sequelize.DATEONLY, allowNull: false },
      celular: { type: Sequelize.STRING(14), allowNull: false },
      foto_perfil: { type: Sequelize.STRING(255), allowNull: true },
      criado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      atualizado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('pessoa'); }
};