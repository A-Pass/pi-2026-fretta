import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthCompleteView } from "@/frontend/auth/AuthCompleteView";
import { auth } from "@/server/auth";

export default async function AuthCompletePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/");

  return (
    <AuthCompleteView name={session.user.name} email={session.user.email} />
  );
}
