import { RealCompanyWorkspace } from "@/frontend/features/integration/RealCompanyWorkspace";
import { FleetWorkspace } from "@/frontend/features/fleet/FleetWorkspace";
export default function CompanyPage() {
  return process.env.NEXT_PUBLIC_API_MODE === "real" ? <RealCompanyWorkspace /> : <FleetWorkspace />;
}
