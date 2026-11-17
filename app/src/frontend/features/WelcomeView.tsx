import type { FormEvent } from "react";
import {
  Truck,
  Home,
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
import { resetDemo } from "../api/client";
import { acceptProposal, money } from "./freights/rules";
import { statusLabels as labels, StatusBadge } from "../components/StatusBadge";
import { EmptyState } from "../components/EmptyState";

type Props = { role: Role; setRole: (r: Role) => void; onEnter: () => void };
export function WelcomeView({ role, setRole, onEnter }: Props) {
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
            className={role === "cliente" ? "chosen" : ""}
          >
            <Package />
            <b>Preciso de um frete</b>
            <span>Encontre seu motorista</span>
          </button>
          <button
            onClick={() => setRole("motorista")}
            className={role === "motorista" ? "chosen" : ""}
          >
            <Truck />
            <b>Sou motorista</b>
            <span>Encontre oportunidades</span>
          </button>
        </div>
        <button className="primary" onClick={() => onEnter()}>
          Explorar demonstração <ArrowRight size={18} />
        </button>
        <small>Ambiente demonstrativo · sem cadastro ou cobrança real</small>
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
