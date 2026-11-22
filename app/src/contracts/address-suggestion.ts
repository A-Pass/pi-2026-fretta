import type { Address } from "@/contracts";

export type AddressSuggestion = Partial<
  Pick<Address, "city" | "state" | "neighborhood" | "street">
>;

export function fillEmptyAddressFields(
  address: Address,
  suggestion: AddressSuggestion,
): Address {
  return {
    ...address,
    city: address.city.trim()
      ? address.city
      : (suggestion.city ?? address.city),
    state: address.state.trim()
      ? address.state
      : (suggestion.state ?? address.state),
    neighborhood: address.neighborhood.trim()
      ? address.neighborhood
      : (suggestion.neighborhood ?? address.neighborhood),
    street: address.street.trim()
      ? address.street
      : (suggestion.street ?? address.street),
  };
}
