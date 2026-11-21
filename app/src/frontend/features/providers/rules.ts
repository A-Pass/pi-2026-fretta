import type {
  CompanyProfile,
  Proposal,
  PublicProviderProfile,
  Store,
} from "@/contracts";
import { ownProposal } from "../driver/rules";
export function providerId(p: Proposal) {
  return (
    p.driverId ||
    (ownProposal(p, "Cleiton") ? "provider-current" : `provider:${p.driver}`)
  );
}
export function providerName(p: Proposal) {
  return p.providerName || p.driver;
}
export function companyError(company: CompanyProfile) {
  if (!company.tradeName.trim() || company.tradeName.trim().length > 100)
    return "Informe um nome comercial de até 100 caracteres.";
  if (company.about.length > 600 || company.city.length > 100)
    return "Confira os limites da apresentação e da cidade.";
  return "";
}
/** This allow-list is also the proposed public API DTO: never spread registration, vehicle or address objects here. */
export function publicProvider(
  store: Store,
  id: string,
): PublicProviderProfile | null {
  const matches = store.proposals.filter((p) => providerId(p) === id);
  const self = id === "provider-current" || id === "demo-driver";
  if (!self && !matches.length) return null;
  const proposal = matches.at(-1);
  const company = self && store.driverRegistration?.personType === "pj";
  const kind = self
    ? company
      ? "empresa"
      : "autonomo"
    : proposal?.providerKind || "autonomo";
  const driver = {
    name: self ? store.profile?.name || "Cleiton" : proposal!.driver,
    photo: self ? store.profile?.photo || "" : "",
  };
  const completed = store.freights.filter(
    (f) =>
      f.status === "CONCLUIDO" &&
      matches.some((p) => p.id === f.acceptedProposalId),
  );
  const rated = completed.filter(
    (f) =>
      Number.isInteger(f.reviews.cliente) &&
      f.reviews.cliente! >= 1 &&
      f.reviews.cliente! <= 5,
  );
  const vehicles = self
    ? (store.vehicles || []).map((v) => ({
        category: v.category,
        model: v.model,
        description: v.description,
        capacityKg: v.capacityKg,
      }))
    : [...new Set(matches.map((p) => p.vehicle))].map((label) => ({
        category: label,
        model: "",
        description: "",
      }));
  return {
    id,
    kind,
    name:
      kind === "empresa"
        ? self
          ? store.companyProfile?.tradeName ||
            store.driverRegistration?.companyName ||
            proposal?.providerName ||
            driver.name
          : proposal?.providerName || driver.name
        : driver.name,
    photo:
      kind === "empresa"
        ? self
          ? store.companyProfile?.logo || ""
          : proposal?.providerLogo || ""
        : driver.photo,
    driver,
    about: self && company ? store.companyProfile?.about || "" : "",
    city: self && company ? store.companyProfile?.city || "" : "",
    completedCount: completed.length,
    rating: rated.length
      ? rated.reduce((sum, f) => sum + f.reviews.cliente!, 0) / rated.length
      : null,
    reviewCount: rated.length,
    reviews: rated.map((f) => ({
      id: f.id,
      score: f.reviews.cliente!,
      comment: f.reviewPublicComments?.cliente
        ? f.reviewComments?.cliente || ""
        : "",
      date: f.reviewDates?.cliente,
    })),
    vehicles,
  };
}
