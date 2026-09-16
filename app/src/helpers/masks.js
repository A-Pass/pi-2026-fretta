export function maskPhoneBR(value) {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 10) {
        // Fixo: (11) 1234-5678
        return digits
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{4})(\d)/, "$1-$2")
            .slice(0, 14);
    }

    // Celular: (11) 91234-5678
    return digits
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 15);
}

export function maskCPF(value) {
    return value
        .replace(/\D/g, "")               // remove tudo que não é dígito
        .replace(/(\d{3})(\d)/, "$1.$2")  // 123.456
        .replace(/(\d{3})(\d)/, "$1.$2")  // 123.456.789
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2") // 123.456.789-09
        .slice(0, 14);                    // limita tamanho
}

export function maskCEP(value) {
    value = value.replace(/\D/g, "");
    if (value.length > 5) {
        value = value.slice(0, 5) + "-" + value.slice(5, 8);
    }
    return value;
}

export function maskMoneyBR(value) {
  if (value === null || value === undefined) return '0,00';

  const numeric = String(value)
    .replace(/\D/g, '')
    .replace(/^0+/, '');

  const number = Number(numeric) / 100;

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}
