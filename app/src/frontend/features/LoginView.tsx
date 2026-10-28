import { ArrowLeft, ArrowRight, Package, Truck } from "lucide-react";
import type { Role } from "@/contracts";

type Props = { role: Role; onBack: () => void; onContinue: () => void };

export function LoginView({ role, onBack, onContinue }: Props) {
  const driver = role === "motorista";
  return (
    <main className="login-page">
      <div className="brand">
        <Truck /> FRETTA<span>•</span>
      </div>
      <button className="back login-back" onClick={onBack}>
        <ArrowLeft size={18} /> Voltar à escolha de perfil
      </button>
      <section className="login-card" aria-labelledby="login-title">
        <span className="login-symbol">
          {driver ? <Truck size={28} /> : <Package size={28} />}
        </span>
        <span className="eyebrow">SEU PRÓXIMO CAMINHO COMEÇA AQUI</span>
        <h1 id="login-title">
          Entre para seguir
          <br />
          <em>com a FRETTA.</em>
        </h1>
        <p className="muted">
          {driver
            ? "Encontre oportunidades de frete e conecte seu trabalho a quem precisa."
            : "Organize seu frete, compare propostas e converse com motoristas."}
        </p>
        <div className="login-role">
          {driver ? <Truck size={18} /> : <Package size={18} />} Você está
          entrando como <strong>{driver ? "motorista" : "cliente"}</strong>
        </div>
        <button className="google-login" onClick={onContinue}>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
            <path
              fill="#4285F4"
              d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"
            />
            <path
              fill="#34A853"
              d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.97-3.38.97-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z"
            />
            <path
              fill="#FBBC05"
              d="M6.41 13.93A6 6 0 0 1 6.1 12c0-.67.12-1.32.31-1.93V7.48H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.52l3.34-2.59Z"
            />
            <path
              fill="#EA4335"
              d="M12 5.95c1.47 0 2.79.51 3.82 1.51l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.48l3.34 2.59C7.2 7.71 9.4 5.95 12 5.95Z"
            />
          </svg>
          Continuar com Google <ArrowRight size={17} />
        </button>
        <div className="login-demo">
          <b>Login simulado</b>
          <p>
            Você entrará com o perfil fictício de Clayton. Nenhuma conta Google
            será acessada e nenhum dado será enviado.
          </p>
        </div>
        <small>
          Na versão integrada, você poderá entrar com sua conta Google.
        </small>
      </section>
      <footer>FRETTA · Conectando pessoas, movimentando histórias.</footer>
    </main>
  );
}
