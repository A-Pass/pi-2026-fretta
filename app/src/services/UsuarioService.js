import PessoaRepository from '../repositories/PessoaRepository.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import PessoaEnderecoRepository from '../repositories/PessoaEnderecoRepository.js';
import EnderecoRepository from '../repositories/EnderecoRepository.js';
import models from '../database/models/index.js';

class UsuarioService {
  async cadastrar(dados) {
    const t = await models.sequelize.transaction();

    try {
      const novaPessoa = await PessoaRepository.create({
        nome: dados.nome,
        cpf: dados.cpf,
        data_nascimento: dados.data_nascimento,
        celular: dados.celular,
        email: dados.email
      }, t);

      await UsuarioRepository.create({
        pessoa_id: novaPessoa.id,
        senha: dados.senha, 
        status: 'ATIVO'
      }, t);

      if (dados.endereco) {
        const novoEndereco = await EnderecoRepository.create({
          logradouro_id: dados.endereco.logradouro_id,
          numero: dados.endereco.numero,
          complemento: dados.endereco.complemento
        }, t);

        await PessoaEnderecoRepository.create({
          pessoa_id: novaPessoa.id,
          endereco_id: novoEndereco.id,
          tipo: 'RESIDENCIAL'
        }, t);
      }

      await t.commit();
      return novaPessoa;

    } catch (error) {
      await t.rollback();
      throw new Error('Erro ao realizar cadastro completo: ' + error.message);
    }
  }
}

export default new UsuarioService();