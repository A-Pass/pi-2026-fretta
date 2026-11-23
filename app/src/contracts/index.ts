export type Role = "cliente" | "motorista" | "empresa";
export type FreightStatus =
  "ABERTO" | "AGENDADO" | "EM_TRANSPORTE" | "CONCLUIDO" | "CANCELADO";
export type Schedule = {
  kind: "fixa" | "intervalo" | "combinar";
  start?: string;
  end?: string;
};
export interface Freight {
  revision?: number;
  updatedAt?: string;
  cancellation?: {
    role: "cliente";
    reason: string;
    at: string;
    previousStatus: FreightStatus;
  };
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
  companyId?: string;
  requestRevision?: number;
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
  mine?: boolean;
  actorId?: string;
  senderName?: string;
  id: string;
  freightId: string;
  proposalId: string;
  role: Role;
  text: string;
  createdAt: string;
}
export interface AppNotification {
  event?: string;
  companyInviteId?: string;
  id: string;
  role: Role;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  freightId: string;
  proposalId?: string;
  conversationId?: string | null;
}
export interface DriverRegistration {
  mode?: "demo";
  status: "EM_ANALISE" | "AJUSTES_SOLICITADOS" | "APROVADO";
  fullName: string;
  personType: "pf" | "pj";
  cpfMasked: string;
  cnpjMasked?: string;
  companyName?: string;
  license: { numberMasked: string; category: string; expiresOn: string };
  licensePhotoDataUrl?: string;
  documentsSubmitted: boolean;
  submittedAt: string;
  reviewedAt?: string;
  feedback?: string;
  correctionItems?: CorrectionItem[];
  submissionCount?: number;
}
export interface CompanyProfile {
  tradeName: string;
  logo: string;
  about: string;
  city: string;
}
export interface PublicProviderProfile {
  teamManaged?: boolean;
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
  fleet?: FleetState;
  adminDemoCases?: AdminCase[];
  accountSetupComplete?: boolean;
  adminReviews?: AdminReview[];
  companyProfile?: CompanyProfile;
  driverRegistration?: DriverRegistration;
  vehicles?: Vehicle[];
  profile?: { id: string; name: string; photo: string };
  notifications?: AppNotification[];
  subscriptionActive?: boolean;
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
  postalCode?: string;
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
  fleetCompanyId?: string;
  id: string;
  registration: DriverRegistration;
  photo?: string;
  vehicles: Vehicle[];
};
export type CorrectionItem = "dados" | "foto" | "cnh" | "veiculo";
export type AdminReview = {
  id: string;
  caseId: string;
  version: string;
  actor: string;
  at: string;
  decision: "APROVADO" | "AJUSTES_SOLICITADOS";
  reason: string;
  correctionItems?: CorrectionItem[];
};

export interface FleetPerson {
  id: string;
  code: string;
  name: string;
  photo: string;
  registration: DriverRegistration;
}
export interface FleetInvite {
  id: string;
  companyId: string;
  driverId: string;
  createdAt: string;
  expiresAt: string;
  status: "PENDENTE" | "ACEITO" | "RECUSADO" | "CANCELADO";
  respondedAt?: string;
}
export interface FleetMembership {
  id: string;
  companyId: string;
  driverId: string;
  joinedAt: string;
  leftAt?: string;
  activeSeat: boolean;
}
export interface FleetDispatch {
  id: string;
  companyId: string;
  driverId: string;
  vehicle: Vehicle;
  freightId: string;
  requestRevision: number;
  createdAt: string;
  status: "PENDENTE" | "ACEITA" | "RECUSADA" | "CANCELADA";
  proposalId?: string;
}
export interface FleetState {
  company: { id: string; managerId: string; name: string; logo: string };
  people: FleetPerson[];
  vehicles: Vehicle[];
  invites: FleetInvite[];
  members: FleetMembership[];
  dispatches: FleetDispatch[];
}
