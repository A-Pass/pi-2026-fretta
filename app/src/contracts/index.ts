export type Role = "cliente" | "motorista";
export type FreightStatus =
  "ABERTO" | "AGENDADO" | "EM_TRANSPORTE" | "CONCLUIDO" | "CANCELADO";
export type Schedule = {
  kind: "fixa" | "intervalo" | "combinar";
  start?: string;
  end?: string;
};
export interface Freight {
  id: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  vehicle: string;
  schedule: Schedule;
  status: FreightStatus;
  photos: string[];
  acceptedProposalId?: string;
  reviews: Partial<Record<Role, number>>;
}
export interface Proposal {
  id: string;
  freightId: string;
  driver: string;
  rating: number;
  vehicle: string;
  priceCents: number;
  availableAt: string;
  message: string;
  status: "PENDENTE" | "ACEITA" | "ENCERRADA";
}
export interface Message {
  id: string;
  freightId: string;
  proposalId: string;
  role: Role;
  text: string;
  createdAt: string;
}
export interface Store {
  freights: Freight[];
  proposals: Proposal[];
  messages: Message[];
}
export interface ApiError {
  code: string;
  message: string;
}
export interface FrettaApi {
  load(): Promise<Store>;
  save(store: Store): Promise<void>;
}
