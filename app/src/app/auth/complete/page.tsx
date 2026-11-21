import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthCompleteView } from "@/frontend/auth/AuthCompleteView";
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
  const account = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { accountSetupComplete: true },
  });
  if (account?.accountSetupComplete)
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
