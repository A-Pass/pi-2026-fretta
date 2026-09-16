'use strict';
import { Sequelize, DataTypes } from 'sequelize';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const configData = require('../config/config.cjs');

const dbConfig = require('../../../config/config.cjs');

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  configData
);

import _Cidade from './cidade.js';
import _Bairro from './bairro.js';
import _Logradouro from './logradouro.js';
import _Endereco from './endereco.js';
import _Pessoa from './pessoa.js';
import _Usuario from './usuario.js';
import _PessoaEndereco from './pessoaendereco.js';
import _Profissional from './profissional.js';
import _PessoaJuridica from './pessoajuridica.js';
import _ServicoCliente from './servicocliente.js';
import _ServicoProfissional from './servicoprofissional.js';
import _Proposta from './proposta.js';
import _Contratacao from './contratacao.js';
import _Notificacao from './notificacao.js';
import _ChatServico from './chatservico.js';
import _UnidadeFederativa from './unidadefederativa.js';

const models = {
  Cidade: _Cidade(sequelize, DataTypes),
  Bairro: _Bairro(sequelize, DataTypes),
  Logradouro: _Logradouro(sequelize, DataTypes),
  Endereco: _Endereco(sequelize, DataTypes),
  Pessoa: _Pessoa(sequelize, DataTypes),
  Usuario: _Usuario(sequelize, DataTypes),
  PessoaEndereco: _PessoaEndereco(sequelize, DataTypes),
  Profissional: _Profissional(sequelize, DataTypes),
  PessoaJuridica: _PessoaJuridica(sequelize, DataTypes),
  ServicoCliente: _ServicoCliente(sequelize, DataTypes),
  ServicoProfissional: _ServicoProfissional(sequelize, DataTypes),
  Proposta: _Proposta(sequelize, DataTypes),
  Contratacao: _Contratacao(sequelize, DataTypes),
  Notificacao: _Notificacao(sequelize, DataTypes),
  ChatServico: _ChatServico(sequelize, DataTypes),
  UnidadeFederativa: _UnidadeFederativa(sequelize, DataTypes)
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { sequelize, models };
export default models;