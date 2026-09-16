const process = require('process');
const pg = require('pg');

module.exports = {
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  dialectModule: pg,

  define: {
    schema: 'public',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
  },

  dialectOptions: {
    searchPath: 'public',
  },
};
