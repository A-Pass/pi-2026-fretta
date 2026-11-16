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
  clientName?: string;
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
  reviewComments?: Partial<Record<Role, string>>;
  reviewPublicComments?: Partial<Record<Role, boolean>>;
  reviewDates?: Partial<Record<Role, string>>;
  agreement?: Agreement;
}
export interface Vehicle {
  id: string;
  category: string;
  model: string;
  plate: string;
  capacityKg?: number;
  description: string;
}
export interface Agreement {
  providerName?: string;
  providerKind?: "autonomo" | "empresa";
  proposalId: string;
  offerId: string;
  driver: string;
  driverId?: string;
  priceCents: number;
  vehicle: string;
  availableAt: string;
  message: string;
  acceptedAt: string;
}
export interface Proposal {
  providerName?: string;
  providerKind?: "autonomo" | "empresa";
  providerLogo?: string;
  vehicleId?: string;
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
  vehicleId?: string;
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
export interface AppNotification {
  id: string;
  role: Role;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  freightId: string;
  proposalId?: string;
}
export interface DriverRegistration {
  mode: "demo";
  status: "EM_ANALISE" | "AJUSTES_SOLICITADOS" | "APROVADO";
  fullName: string;
  personType: "pf" | "pj";
  cpfMasked: string;
  cnpjMasked?: string;
  companyName?: string;
  license: { numberMasked: string; category: string; expiresOn: string };
  documentsSubmitted: boolean;
  submittedAt: string;
  reviewedAt?: string;
  feedback?: string;
}
export interface CompanyProfile {
  tradeName: string;
  logo: string;
  about: string;
  city: string;
}
export interface PublicProviderProfile {
  id: string;
  kind: "autonomo" | "empresa";
  name: string;
  photo: string;
  driver: { name: string; photo: string };
  about: string;
  city: string;
  completedCount: number;
  rating: number | null;
  reviewCount: number;
  reviews: { id: string; score: number; comment: string; date?: string }[];
  vehicles: {
    category: string;
    model: string;
    capacityKg?: number;
    description: string;
  }[];
}
export interface Store {
  adminDemoCases?: AdminCase[];
  adminReviews?: AdminReview[];
  companyProfile?: CompanyProfile;
  driverRegistration?: DriverRegistration;
  vehicles?: Vehicle[];
  profile?: { name: string; photo: string };
  subscriptionActive?: boolean;
  notifications?: AppNotification[];
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

export type AdminCase = {
  id: string;
  registration: DriverRegistration;
  photo: string;
  vehicles: Vehicle[];
};
export type AdminReview = {
  id: string;
  caseId: string;
  version: string;
  actor: string;
  at: string;
  decision: "APROVADO" | "AJUSTES_SOLICITADOS";
  reason: string;
};
