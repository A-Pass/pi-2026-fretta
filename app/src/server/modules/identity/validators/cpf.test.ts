import { validarCPF } from "./cpf";

const testes = [
  { cpf: "529.982.247-25", esperado: true },
  { cpf: "52998224725", esperado: true },
  { cpf: "529.982.247-26", esperado: false },
  { cpf: "111.111.111-11", esperado: false },
  { cpf: "123456789", esperado: false },
  { cpf: "", esperado: false },
];

for (const teste of testes) {
  const resultado = validarCPF(teste.cpf);

  console.log(
    `CPF: ${teste.cpf} | Esperado: ${teste.esperado} | Resultado: ${resultado}`,
  );

  if (resultado !== teste.esperado) {
    throw new Error(`Falha na validação do CPF: ${teste.cpf}`);
  }
}

console.log("Todos os testes de CPF passaram!");
