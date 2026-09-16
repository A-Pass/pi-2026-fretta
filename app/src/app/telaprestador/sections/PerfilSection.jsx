// src/app/telaprestador/sections/PerfilSection.jsx
"use client";
/* daniel */
import { Mail, IdCard, Phone, LogOut, Pencil } from "lucide-react";

function labelValue(label, value, icon) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 text-slate-700">
          <div className="text-slate-500">{icon}</div>
          <span className="text-xs font-black">{label}</span>
        </div>
      </div>
      <div className="text-sm font-black text-slate-900">{value || "—"}</div>
    </div>
  );
}

export default function PerfilSection({ usuario, carregando = false, onEditarPerfil, onLogout }) {
  const pessoa = usuario?.pessoa || {};

  const nome =
    pessoa?.primeiro_nome || pessoa?.ultimo_nome
      ? `${pessoa?.primeiro_nome ?? ""} ${pessoa?.ultimo_nome ?? ""}`.trim()
      : usuario?.email
      ? usuario.email.split("@")[0]
      : "Prestador";

  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Perfil</p>
        <p className="text-2xl font-black text-slate-900 mt-1">
          {carregando ? "Carregando..." : nome}
        </p>
        <p className="text-sm text-slate-600 mt-1">{usuario?.email ?? "—"}</p>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onEditarPerfil}
            className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700 flex items-center justify-center gap-2"
            disabled={!usuario}
          >
            <Pencil size={16} />
            Editar perfil
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </div>

      {labelValue("E-mail", usuario?.email, <Mail size={16} />)}
      {labelValue("CPF", pessoa?.cpf, <IdCard size={16} />)}
      {labelValue("Celular", pessoa?.celular, <Phone size={16} />)}
    </div>
  );
}
