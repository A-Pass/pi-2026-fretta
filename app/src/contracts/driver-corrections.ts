export const correctionItems = [
  { id: "dados", label: "Identificação conferida" },
  { id: "foto", label: "Foto conferida" },
  { id: "cnh", label: "CNH e validade conferidas" },
  { id: "veiculo", label: "Veículo e habilitação compatíveis" },
] as const;

export const correctionFields: Record<
  (typeof correctionItems)[number]["id"],
  string[]
> = {
  dados: ["tipoPessoa", "nomeCompleto", "cpf", "cnpj", "razaoSocial"],
  foto: ["fotoPerfilId"],
  cnh: ["cnhNumero", "cnhCategoria", "cnhValidade", "documentoCnhId"],
  veiculo: ["veiculoId"],
};
