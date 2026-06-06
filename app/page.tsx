"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<"instructor" | "student" | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-orange-500/20">
            V
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">Volante Certo</h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Plataforma de Direção</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-300 font-medium">Sistema Online</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 z-10 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider">
            Bem-vindo ao Volante Certo
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-300">
            Gerenciamento Inteligente para Autoescolas
          </h2>
          <p className="text-slate-400 mt-4 text-base md:text-lg">
            Escolha abaixo o portal de acesso desejado para começar a gerenciar suas aulas e acompanhar seu progresso prático.
          </p>
        </div>

        {/* Portal Cards Selector */}
        <div className="grid md:grid-cols-2 gap-8 w-full">
          {/* Instructor Card */}
          <Link
            href="/login?profile=instructor"
            onMouseEnter={() => setHoveredCard("instructor")}
            onMouseLeave={() => setHoveredCard(null)}
            className={`group relative rounded-2xl border p-8 bg-slate-900/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between h-[280px] overflow-hidden ${
              hoveredCard === "instructor"
                ? "border-orange-500/50 shadow-2xl shadow-orange-500/10 -translate-y-1"
                : "border-slate-800"
            }`}
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="z-10">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Portal do Instrutor</h3>
              <p className="text-slate-400 mt-2 text-sm">
                Gerencie sua agenda de aulas, controle o progresso prático dos alunos e visualize relatórios financeiros detalhados de faturamento.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-orange-400 z-10 group-hover:translate-x-1 transition-transform">
              Acessar Painel
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Student Card */}
          <Link
            href="/login?profile=student"
            onMouseEnter={() => setHoveredCard("student")}
            onMouseLeave={() => setHoveredCard(null)}
            className={`group relative rounded-2xl border p-8 bg-slate-900/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between h-[280px] overflow-hidden ${
              hoveredCard === "student"
                ? "border-blue-500/50 shadow-2xl shadow-blue-500/10 -translate-y-1"
                : "border-slate-800"
            }`}
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l9-5-9-5-9 5 9 5zm0 0v6m0 0l3-3m-3 3l-3-3" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Portal do Aluno</h3>
              <p className="text-slate-400 mt-2 text-sm">
                Consulte suas próximas aulas, acompanhe seu progresso prático por etapas e realize o pagamento de faturas pendentes de forma simples.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-blue-400 z-10 group-hover:translate-x-1 transition-transform">
              Ver Meu Painel
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-8 text-slate-500 text-xs z-10 border-t border-slate-900">
        &copy; {new Date().getFullYear()} Volante Certo S.A. Todos os direitos reservados.
      </footer>
    </div>
  );
}
