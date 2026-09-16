-- 

drop schema if exists auth cascade;

drop schema if exists agendas cascade;

drop schema if exists servicos cascade;

drop schema if exists dadoscadastrais cascade;

drop schema if exists enderecos cascade;

create or replace
function on_update_set_current_timestamp()
returns trigger as $$
begin
   NEW.atualizado_em = now();

return new;
end;

$$ language 'plpgsql';

create schema auth;

create table auth.usuarios (
	id bigserial not null primary key,
	email varchar(149) not null,
	senha varchar(80) not null,
	criado_em timestamp default current_timestamp,
	atualizado_em timestamp not null default current_timestamp,
	
	constraint usuarios_email_uq unique (email)
);

create trigger on_update_usuarios_current_timestamp before
update
	on
	auth.usuarios for each row execute procedure 
    on_update_set_current_timestamp();


create schema if not exists enderecos;

create type enderecos.uf as enum (
	'AC', 'AL', 'AP', 'AM', 'BA',
	'CE', 'DF', 'ES', 'GO', 'MA',
	'MT', 'MS', 'MG', 'PA', 'PB', 
	'PR', 'PE', 'PI', 'RJ', 'RN',
	'RS', 'RO', 'RR', 'SC', 'SP',
	'SE', 'TO'
);

create table if not exists enderecos.cidades (
	id serial not null primary key,
	nome varchar(128) not null,
	uf enderecos.uf not null,
	cep_generico char(8) null,
	
	constraint cidades_uf_nome_uq unique (uf, nome)
);


create table if not exists enderecos.bairros (
	id serial not null primary key,
	cidade_id integer not null,
	nome varchar(128) not null,
	
	constraint bairros_cidade_nome_uq unique (cidade_id, nome),
	constraint bairros_cidade_fk foreign key (cidade_id) references enderecos.cidades (id)
);


create type enderecos.tipo_logradouro as enum (
	'Rua', 'Praça', 'Avenida', 
	'Zona Rural', 'Caminho', 'BR', 'Outros'
);

create table if not exists enderecos.logradouros (
	id serial not null primary key,
	bairro_id integer not null,
	nome varchar(128) not null,
	tipo enderecos.tipo_logradouro not null,
	cep char(8) not null,
	constraint logradouros_bairro_nome_uq unique (bairro_id, nome),
	constraint logradouros_cep_uq unique (cep),
	constraint logradouros_bairro_fk foreign key (bairro_id) references enderecos.bairros(id)
);


create schema if not exists dadoscadastrais;

create table if not exists enderecos.enderecos (
	id bigserial not null primary key,
	logradouro_id integer not null,
	numero integer not null, 
	complemento varchar(100) null,
	referencia varchar(500) null,
	constraint enderecos_logradouro_fk foreign key (logradouro_id) references enderecos.logradouros(id)
);

create type dadoscadastrais.sexo as enum('M', 'F');

create table if not exists dadoscadastrais.pessoas (
	id bigserial not null primary key,
	nome varchar(128) not null,
	foto_perfil varchar(255) null,
	cpf char(11) not null,
	sexo dadoscadastrais.sexo not null,
	nascimento date not null,
	celular varchar(14) null,
	endereco_id bigint null default null,
	criado_em timestamp not null default current_timestamp,
	atualizado_em timestamp not null default current_timestamp,
	
	constraint pessoas_cpf_uq unique (cpf),
	constraint pessoas_usuario_fk foreign key (id) references auth.usuarios(id),
	constraint pessoas_endereco_fk foreign key (endereco_id) references enderecos.enderecos(id)
);

create trigger on_update_dadoscadastrais_pessoas_current_timestamp before
update
	on
	dadoscadastrais.pessoas for each row execute procedure 
    on_update_set_current_timestamp();

create table dadoscadastrais.pessoas_juridicas (
	pessoa_id bigint not null primary key,
	razao_social varchar(128) not null,
	cnpj char(14) not null,
	
	constraint pessoas_juridicas_pessoa_id_fk foreign key (pessoa_id) references dadoscadastrais.pessoas(id),
	constraint pessoas_juridicas_razao_social_uq unique (razao_social),
	constraint pessoas_juridicas_cnpj_uq unique (cnpj)
);

create schema if not exists servicos;

