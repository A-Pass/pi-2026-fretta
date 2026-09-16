'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Briefcase } from 'lucide-react';
import { Button } from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);

    // SIMULAÇÃO DE LOGIN
    setTimeout(() => {
      setLoading(false);
      alert('Login efetuado (simulado)');
      // futuramente: router.push('/telaprestador')
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-900">

      {/* TOPO / BRAND */}
      <header className="bg-emerald-600 pt-20 pb-16 px-8 rounded-b-[3rem] shadow-lg text-center">
        <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Briefcase className="text-white" size={32} />
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight">
          Bem-vindo de volta
        </h1>

        <p className="text-white/80 text-sm font-medium mt-2">
          Faça login para continuar
        </p>
      </header>

      {/* FORM */}
      <main className="px-6 -mt-10 flex-1">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100">

          {/* EMAIL */}
          <div className="mb-6">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full p-5 pl-12 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none"
              />
            </div>
          </div>

          {/* SENHA */}
          <div className="mb-8">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-2">
              Senha
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"
              />

              <input
                type={showSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full p-5 pl-12 pr-12 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none"
              />

              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BOTÃO */}
          <Button
            fullWidth
            disabled={loading}
            onClick={handleLogin}
            variant="contained"
            style={{
              backgroundColor: '#10b981',
              borderRadius: '20px',
              fontWeight: '900',
              padding: '18px',
              textTransform: 'none'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          {/* LINKS */}
          <div className="mt-6 text-center space-y-2">
            <button className="text-xs font-bold text-emerald-600">
              Esqueci minha senha
            </button>

            <p className="text-xs text-slate-400 font-medium">
              Não tem conta?{' '}
              <span className="text-emerald-600 font-black">
                Criar agora
              </span>
            </p>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="pb-6 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          PWA • Seguro • Rápido
        </p>
      </footer>

    </div>
  );
}
