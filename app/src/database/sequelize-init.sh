#!/bin/bash

# Criar os modelos usando Sequelize CLI

echo "Criando modelo: auth.usuarios"
npx sequelize model:create --name Usuarios --attributes "email:string senha:string criado_em:date atualizado_em:date"

echo "Criando modelo: enderecos.cidades"
npx sequelize model:create --name Cidades --attributes "nome:string uf:string cep_generico:string"

echo "Criando modelo: enderecos.bairros"
npx sequelize model:create --name Bairros --attributes "cidade_id:integer nome:string"

echo "Criando modelo: enderecos.logradouros"
npx sequelize model:create --name Logradouros --attributes "bairro_id:integer nome:string tipo:string cep:string"

echo "Criando modelo: dadoscadastrais.enderecos"
npx sequelize model:create --name Enderecos --attributes "logradouro_id:integer numero:integer complemento:string referencia:string"

echo "Criando modelo: dadoscadastrais.pessoas"
npx sequelize model:create --name Pessoas --attributes "nome:string foto_perfil:string cpf:string sexo:string nascimento:date celular:string pessoa_endereco_id:integer criado_em:date atualizado_em:date"

echo "Criando modelo: dadoscadastrais.pessoas_juridicas"
npx sequelize model:create --name PessoasJuridicas --attributes "pessoa_id:integer razao_social:string cnpj:string"

echo "Criando modelo: servicos.estabelecimentos"
npx sequelize model:create --name Estabelecimentos --attributes "foto_estabelecimento:string logo_estabelcimento:string descricao:text nome_comercial:string endereco_id:integer atende_masculino:boolean atende_feminio:boolean criado_em:date atualizado_em:date pessoa_registrou_id:integer excluido_em:date"

echo "Criando modelo: servicos.profissionais_estabelecimentos"
npx sequelize model:create --name ProfissionaisEstabelecimentos --attributes "pessoa_profissional_id:integer estabelecimento_id:integer dono:boolean"

echo "Criando modelo: servicos.servicos"
npx sequelize model:create --name Servicos --attributes "estabelecimento_id:integer nome:string preco:decimal tempo_estimado_min:integer criado_em:date atualizado_em:date excluido_em:date"

echo "Criando modelo: servicos.profissionais_servicos"
npx sequelize model:create --name ProfissionaisServicos --attributes "pessoa_id:integer estabelecimento_id:integer servico_estabelecimento_id:integer"

echo "Criando modelo: agendas.agendamentos"
npx sequelize model:create --name Agendamentos --attributes "pessoa_profissional_id:integer servico_id:integer preco:decimal tempo_estimado_min:integer inicio_em:date fim_em:date status:string"

echo "Criando modelo: agendas.historico_agendamento"
npx sequelize model:create --name HistoricoAgendamento --attributes "agendamento_id:integer status:string comentario:string data_hora:date"

echo "Todos os modelos foram gerados com sucesso!"