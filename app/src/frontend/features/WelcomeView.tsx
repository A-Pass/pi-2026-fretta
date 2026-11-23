import type { FormEvent } from "react";
import {
  Truck,
  Home,
  Building2,
  Package,
  MessageCircle,
  User,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Plus,
  Star,
  Bell,
  Check,
  Search,
  X,
} from "lucide-react";
import type { Role, Store, Freight, Proposal } from "@/contracts";
import { acceptProposal, money } from "./freights/rules";
import { statusLabels as labels, StatusBadge } from "../components/StatusBadge";
import { EmptyState } from "../components/EmptyState";

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
  companySelected = false,
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
          {real ? "Continuar" : "Entrar na FRETTA"} <ArrowRight size={18} />
        </button>
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
