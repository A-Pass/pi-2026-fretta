import type { AdminCase } from "@/contracts";
export const reviewVersion = (c: AdminCase) =>
  [
    c.registration.submittedAt,
    c.registration.reviewedAt || "",
    c.registration.status,
  ].join("|");
