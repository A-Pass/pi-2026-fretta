import { createHttpTransport } from "./http";
import type { Vehicle } from "@/contracts";
import type {
  DriverOnboardingDraft,
  PreparedPhoto,
} from "../features/onboarding/rules";
export interface IdentityViewer {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  roles: { cliente: boolean; motorista: boolean };
  driverRegistration: {
    status: string | null;
    cadastroCompleto: boolean;
    precisaCompletarCadastro: boolean;
    motivoAjuste: string | null;
  };
}
export interface RegistrationSummary {
  status: string;
  cadastroCompleto: boolean;
  podeRealizarFretes: boolean;
  demoPixDisponivel?: boolean;
  assinaturaAtiva?: boolean;
  enviadoEm?: string;
  analisadoEm?: string;
  atualizadoEm?: string;
  itensAjuste?: string[];
  motivoAjuste?: string | null;
}
export function createIdentityClient(
  options?: Parameters<typeof createHttpTransport>[0],
) {
  const http = createHttpTransport(options);
  return {
    me: () => http.request<IdentityViewer>("/me"),
    rename: (name: string, hideProfilePhoto?: true) =>
      http.request<{
        id: string;
        name: string;
        email: string;
        image: string | null;
      }>("/me", { method: "PATCH", body: { name, hideProfilePhoto } }),
    activate: (role: "cliente" | "motorista") =>
      http.request(role === "cliente" ? "/me/client" : "/me/driver", {
        method: "POST",
      }),
    vehicles: async () => {
      const data = await http.request<{ vehicles: Vehicle[] }>("/vehicles");
      return data.vehicles;
    },
    createVehicle: (vehicle: Omit<Vehicle, "id">) =>
      http.request<Vehicle>("/vehicles", { method: "POST", body: vehicle }),
    updateVehicle: (vehicle: Vehicle) => {
      const { id, ...body } = vehicle;
      return http.request<Vehicle>(`/vehicles/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body,
      });
    },
    deleteVehicle: (id: string) =>
      http.request(`/vehicles/${encodeURIComponent(id)}`, { method: "DELETE" }),
    registration: () =>
      http.request<RegistrationSummary>("/driver/registration"),
    upload: async (photo: PreparedPhoto, tipo: "FOTO_PERFIL" | "CNH") => {
      // Convert browser-decoded images to JPEG for the existing private upload contract.
      const image = await createImageBitmap(
        await (await fetch(photo.dataUrl)).blob(),
      );
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext("2d")!.drawImage(image, 0, 0);
      image.close();
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) =>
            b
              ? resolve(b)
              : reject(Error("Não foi possível preparar a imagem.")),
          "image/jpeg",
          0.9,
        ),
      );
      const form = new FormData();
      form.append("tipo", tipo);
      form.append(
        "arquivo",
        new File([blob], `${tipo.toLowerCase()}.jpg`, { type: "image/jpeg" }),
      );
      return http.request<{ id: string }>("/driver/registration/uploads", {
        method: "POST",
        body: form,
      });
    },
    submit: (
      draft: DriverOnboardingDraft,
      vehicleId: string,
      fotoPerfilId: string,
      documentoCnhId: string,
    ) =>
      http.request("/driver/registration", {
        method: "POST",
        body: {
          tipoPessoa: draft.personType.toUpperCase(),
          nomeCompleto: draft.fullName,
          cpf: draft.cpf,
          cnpj: draft.personType === "pj" ? draft.cnpj : undefined,
          razaoSocial:
            draft.personType === "pj" ? draft.companyName : undefined,
          cnhNumero: draft.licenseNumber,
          cnhCategoria: draft.licenseCategory,
          cnhValidade: draft.licenseExpiresOn,
          veiculoId: vehicleId,
          fotoPerfilId,
          documentoCnhId,
        },
      }),
  };
}
