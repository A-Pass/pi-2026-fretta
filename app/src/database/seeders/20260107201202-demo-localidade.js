'use strict';
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('cidade', [
      { nome: 'São Paulo', uf: 'SP' },
      { nome: 'Rio de Janeiro', uf: 'RJ' }
    ], {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('cidade', null, {});
  }
};