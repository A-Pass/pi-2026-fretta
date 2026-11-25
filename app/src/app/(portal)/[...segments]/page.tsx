import { notFound } from "next/navigation";
import { isAppRoute } from "@/frontend/features/navigation/routes";

type PageProps = {
  params: Promise<{ segments: string[] }>;
};

export default async function RoutedPage({ params }: PageProps) {
  const { segments } = await params;
  const pathname = `/${segments.map(encodeURIComponent).join("/")}`;
  if (!isAppRoute(pathname)) notFound();

  return null;
}
