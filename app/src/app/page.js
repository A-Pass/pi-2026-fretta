import Link from "next/link";
import { BrushCleaning, CheckCircle, Clock, ArrowRight } from "lucide-react";
import Button from '@mui/material/Button'; 
import { ROUTE_AUTH_SIGN_IN, ROUTE_AUTH_SIGN_UP } from "@/constants/routes";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* --- HEADER --- */}
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <BrushCleaning className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">HomeClean</span>
          </div>

          <nav className="flex items-center gap-4">
            <Link href={ROUTE_AUTH_SIGN_IN} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Entrar
            </Link>
            <Link href={ROUTE_AUTH_SIGN_UP}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#4f46e5', textTransform: 'none', fontWeight: 600 }}
              >
                Criar Conta
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 bg-gradient-to-b from-white to-slate-100">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl">
            Agende serviços de limpeza <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              de forma simples e rápida.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
            O HomeClean conecta você a profissionais de confiança para limpeza residencial, piscinas e muito mais. 
            Escolha o serviço, agende o melhor horário e pronto.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25"
            >
              Agendar um Serviço
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* --- FEATURES --- */}
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
              <CheckCircle className="w-8 h-8 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Profissionais Verificados</h3>
              <p className="text-slate-600">
                Trabalhamos apenas com profissionais avaliados e de confiança.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
              <Clock className="w-8 h-8 text-violet-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Agendamento Flexível</h3>
              <p className="text-slate-600">
                Escolha a data e o horário que melhor se encaixam na sua rotina.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
              <BrushCleaning className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tudo em um só lugar</h3>
              <p className="text-slate-600">
                Gerencie seus serviços, pagamentos e histórico pelo app.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <p>© 2024 HomeClean. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
