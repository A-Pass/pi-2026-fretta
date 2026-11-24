export function companyPlanPriceCents(seats: number) {
  return 24990 + (seats - 1) * 4990;
}
