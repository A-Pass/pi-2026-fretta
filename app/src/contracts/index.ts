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
  offers?: ProposalOffer[];
  driverId?: string;
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
export interface ProposalOffer {
  id: string;
  vehicle: string;
  priceCents: number;
  availableAt: string;
  message: string;
  createdAt?: string;
  status: "PENDENTE" | "ACEITA" | "RECUSADA" | "SUBSTITUIDA" | "ENCERRADA";
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
  operatingArea?: OperatingArea;
  addresses?: SavedAddress[];
  freightAddresses?: Record<string, { pickup: Address; delivery: Address }>;
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

export interface MapPoint {
  lat: number;
  lng: number;
}
export interface Address {
  label: string;
  city: string;
  state: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  point: MapPoint | null;
}
export interface SavedAddress extends Address {
  id: string;
}
export interface FreightRequestDraft {
  title: string;
  description: string;
  photos: string[];
  pickup: Address;
  delivery: Address;
  savePickup: boolean;
  saveDelivery: boolean;
  vehicle: string;
  schedule: Schedule;
}

export interface OperatingArea {
  center: MapPoint;
  radiusKm: number;
  label: string;
}
