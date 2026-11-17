export function validarNumeroCNH(numero: string): boolean {
  const numeros = numero.replace(/\D/g, "");

  if (!/^\d{11}$/.test(numeros)) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(numeros)) {
    return false;
  }

  return true;
}

export function validarCategoriaCNH(categoria: string): boolean {
  const categoriasPermitidas = [
    "A",
    "B",
    "AB",
    "C",
    "D",
    "E",
    "AC",
    "AD",
    "AE",
  ];

  return categoriasPermitidas.includes(categoria.trim().toUpperCase());
}

export function validarValidadeCNH(validade: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(validade)) {
    return false;
  }

  const data = new Date(`${validade}T12:00:00Z`);

  if (
    Number.isNaN(data.getTime()) ||
    data.toISOString().slice(0, 10) !== validade
  ) {
    return false;
  }

  const hoje = new Date().toISOString().slice(0, 10);

  return validade >= hoje;
}
