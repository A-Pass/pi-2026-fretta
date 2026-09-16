// src/components/ModalEditarPerfil.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Pencil, Check, Eye, EyeOff, Mail, Phone, IdCard, User } from "lucide-react";

/**
 * ModalEditarPerfil (pronto p/ integração)
 * - Mantém fluxo original: habilita edição por campo -> valida -> onSubmit(payload)
 * - IDs podem ser string
 *
 * Espera usuario:
 * { id, email, pessoa_id, pessoa?: { primeiro_nome, ultimo_nome, cpf, celular } }
 */
export default function ModalEditarPerfil({ usuario, onClose, onSubmit }) {
  const pessoa = usuario?.pessoa || {};

  const [edit, setEdit] = useState({
    email: false,
    primeiro_nome: false,
    ultimo_nome: false,
    cpf: false,
    celular: false,
    senha: false,
  });

  const [form, setForm] = useState({
    email: usuario?.email ?? "",
    primeiro_nome: pessoa?.primeiro_nome ?? "",
    ultimo_nome: pessoa?.ultimo_nome ?? "",
    cpf: pessoa?.cpf ?? "",
    celular: pessoa?.celular ?? "",
    senha: "",
  });

  const [showSenha, setShowSenha] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    setForm({
      email: usuario?.email ?? "",
      primeiro_nome: pessoa?.primeiro_nome ?? "",
      ultimo_nome: pessoa?.ultimo_nome ?? "",
      cpf: pessoa?.cpf ?? "",
      celular: pessoa?.celular ?? "",
      senha: "",
    });
    setEdit({
      email: false,
      primeiro_nome: false,
      ultimo_nome: false,
      cpf: false,
      celular: false,
      senha: false,
    });
    setErro("");
    setShowSenha(false);
    setSalvando(false);
  }, [usuario?.id]);

  const temMudancas = useMemo(() => {
    const baseEmail = usuario?.email ?? "";
    const basePN = pessoa?.primeiro_nome ?? "";
    const baseUN = pessoa?.ultimo_nome ?? "";
    const baseCpf = pessoa?.cpf ?? "";
    const baseCel = pessoa?.celular ?? "";

    return (
      form.email !== baseEmail ||
      form.primeiro_nome !== basePN ||
      form.ultimo_nome !== baseUN ||
      String(form.cpf || "") !== String(baseCpf || "") ||
      String(form.celular || "") !== String(baseCel || "") ||
      Boolean(form.senha)
    );
  }, [form, usuario, pessoa]);

  function toggleEdit(field) {
    setEdit((s) => ({ ...s, [field]: !s[field] }));
    setErro("");
    if (field === "senha") setShowSenha(false);
    if (field === "senha") setForm((f) => ({ ...f, senha: "" }));
  }

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErro("");
  }

  function sanitizePhone(v) {
    return String(v || "").replace(/[^\d()+\-\s]/g, "");
  }
  function sanitizeCpf(v) {
    return String(v || "").replace(/[^\d.\-]/g, "");
  }

  function validate() {
    if (!usuario?.id) return "Usuário inválido.";

    const email = String(form.email || "").trim().toLowerCase();
    if (edit.email && !email.includes("@")) return "E-mail inválido.";

    if (edit.primeiro_nome && !String(form.primeiro_nome || "").trim()) return "Informe o primeiro nome.";
    if (edit.ultimo_nome && !String(form.ultimo_nome || "").trim()) return "Informe o sobrenome.";

    if (edit.senha) {
      const s = String(form.senha || "");
      if (s.length < 6) return "A senha deve ter no mínimo 6 caracteres.";
    }

    return "";
  }

  async function handleSave() {
    const msg = validate();
    if (msg) {
      setErro(msg);
      return;
    }

    const payload = {
      id: usuario.id, // string ok
      email: String(form.email || "").trim().toLowerCase(),
      senha: form.senha ? String(form.senha) : undefined,
      pessoa_id: usuario.pessoa_id,

      pessoa: {
        id: usuario.pessoa_id,
        primeiro_nome: String(form.primeiro_nome || "").trim(),
        ultimo_nome: String(form.ultimo_nome || "").trim(),
        cpf: String(form.cpf || "").trim(),
        celular: String(form.celular || "").trim(),
      },
    };

    setSalvando(true);
    setErro("");
    try {
      await onSubmit?.(payload); // página decide mock vs backend
      onClose?.();
    } catch (e) {
      setErro(e?.message || "Não foi possível salvar. Tente novamente.");
      setSalvando(false);
    }
  }

  if (!usuario) return null;

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">Editar perfil</h2>
          <p className="text-[11px] text-slate-500 font-black mt-1">Clique no lápis para habilitar edição em cada campo.</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50"
          title="Fechar"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <FieldRow icon={<Mail size={16} />} label="E-mail" editable={edit.email} onToggle={() => toggleEdit("email")}>
          <input
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            disabled={!edit.email}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none disabled:bg-slate-50 disabled:text-slate-500"
            placeholder="seu@email.com"
            inputMode="email"
          />
        </FieldRow>

        <div className="grid grid-cols-2 gap-3">
          <FieldRow icon={<User size={16} />} label="Primeiro nome" editable={edit.primeiro_nome} onToggle={() => toggleEdit("primeiro_nome")}>
            <input
              value={form.primeiro_nome}
              onChange={(e) => setField("primeiro_nome", e.target.value)}
              disabled={!edit.primeiro_nome}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="Ex: Daniel"
            />
          </FieldRow>

          <FieldRow icon={<User size={16} />} label="Sobrenome" editable={edit.ultimo_nome} onToggle={() => toggleEdit("ultimo_nome")}>
            <input
              value={form.ultimo_nome}
              onChange={(e) => setField("ultimo_nome", e.target.value)}
              disabled={!edit.ultimo_nome}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="Ex: Mendes"
            />
          </FieldRow>
        </div>

        <FieldRow icon={<IdCard size={16} />} label="CPF" editable={edit.cpf} onToggle={() => toggleEdit("cpf")}>
          <input
            value={form.cpf}
            onChange={(e) => setField("cpf", sanitizeCpf(e.target.value))}
            disabled={!edit.cpf}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none disabled:bg-slate-50 disabled:text-slate-500"
            placeholder="000.000.000-00"
          />
        </FieldRow>

        <FieldRow icon={<Phone size={16} />} label="Celular" editable={edit.celular} onToggle={() => toggleEdit("celular")}>
          <input
            value={form.celular}
            onChange={(e) => setField("celular", sanitizePhone(e.target.value))}
            disabled={!edit.celular}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none disabled:bg-slate-50 disabled:text-slate-500"
            placeholder="(99) 99999-9999"
          />
        </FieldRow>

        <FieldRow
          icon={
            <button
              type="button"
              onClick={() => setShowSenha((v) => !v)}
              className="p-1 rounded-lg hover:bg-slate-100"
              title={showSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          label="Senha"
          editable={edit.senha}
          onToggle={() => toggleEdit("senha")}
        >
          <input
            type={showSenha ? "text" : "password"}
            value={form.senha}
            onChange={(e) => setField("senha", e.target.value)}
            disabled={!edit.senha}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none disabled:bg-slate-50 disabled:text-slate-500"
            placeholder={edit.senha ? "Nova senha (mín. 6)" : "••••••••"}
          />
        </FieldRow>

        {erro ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm font-black text-rose-700">{erro}</div>
        ) : null}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={salvando}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={salvando || !temMudancas}
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, icon, children, editable, onToggle }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="text-slate-500">{icon}</div>
          <span className="text-xs font-black text-slate-700">{label}</span>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-black border ${
            editable
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
          title={editable ? "Desativar edição" : "Editar"}
        >
          {editable ? <Check size={14} /> : <Pencil size={14} />}
          {editable ? "Editando" : "Editar"}
        </button>
      </div>

      {children}
    </div>
  );
}