create table if not exists servicos.estabelecimentos (
	id bigserial not null primary key,
	foto_estabelecimento varchar(255) null,
	logo_estabelcimento varchar(255) null,
	descricao text not null,
	nome_comercial varchar(128) not null,
	endereco_id bigint not null,
	atende_masculino boolean not null,
	atende_feminino boolean not null,
	criado_em timestamp default current_timestamp,
	atualizado_em timestamp default current_timestamp,
	pessoa_registrou_id bigint not null,
	excluido_em timestamp null default null,

	constraint estabelecimentos_endereco_fk foreign key (endereco_id) references enderecos.enderecos(id),
	constraint estabelecimentos_pessoa_registrou_fk foreign key (pessoa_registrou_id) references dadoscadastrais.pessoas(id)
);

create trigger on_update_servicos_estabelecimentos_current_timestamp before
update
	on
	servicos.estabelecimentos for each row execute procedure 
    on_update_set_current_timestamp();

create table if not exists servicos.profissionais_estabelecimentos (
	pessoa_profissional_id bigint not null,
	estabelecimento_id bigint not null,
	dono boolean not null default false,
	
	primary key (pessoa_profissional_id, estabelecimento_id),
	constraint profissionais_estabelecimentos_pessoa_fk foreign key (pessoa_profissional_id) references dadoscadastrais.pessoas(id),
	constraint profissionais_estabelecimentos_estabelecimentos_fk foreign key (estabelecimento_id) references servicos.estabelecimentos(id)
);

create table servicos.servicos(
	id bigserial not null primary key,
	estabelecimento_id bigint not null,
	nome varchar(128) not null,
	preco decimal(11,2) not null,
	tempo_estimado_min smallint not null,
	criado_em timestamp  not null default current_timestamp,
	atualizado_em timestamp not null default current_timestamp,
	excluido_em timestamp null default null,
	
	constraint nome_valido check (char_length(trim(nome)) > 0),
	constraint preco_valido check (preco >= 0),
	constraint tempo_estimado_min_valido check (tempo_estimado_min > 0),
	constraint servicos_id_estabelcimento_id_uq unique (id, estabelecimento_id),
	constraint servicos_estabelecimento_id_nome_uq unique (estabelecimento_id, nome),
	constraint servicos_estabelecimento_fk foreign key (estabelecimento_id) references servicos.estabelecimentos(id)
);

create trigger on_update_servicos_servicos_current_timestamp before
update
	on
	servicos.estabelecimentos for each row execute procedure 
    on_update_set_current_timestamp();


create table servicos.profissionais_servicos (
	pessoa_id bigint not null,
	estabelecimento_id bigint not null,
	servico_estabelecimento_id bigint not null,

	primary key (pessoa_id, estabelecimento_id, servico_estabelecimento_id),
	constraint profissionais_servicos_pessoa_fk foreign key (pessoa_id, estabelecimento_id) references servicos.profissionais_estabelecimentos(pessoa_profissional_id, estabelecimento_id),
	constraint profissionais_servicos_estabelecimento_fk foreign key (servico_estabelecimento_id, estabelecimento_id) references servicos.servicos(id, estabelecimento_id)
);


create schema if not exists agendas;

create type agendas.status_agendamento as enum (
	'SOLICITADO', 'CONFIRMADO', 'FINALIZADO', 'REAGENDADO_CLIENTE', 'REAGENDADO_PROFISSIONAL', 'CANCELADO_CLIENTE', 'CANCELADO_PROFISSIONAL', 'RECUSADO'
);

create table if not exists agendas.agendamentos(
	id bigserial not null primary key,
	pessoa_profissional_id bigint not null,
	servico_id bigint not null,
	preco decimal(11,2) not null,
	tempo_estimado_min smallint not null,
	inicio_em timestamp not null,
	fim_em timestamp not null,
	status agendas.status_agendamento not null,
	
	constraint tempo_estimado_min_valido check(tempo_estimado_min > 0),
	constraint inicio_fim_valido check(inicio_em < fim_em),
	constraint preco_valido check (preco >= 0)
);

create table if not exists agendas.historico_agendamento (
	agendamento_id bigint not null,
	status agendas.status_agendamento not null,
	comentario varchar(500) not null default null,
	data_hora timestamp not null default current_timestamp,
	
	primary key (agendamento_id, status),

	constraint historico_agendamento_id_fk foreign key (agendamento_id) references agendas.agendamentos(id)
);
