"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<"instructor" | "student">("instructor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryProfile = params.get("profile");
      if (queryProfile === "instructor" || queryProfile === "student") {
        setProfile(queryProfile);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    // Direct routing based on selection for simulation
    if (profile === "instructor") {
      router.push("/instructor");
    } else {
      router.push("/student");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 md:p-12 relative overflow-hidden font-sans">
      {/* Background radial glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-[1000px] bg-slate-900/40 border border-slate-800 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10">
        
        {/* Left Side: Branding/Image */}
        <div className="md:w-1/2 relative hidden md:flex flex-col justify-between p-10 bg-slate-900 border-r border-slate-800 overflow-hidden">
          {/* Subtle overlay decorative lines */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-blue-600/5 opacity-50" />
          
          <div className="z-10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-600 to-orange-500 flex items-center justify-center font-bold text-base shadow-lg shadow-orange-500/20">
              V
            </div>
            <span className="font-bold text-sm tracking-tight text-white">Volante Certo</span>
          </div>

          <div className="z-10 mt-12 mb-6">
            <span className="text-xs text-orange-500 font-bold uppercase tracking-wider">Acelere seu Aprendizado</span>
            <h1 className="text-3xl font-extrabold text-white mt-2 leading-tight">
              A ferramenta de alta performance para instrutores e alunos.
            </h1>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Monitore sua agenda de aulas, visualize relatórios financeiros detalhados ou acompanhe o checklist prático para o exame do Detran em uma única plataforma integrada.
            </p>
          </div>

          <div className="z-10 flex items-center gap-2 text-xs text-slate-500">
            <span>&copy; {new Date().getFullYear()} Volante Certo S.A.</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-slate-950/40 relative">
          <div className="max-w-md w-full mx-auto">
            {/* Mobile Logo Header */}
            <div className="md:hidden flex items-center gap-2 mb-6 justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-600 to-orange-500 flex items-center justify-center font-bold text-base shadow-lg shadow-orange-500/20 text-white">
                V
              </div>
              <h1 className="font-bold text-lg text-white">Volante Certo</h1>
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-1 tracking-tight">Acesse o Sistema</h2>
            <p className="text-xs text-slate-400 mb-6">Digite suas credenciais de acesso abaixo.</p>

            {/* Profile Tabs Selector */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setProfile("instructor")}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  profile === "instructor"
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Sou Instrutor
              </button>
              <button
                type="button"
                onClick={() => setProfile("student")}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  profile === "student"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Sou Aluno
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl mb-4 font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase" htmlFor="email">
                  E-mail institucional
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={profile === "instructor" ? "instrutor@volantecerto.com" : "aluno@volantecerto.com"}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase" htmlFor="password">
                  Senha de acesso
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-700"
                  required
                />
              </div>

              <div className="flex justify-between items-center text-xs mt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-400">
                  <input type="checkbox" className="rounded bg-slate-950 border-slate-800 text-orange-600 focus:ring-0 focus:ring-offset-0" />
                  Lembrar de mim
                </label>
                <Link href="#" className="text-slate-500 hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>

              <button
                type="submit"
                className={`w-full font-bold p-3.5 rounded-xl shadow-lg mt-4 text-xs transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 text-white ${
                  profile === "instructor"
                    ? "bg-orange-600 hover:bg-orange-700 shadow-orange-600/20"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                }`}
              >
                Entrar no Painel
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-slate-500">
              Não possui cadastro?{" "}
              <Link href="#" className="font-bold text-white hover:underline">
                Contate sua Autoescola
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
