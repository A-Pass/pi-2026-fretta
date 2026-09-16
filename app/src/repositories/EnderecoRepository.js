import models from '../database/models/index.js';
import { prisma } from '@/lib/prisma.js';
import CidadeRepository from '@/repositories/CidadeRepository.js'
import BairroRepository from './BairroRepository.js';
import LogradouroRepository from './LogradouroRepository.js';

class EnderecoRepository {
  /**
   * @param {Object} dadosEndereco 
   * @param {Number} pessoaId 
   */
  async createForPessoa(cep, uf_sigla, cidade, bairro, logradouro, numero, complemento, referencia, pessoaId, transaction = null) {
    
    let _logradouro = await LogradouroRepository.findByCep(cep);

    if (!_logradouro) {

      await prisma.$transaction(async (tx) => {
        
        let _cidade = await CidadeRepository.findByNameAndUf(cidade, uf_sigla);
        if (!_cidade) {
          _cidade = await CidadeRepository.create(cidade, uf_sigla, tx);
        }    

        let _bairro = await BairroRepository.findByNameAndCidade(bairro, _cidade.id);
        if (!_bairro) {
          _bairro = await BairroRepository.create(
            bairro, _cidade.id, tx
          );
        }

        _logradouro = await LogradouroRepository.findByNomeAndBairro(logradouro, _bairro.id);
        if(!_logradouro) {
          _logradouro = await LogradouroRepository.create(
            _bairro.id, logradouro, cep, tx
          );
        }
      });
    }

    return await prisma.endereco.create({
      data: {
        logradouro_id: _logradouro.id,
        pessoa_id: pessoaId,
        numero: numero,
        complemento: complemento,
        referencia: referencia
      },
      include: {
        logradouro: {
          include: {
            bairro: {
              include: {
                cidade: true,
              },
            },
          },
        },
      }
    });;
  }

  async findById(id) {
    return await models.Endereco.findByPk(id, {
      include: [
        { 
          model: models.Logradouro, 
          as: 'logradouro' 
        },
        { 
          model: models.Pessoa, 
          as: 'moradores' 
        }
      ]
    });
  }

  async findByPessoaId(pessoaId) {
    return await prisma.endereco.findMany({
      where: {
        pessoa_id: pessoaId
      },
      orderBy: { numero: 'desc' },
      include: {
        logradouro: {
          include: {
            bairro: {
              include: {
                cidade: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id, data, transaction = null) {
    return await models.Endereco.update(data, {
      where: { id },
      transaction
    });
  }
}

export default new EnderecoRepository();