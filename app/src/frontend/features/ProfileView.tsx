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

type Props = {
  name: string;
  setName: (s: string) => void;
  role: Role;
  subscription: boolean;
  setSubscription: (b: boolean) => void;
  flash: (s: string) => void;
  setEntered: (b: boolean) => void;
};
export function ProfileView({
  name,
  setName,
  role,
  subscription,
  setSubscription,
  flash,
  setEntered,
}: Props) {
  return (
    <>
      <span className="eyebrow">DO SEU JEITO</span>
      <h1>Meu perfil</h1>
      <section className="panel profile">
        <div className="avatar large">{name.slice(0, 2).toUpperCase()}</div>
        <h2>{name}</h2>
        <p>
          {role === "cliente" ? "Cliente" : "Motorista"} · Conta de demonstração
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            flash("Nome atualizado nesta sessão.");
          }}
        >
          <label>
            Nome de exibição
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={80}
            />
          </label>
          <button className="primary">Salvar perfil</button>
        </form>
        {role === "motorista" && (
          <div className="subscription">
            <h3>Assinatura do motorista</h3>
            <p>R$ 49,90/mês · cobrança real pendente de integração.</p>
            <button
              className="secondary"
              onClick={() => setSubscription(!subscription)}
            >
              {subscription
                ? "Simular assinatura vencida"
                : "Simular assinatura ativa"}
            </button>
            <p>
              {subscription
                ? "Ativa na demonstração"
                : "Vencida na demonstração"}
            </p>
          </div>
        )}
        <button className="secondary" onClick={() => setEntered(false)}>
          Voltar à seleção de perfil
        </button>
        <button
          className="danger"
          onClick={() => {
            if (confirm("Apagar os dados locais e restaurar os exemplos?"))
              resetDemo();
          }}
        >
          Restaurar demonstração
        </button>
      </section>
    </>
  );
}
