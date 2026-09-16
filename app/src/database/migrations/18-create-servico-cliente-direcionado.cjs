'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('servico_cliente_direcionado', {
      servico_cliente_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        references: { 
          model: 'servico_cliente', 
          key: 'id' 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      profissional_pessoa_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        references: { 
          model: 'profissional', 
          key: 'pessoa_id' 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('servico_cliente_direcionado');
  }
};