import { FrettaApp } from "@/frontend/features/FrettaApp";
import {
  hasLegacyRouteParams,
  parseLegacyRoute,
  routeUrl,
} from "@/frontend/features/navigation/routes";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  if (hasLegacyRouteParams(params)) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string") query.set(key, value);
      else if (value) value.forEach((item) => query.append(key, item));
    }
    redirect(routeUrl(parseLegacyRoute(query.toString())));
  }

  return <FrettaApp />;
}
