import { Truck, Package, ArrowRight, Building2 } from "lucide-react";
import type { Role } from "@/contracts";

type Props = {
  role: Role;
  setRole: (r: Role) => void;
  onEnter: () => void;
  real?: boolean;
  companySelected?: boolean;
  onSelectCompany?: () => void;
};
export function WelcomeView({
  role,
  setRole,
  onEnter,
  real = false,
  companySelected,
  onSelectCompany,
}: Props) {
  return (
    <main className="welcome">
      <div className="brand">
        <Truck /> FRETTA<span>•</span>
      </div>
      <div className="welcome-copy">
        <span className="eyebrow">PEQUENOS FRETES. NOVOS COMEÇOS.</span>
        <h1>
          Movimentando
          <br />o que importa
          <br />
          <em>para você.</em>
        </h1>
        <p>
          Seu próximo caminho começa com uma boa conexão. Encontre quem leva
          seus planos mais longe.
        </p>
        <div className="role-grid">
          <button
            onClick={() => setRole("cliente")}
            className={!companySelected && role === "cliente" ? "chosen" : ""}
          >
            <Package />
            <b>Preciso de um frete</b>
            <span>Encontre seu motorista</span>
          </button>
          <button
            onClick={() => setRole("motorista")}
            className={!companySelected && role === "motorista" ? "chosen" : ""}
          >
            <Truck />
            <b>Sou motorista</b>
            <span>Encontre oportunidades</span>
          </button>
          {onSelectCompany && (
            <button
              type="button"
              onClick={onSelectCompany}
              aria-pressed={companySelected}
              className={
                companySelected
                  ? "role-grid-company chosen"
                  : "role-grid-company"
              }
            >
              <Building2 />
              <b>Sou uma empresa de transporte</b>
              <span>Gerencie motoristas e fretes</span>
            </button>
          )}
        </div>
        <button className="primary" onClick={() => onEnter()}>
          {real ? "Continuar" : "Explorar demonstração"}{" "}
          <ArrowRight size={18} />
        </button>
        {!real && (
          <small>Ambiente demonstrativo · sem cadastro ou cobrança real</small>
        )}
      </div>
      <div className="road-art">
        <Truck size={170} strokeWidth={1} />
        <span>EUNÁPOLIS E REGIÃO</span>
        <div className="road" />
      </div>
      <footer>Feito para aproximar pessoas e caminhos.</footer>
    </main>
  );
}
