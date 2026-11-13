
export function validarCPF(cpf: string): boolean {
  const numeros = cpf.replace(/\D/g, "");

  // O CPF precisa ter exatamente 11 dígitos
  if (numeros.length !== 11) {
    return false;
  }

  // Impede CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(numeros)) {
    return false;
  }

  // Calcula um dos dígitos verificadores
  function calcularDigito(tamanho: number): number {
    let soma = 0;

    for (let i = 0; i < tamanho; i++) {
      soma += Number(numeros[i]) * (tamanho + 1 - i);
    }

    const resto = (soma * 10) % 11;

    return resto === 10 ? 0 : resto;
  }

  const primeiroDigito = calcularDigito(9);
  const segundoDigito = calcularDigito(10);

  return (
    primeiroDigito === Number(numeros[9]) &&
    segundoDigito === Number(numeros[10])
  );
}
