'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contratacao', {
      proposta_servico_cliente_id: { type: Sequelize.BIGINT, primaryKey: true },
      proposta_servico_profissional_id: { type: Sequelize.BIGINT, primaryKey: true },
      preco_negociado: { type: Sequelize.DECIMAL(7, 2), allowNull: false },
      data_hora_agendamento: { type: Sequelize.DATE, allowNull: false },
      status: { 
        type: Sequelize.ENUM('SOLICITADO', 'CONFIRMADO', 'FINALIZADO', 'CANCELADO'), 
        defaultValue: 'SOLICITADO' 
      },
      criado_em: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      atualizado_em: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    
    await queryInterface.addConstraint('contratacao', {
      fields: ['proposta_servico_cliente_id', 'proposta_servico_profissional_id'],
      type: 'foreign key',
      name: 'fk_contratacao_proposta',
      references: {
        table: 'proposta',
        fields: ['servico_cliente_id', 'profissional_pessoa_id']
      },
      onDelete: 'CASCADE', onUpdate: 'CASCADE'
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('contratacao'); }
};