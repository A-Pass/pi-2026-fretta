'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('servico_cliente', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
      pessoa_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'pessoa', key: 'id' }
      },
      titulo: { type: Sequelize.STRING(50), allowNull: false },
      descricao: { type: Sequelize.STRING(500), allowNull: false },
      valor_oferecido: { type: Sequelize.DECIMAL(7, 2), allowNull: true },
      status: { 
        type: Sequelize.ENUM('ABERTO', 'NEGOCIANDO', 'CONTRATADO', 'CANCELADO'), 
        defaultValue: 'ABERTO' 
      },
      criado_em: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('servico_cliente'); }
};