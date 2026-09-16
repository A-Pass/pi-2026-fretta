'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('cidade', [
      { id: 1, nome: 'São Paulo', uf: 'SP' },
      { id: 2, nome: 'Rio de Janeiro', uf: 'RJ' },
      { id: 3, nome: 'Lisboa', uf: 'PT' } 
    ], {});

    await queryInterface.bulkInsert('bairro', [
      { id: 1, nome: 'Centro', cidade_id: 1 },
      { id: 2, nome: 'Copacabana', cidade_id: 2 },
      { id: 3, nome: 'Alfama', cidade_id: 3 }
    ], {});
    
    await queryInterface.bulkInsert('logradouro', [
      { id: 1, nome: 'Avenida Paulista', cep: '01310100', bairro_id: 1 },
      { id: 2, nome: 'Avenida Atlântica', cep: '22010000', bairro_id: 2 }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('logradouro', null, {});
    await queryInterface.bulkDelete('bairro', null, {});
    await queryInterface.bulkDelete('cidade', null, {});
  }
};