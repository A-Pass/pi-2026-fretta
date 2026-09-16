'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('servico_cliente_foto', {
      servico_cliente_id: {
        type: Sequelize.BIGINT,
        primaryKey: true, 
        allowNull: false,
        references: { model: 'servico_cliente', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      md5: {
        type: Sequelize.CHAR(32),
        primaryKey: true, 
        allowNull: false
      },
      uri_img: { 
        type: Sequelize.STRING(255),
        allowNull: false
      },
      ordem: { 
        type: Sequelize.SMALLINT,
        allowNull: false
      }
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('servico_cliente_foto'); }
};