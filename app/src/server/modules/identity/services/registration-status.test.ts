
import assert from "node:assert/strict";

import { podeAlterarStatusCadastro } from "./registration-status";

// Teste 1: Motorista não pode se aprovar
assert.equal(
  podeAlterarStatusCadastro(
    "EM_ANALISE",
    "APROVADO",
    "MOTORISTA",
  ),
  false,
);
console.log("Teste 1: motorista não pode se aprovar - OK");

// Teste 2: Motorista não pode solicitar ajustes
assert.equal(
  podeAlterarStatusCadastro(
    "EM_ANALISE",
    "AJUSTES_SOLICITADOS",
    "MOTORISTA",
  ),
  false,
);
console.log("Teste 2: motorista não pode solicitar ajustes - OK");

// Teste 3: Motorista pode reenviar após ajustes
assert.equal(
  podeAlterarStatusCadastro(
    "AJUSTES_SOLICITADOS",
    "EM_ANALISE",
    "MOTORISTA",
  ),
  true,
);
console.log("Teste 3: reenvio após ajustes - OK");

// Teste 4: Administrador pode aprovar
assert.equal(
  podeAlterarStatusCadastro(
    "EM_ANALISE",
    "APROVADO",
    "ADMIN",
  ),
  true,
);
console.log("Teste 4: aprovação administrativa - OK");

// Teste 5: Administrador pode solicitar ajustes
assert.equal(
  podeAlterarStatusCadastro(
    "EM_ANALISE",
    "AJUSTES_SOLICITADOS",
    "ADMIN",
  ),
  true,
);
console.log("Teste 5: solicitação de ajustes - OK");

// Teste 6: Motorista não pode alterar cadastro aprovado
assert.equal(
  podeAlterarStatusCadastro(
    "APROVADO",
    "EM_ANALISE",
    "MOTORISTA",
  ),
  false,
);
console.log("Teste 6: cadastro aprovado protegido - OK");

// Teste 7: Administrador não pode aprovar duas vezes
assert.equal(
  podeAlterarStatusCadastro(
    "APROVADO",
    "APROVADO",
    "ADMIN",
  ),
  false,
);
console.log("Teste 7: aprovação duplicada bloqueada - OK");

console.log("Todos os 7 testes de status passaram!");
