import { validarCNPJ } from "./cnpj";

const testes = [
  { cnpj: "11.222.333/0001-81", esperado: true },
  { cnpj: "11222333000181", esperado: true },
  { cnpj: "11.222.333/0001-82", esperado: false },
  { cnpj: "11.111.111/1111-11", esperado: false },
  { cnpj: "123456789", esperado: false },
  { cnpj: "", esperado: false },
];

for (const teste of testes) {
  const resultado = validarCNPJ(teste.cnpj);

  console.log(
    `CNPJ: ${teste.cnpj} | Esperado: ${teste.esperado} | Resultado: ${resultado}`,
  );

  if (resultado !== teste.esperado) {
    throw new Error(`Falha na validação do CNPJ: ${teste.cnpj}`);
  }
}

console.log("Todos os testes de CNPJ passaram!");
