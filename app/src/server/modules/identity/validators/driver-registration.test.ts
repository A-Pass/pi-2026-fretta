import assert from "node:assert/strict";

import {
  validarCadastroMotorista,
  type CadastroMotoristaInput,
} from "./driver-registration";

// Dados fictícios para testar o validador
const cadastroPF: CadastroMotoristaInput = {
  tipoPessoa: "PF",
  nome_completo: "Motorista Teste",
  cpf: "529.982.247-25",
  cnh_numero: "12345678901",
  cnh_categoria: "B",
  cnh_validade: "2099-12-31",
  veiculoId: "veiculo-teste",
};

// Teste 1: Pessoa física válida
assert.deepEqual(validarCadastroMotorista(cadastroPF), []);
console.log("Teste 1: PF válida - OK");

// Teste 2: CPF inválido
const cpfInvalido = validarCadastroMotorista({
  ...cadastroPF,
  cpf: "11111111111",
});

assert.ok(cpfInvalido.includes("CPF inválido."));
console.log("Teste 2: CPF inválido - OK");

// Teste 3: Pessoa jurídica válida
const cadastroPJ: CadastroMotoristaInput = {
  ...cadastroPF,
  tipoPessoa: "PJ",
  cnpj: "11.222.333/0001-81",
  razao_social: "Empresa Teste",
};

assert.deepEqual(validarCadastroMotorista(cadastroPJ), []);
console.log("Teste 3: PJ válida - OK");

// Teste 4: PJ sem CNPJ
const pjSemCnpj = validarCadastroMotorista({
  ...cadastroPJ,
  cnpj: undefined,
});

assert.ok(pjSemCnpj.includes("CNPJ inválido."));
console.log("Teste 4: PJ sem CNPJ - OK");

// Teste 5: CNH vencida
const cnhVencida = validarCadastroMotorista({
  ...cadastroPF,
  cnh_validade: "2020-01-01",
});

assert.ok(cnhVencida.includes("CNH vencida ou data inválida."));
console.log("Teste 5: CNH vencida - OK");

// Teste 6: Veículo não informado
const semVeiculo = validarCadastroMotorista({
  ...cadastroPF,
  veiculoId: "",
});

assert.ok(semVeiculo.includes("É necessário selecionar um veículo."));
console.log("Teste 6: Veículo obrigatório - OK");
// Teste 7: Tipo de pessoa inválido
const tipoPessoaInvalido = validarCadastroMotorista({
  ...cadastroPF,
  tipoPessoa: "EMPRESA" as CadastroMotoristaInput["tipoPessoa"],
});

assert.ok(tipoPessoaInvalido.includes("Tipo de pessoa inválido."));

console.log("Teste 7: Tipo de pessoa inválido - OK");

console.log("Todos os 7 testes passaram!");
