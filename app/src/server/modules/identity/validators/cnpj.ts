export function validarCNPJ(cnpj: string): boolean {
  const numeros = cnpj.replace(/\D/g, "");

  if (numeros.length !== 14) {
    return false;
  }

  if (/^(\d)\1{13}$/.test(numeros)) {
    return false;
  }

  function calcularDigito(base: string, pesos: number[]): number {
    const soma = [...base].reduce(
      (total, digito, indice) => total + Number(digito) * pesos[indice],
      0,
    );

    const resto = soma % 11;

    return resto < 2 ? 0 : 11 - resto;
  }

  const primeiroDigito = calcularDigito(
    numeros.slice(0, 12),
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  const segundoDigito = calcularDigito(
    numeros.slice(0, 13),
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  );

  return (
    primeiroDigito === Number(numeros[12]) &&
    segundoDigito === Number(numeros[13])
  );
}
