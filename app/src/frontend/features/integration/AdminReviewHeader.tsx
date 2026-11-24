"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { authClient } from "../../api/auth-client";
import { clearRequestDrafts } from "../requests/drafts";

export function AdminReviewHeader({
  allowed,
  onError,
  beforeLeaving = (leave) => leave(),
}: {
  allowed: boolean;
  onError: (message: string) => void;
  beforeLeaving?: (leave: () => void) => void;
}) {
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    onError("");
    try {
      const result = await authClient.signOut();
      if (result.error)
        throw Error(result.error.message || "Não foi possível sair.");
      try {
        clearRequestDrafts(sessionStorage);
      } catch {}
      location.replace("/");
    } catch (error) {
      onError(
        error instanceof Error ? error.message : "Não foi possível sair.",
      );
      setSigningOut(false);
    }
  }

  return (
    <header className="admin-header real-admin-header">
      <a
        className="brand"
        href="/"
        onClick={(event) => {
          event.preventDefault();
          beforeLeaving(() => location.assign("/"));
        }}
      >
        FRETTA<span>•</span>
      </a>
      <b>Administração</b>
      {allowed && (
        <button
          type="button"
          className="secondary admin-sign-out"
          disabled={signingOut}
          onClick={() => beforeLeaving(() => void signOut())}
        >
          <LogOut size={17} aria-hidden="true" />
          {signingOut ? "Saindo…" : "Sair da conta"}
        </button>
      )}
    </header>
  );
}
