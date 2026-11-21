import type {
  Address,
  DriverRegistration,
  Freight,
  Message,
  Proposal,
  ProposalOffer,
  PublicProviderProfile,
  Role,
  SavedAddress,
  Vehicle,
  AppNotification,
} from "@/contracts";
import { createHttpTransport } from "./http";
export type Viewer = {
  id: string;
  name: string;
  photo: string;
  roles: Role[];
  driverRegistration?: DriverRegistration;
};
export type FreightFeedItem = Pick<
  Freight,
  | "id"
  | "title"
  | "description"
  | "origin"
  | "destination"
  | "vehicle"
  | "schedule"
  | "status"
> & { pickupDistanceKm?: number };
export type PrivateFreightDetail = {
  freight: Freight;
  addresses?: { pickup: Address; delivery: Address };
};
export type NewFreight = Pick<
  Freight,
  "title" | "description" | "vehicle" | "schedule"
> & { pickup: Address; delivery: Address; photoIds: string[] };
export type NewOffer = {
  priceCents: number;
  vehicleId: string;
  availableAt: string;
  message: string;
};
/** Prepared against docs/api.md. Mutations are sent once and never retried automatically. */
export function createBackendClient(
  options?: Parameters<typeof createHttpTransport>[0],
) {
  const http = createHttpTransport(options),
    id = (value: string) => encodeURIComponent(value).replace(/\./g, "%2E");
  const post = <T>(path: string, body?: unknown) =>
    http.request<T>(path, { method: "POST", body });
  return {
    me: (signal?: AbortSignal) => http.request<Viewer>("/me", { signal }),
    updateProfile: (profile: { name: string; photoId?: string }) =>
      http.request<Viewer>("/me", { method: "PATCH", body: profile }),
    freights: (
      cursor?: string,
      signal?: AbortSignal,
      filters?: {
        q?: string;
        lat?: number;
        lng?: number;
        radiusKm?: number;
        limit?: number;
      },
    ) =>
      http.page<FreightFeedItem>(
        "/freights",
        cursor,
        signal,
        filters,
      ),
    freight: (value: string, signal?: AbortSignal) =>
      http.request<PrivateFreightDetail>(`/freights/${id(value)}`, { signal }),
    createFreight: (payload: NewFreight) =>
      post<PrivateFreightDetail>("/freights", payload),
    cancelFreight: (value: string) =>
      post<PrivateFreightDetail>(`/freights/${id(value)}/cancel`),
    startFreight: (value: string) =>
      post<PrivateFreightDetail>(`/freights/${id(value)}/start`),
    completeFreight: (value: string) =>
      post<PrivateFreightDetail>(`/freights/${id(value)}/complete`),
    proposals: (value: string, cursor?: string) =>
      http.page<Proposal>(`/freights/${id(value)}/proposals`, cursor),
    propose: (value: string, payload: NewOffer) =>
      post<Proposal>(`/freights/${id(value)}/proposals`, payload),
    revise: (value: string, payload: NewOffer) =>
      post<ProposalOffer>(`/proposals/${id(value)}/offers`, payload),
    accept: (value: string, offerId: string) =>
      post<PrivateFreightDetail>(`/proposals/${id(value)}/accept`, { offerId }),
    decline: (value: string, offerId: string) =>
      post<Proposal>(`/proposals/${id(value)}/decline`, { offerId }),
    messages: (value: string, cursor?: string, signal?: AbortSignal) =>
      http.page<Message>(
        `/conversations/${id(value)}/messages`,
        cursor,
        signal,
      ),
    sendMessage: (value: string, text: string, clientMessageId: string) =>
      post<Message>(`/conversations/${id(value)}/messages`, {
        text,
        clientMessageId,
      }),
    review: (
      value: string,
      score: number,
      comment: string,
      publishComment: boolean,
    ) =>
      post(`/freights/${id(value)}/reviews`, {
        score,
        comment,
        publishComment,
      }),
    vehicles: (cursor?: string) => http.page<Vehicle>("/vehicles", cursor),
    saveVehicle: (vehicle: Vehicle) =>
      http.request<Vehicle>(`/vehicles/${id(vehicle.id)}`, {
        method: "PATCH",
        body: vehicle,
      }),
    createVehicle: (vehicle: Omit<Vehicle, "id">) =>
      post<Vehicle>("/vehicles", vehicle),
    deleteVehicle: (value: string) =>
      http.request<void>(`/vehicles/${id(value)}`, { method: "DELETE" }),
    addresses: (cursor?: string) =>
      http.page<SavedAddress>("/addresses", cursor),
    notifications: (cursor?: string) =>
      http.page<AppNotification>("/notifications", cursor),
    readNotification: (value: string) =>
      http.request<AppNotification>(`/notifications/${id(value)}`, {
        method: "PATCH",
        body: { read: true },
      }),
    readAllNotifications: () => post<void>("/notifications/read-all"),
    publicProvider: (value: string, signal?: AbortSignal) =>
      http.request<PublicProviderProfile>(`/providers/${id(value)}`, {
        signal,
      }),
    upload: (
      file: File,
      purpose: "freight" | "profile" | "company" | "license",
    ) => {
      const form = new FormData();
      form.append("file", file);
      form.append("purpose", purpose);
      return http.request<{ id: string }>(
        purpose === "license" ? "/driver/registration/uploads" : "/uploads",
        { method: "POST", body: form },
      );
    },
  };
}
