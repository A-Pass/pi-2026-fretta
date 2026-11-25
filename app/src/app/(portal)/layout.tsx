"use client";

import { usePathname } from "next/navigation";
import { FrettaApp } from "@/frontend/features/FrettaApp";
import { isAppRoute } from "@/frontend/features/navigation/routes";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      {children}
      {(pathname === "/" || isAppRoute(pathname)) && <FrettaApp />}
    </>
  );
}
