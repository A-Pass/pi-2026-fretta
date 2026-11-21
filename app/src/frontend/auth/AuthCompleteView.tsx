"use client";

import { useState } from "react";
import { authClient } from "./client";

type Props = { name: string; email: string };

export function AuthCompleteView({ name, email }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function signOut() {
    setPending(true);
    setError("");
    try {
      const { error: signOutError } = await authClient.signOut();
      if (signOutError) {
        setError("Não foi possível encerrar a sessão. Tente novamente.");
        setPending(false);
        return;
      }
      window.location.assign("/");
    } catch {
      setError("Não foi possível encerrar a sessão. Tente novamente.");
      setPending(false);
    }
  }

  return (
    <main className="login-page">
      <div className="brand">
        <span>FRETTA</span>
        <span>•</span>
      </div>
      <section
        className="login-card auth-complete-card"
        aria-labelledby="auth-title"
      >
        <span className="eyebrow">CONTA GOOGLE CONECTADA</span>
        <h1 id="auth-title">Olá, {name}</h1>
        <p className="auth-account-email">{email}</p>
        {error && (
          <p className="login-notice" role="alert">
            {error}
          </p>
        )}
        <button
          className="secondary auth-sign-out"
          type="button"
          disabled={pending}
          onClick={() => void signOut()}
        >
          {pending ? "Encerrando sessão…" : "Encerrar sessão"}
        </button>
      </section>
      <footer>FRETTA · Conectando pessoas, movimentando histórias.</footer>
    </main>
  );
}
