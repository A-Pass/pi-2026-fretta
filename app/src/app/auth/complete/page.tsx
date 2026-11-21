import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthCompleteView } from "@/frontend/auth/AuthCompleteView";
import { accountSetupIsComplete } from "@/frontend/auth/account-setup";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import type { Role } from "@/contracts";

type PageProps = {
  searchParams: Promise<{ perfil?: string }>;
};

export default async function AuthCompletePage({ searchParams }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/");

  const params = await searchParams;
  const role: Role = params.perfil === "motorista" ? "motorista" : "cliente";
  const savedState = await prisma.appState.findUnique({
    where: { userId: session.user.id },
    select: { data: true },
  });
  if (accountSetupIsComplete(savedState?.data))
    redirect(`/${role}/inicio`);

  return (
    <AuthCompleteView
      name={session.user.name}
      email={session.user.email}
      image={session.user.image ?? null}
      role={role}
    />
  );
}
