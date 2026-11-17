import type { Vehicle } from "@/contracts";
export const vehicleCategories = [
  "Utilitário",
  "Caminhão pequeno",
  "Caminhão médio",
  "Caminhão grande",
];
export function vehicleLabel(v: Vehicle) {
  return `${v.category} · ${v.model}`;
}
export function validateVehicle(vehicle: Vehicle, vehicles: Vehicle[]) {
  if (!vehicleCategories.includes(vehicle.category) || !vehicle.model.trim())
    return "Informe a categoria e o modelo do veículo.";
  if (!/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(vehicle.plate))
    return "Informe uma placa válida, como ABC1234 ou ABC1D23.";
  if (vehicles.some((v) => v.id !== vehicle.id && v.plate === vehicle.plate))
    return "Esta placa já está cadastrada.";
  if (
    vehicle.capacityKg !== undefined &&
    (!Number.isFinite(vehicle.capacityKg) || vehicle.capacityKg <= 0)
  )
    return "A capacidade deve ser maior que zero.";
  return "";
}
