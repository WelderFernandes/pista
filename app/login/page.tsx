"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signUp, authClient } from "@/lib/auth-client";
import { signUpSchema } from "@/lib/schemas";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [profile, setProfile] = useState<"instructor" | "student">("instructor");
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryProfile = params.get("profile");
      if (queryProfile === "instructor" || queryProfile === "student") {
        setProfile(queryProfile);
      }
    }
  }, []);

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (mode === "login") {
      if (!email || !password) {
        setError("Por favor, preencha todos os campos.");
        setLoading(false);
        return;
      }

      try {
        const { data, error: authError } = await signIn.email({
          email,
          password,
        });

        if (authError) {
          setError(authError.message || "E-mail ou senha incorretos.");
          setLoading(false);
          return;
        }

        setSuccess("Login efetuado com sucesso! Redirecionando...");
        
        // Redireciona de acordo com o perfil
        setTimeout(() => {
          if (profile === "instructor") {
            router.push("/instructor");
          } else {
            router.push("/student");
          }
        }, 1200);

      } catch (err) {
        setError("Ocorreu um erro ao tentar efetuar o login.");
        setLoading(false);
      }
    } else {
      // Cadastro/SignUp - Validação com Zod no Frontend
      const parsed = signUpSchema.safeParse({
        name,
        email,
        password,
        confirmPassword,
        role: profile,
        orgName: profile === "instructor" ? orgName : undefined,
      });

      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message || "Dados de cadastro inválidos.");
        setLoading(false);
        return;
      }

      try {
        // 1. Criar o usuário via Better Auth
        const { data: userData, error: signUpError } = await signUp.email({
          email,
          password,
          name,
        });

        if (signUpError) {
          setError(signUpError.message || "Erro ao criar sua conta.");
          setLoading(false);
          return;
        }

        // 2. Se for Instrutor, criar a Organização associada
        if (profile === "instructor") {
          const { data: orgData, error: orgError } = await authClient.organization.create({
            name: orgName,
            slug: slugify(orgName),
          });

          if (orgError) {
            setError(`Conta criada, mas falhou ao registrar a Autoescola: ${orgError.message}`);
            setLoading(false);
            return;
          }

          setSuccess("Autoescola e conta registradas com sucesso! Redirecionando...");
          setTimeout(() => {
            router.push("/instructor");
          }, 1500);
        } else {
          // Se for Aluno, redireciona diretamente para a área do aluno
          setSuccess("Conta de aluno criada com sucesso! Redirecionando...");
          setTimeout(() => {
            router.push("/student");
          }, 1500);
        }

      } catch (err) {
        setError("Ocorreu um erro no processo de registro.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex items-center justify-center p-4 md:p-12 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Background radial glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-500/5 dark:bg-orange-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-550/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

      {/* Main card */}
      <div className="w-full max-w-[1000px] bg-slate-50 border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 transition-all duration-300">
        
        {/* Left Side: Branding/Image */}
        <div className="md:w-1/2 relative hidden md:flex flex-col justify-between p-10 bg-slate-100 border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          {/* Subtle overlay decorative lines */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-blue-600/5 opacity-50" />
          
          <div className="z-10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-600 to-orange-500 flex items-center justify-center font-bold text-base shadow-lg shadow-orange-500/20 text-white">
              V
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">Volante Certo</span>
          </div>

          <div className="z-10 mt-12 mb-6">
            <span className="text-xs text-orange-600 dark:text-orange-500 font-bold uppercase tracking-wider">Acelere seu Aprendizado</span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
              {mode === "login" 
                ? "A ferramenta de alta performance para instrutores e alunos."
                : profile === "instructor" 
                  ? "Cadastre sua Autoescola e comece a gerenciar hoje mesmo." 
                  : "Crie sua conta de aluno e encontre instrutores credenciados."}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
              Monitore sua agenda de aulas, visualize relatórios financeiros detalhados ou acompanhe o checklist prático para o exame do Detran em uma única plataforma integrada.
            </p>
          </div>

          <div className="z-10 flex items-center gap-2 text-xs text-slate-550 dark:text-slate-500">
            <span>&copy; {new Date().getFullYear()} Volante Certo S.A.</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-slate-950/40 relative">
          <div className="max-w-md w-full mx-auto">
            {/* Mobile Logo Header */}
            <div className="md:hidden flex items-center gap-2 mb-6 justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-600 to-orange-500 flex items-center justify-center font-bold text-base shadow-lg shadow-orange-500/20 text-white">
                V
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">Volante Certo</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
              {mode === "login" ? "Acesse o Sistema" : (profile === "instructor" ? "Registre sua Autoescola" : "Criar Conta de Aluno")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              {mode === "login" 
                ? "Digite suas credenciais de acesso abaixo." 
                : (profile === "instructor" ? "Preencha as informações para registrar sua Autoescola." : "Preencha os campos para iniciar sua jornada de aprendizado.")}
            </p>

            {/* Profile Tabs Selector - Always show to let users choose role */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setProfile("instructor")}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  profile === "instructor"
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/10"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
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
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Sou Aluno
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs p-3 rounded-xl mb-4 font-semibold">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs p-3 rounded-xl mb-4 font-semibold">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === "signup" && (
                <>
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-1 uppercase" htmlFor="name">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Carlos Eduardo Silva"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-slate-350 dark:focus:border-slate-700"
                      required
                    />
                  </div>

                  {profile === "instructor" && (
                    <div>
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-1 uppercase" htmlFor="orgName">
                        Nome da Autoescola (Organização / Tenant)
                      </label>
                      <input
                        type="text"
                        id="orgName"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="Ex: Autoescola Volante Certo Pinheiros"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-slate-350 dark:focus:border-slate-700"
                        required
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-1 uppercase" htmlFor="email">
                  {profile === "instructor" ? "E-mail institucional" : "E-mail de acesso"}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={profile === "instructor" ? "instrutor@volantecerto.com" : "aluno@provedor.com"}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-slate-350 dark:focus:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-1 uppercase" htmlFor="password">
                  Senha de acesso
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-slate-350 dark:focus:border-slate-700"
                  required
                />
              </div>

              {mode === "signup" && (
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-1 uppercase" htmlFor="confirmPassword">
                    Confirmação de senha
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-slate-350 dark:focus:border-slate-700"
                    required
                  />
                </div>
              )}

              {mode === "login" && (
                <div className="flex justify-between items-center text-xs mt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-500 dark:text-slate-400">
                    <input type="checkbox" className="rounded bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-orange-600 focus:ring-0 focus:ring-offset-0" />
                    Lembrar de mim
                  </label>
                  <Link href="#" className="text-slate-500 hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full font-bold p-3.5 rounded-xl shadow-lg mt-4 text-xs transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 text-white disabled:opacity-50 ${
                  profile === "instructor"
                    ? "bg-orange-600 hover:bg-orange-700 shadow-orange-600/20"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                }`}
              >
                {loading ? (
                  <span>Aguarde...</span>
                ) : mode === "login" ? (
                  <>
                    Entrar no Painel
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    {profile === "instructor" ? "Registrar Autoescola" : "Criar Conta de Aluno"}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-slate-500">
              {mode === "login" ? (
                <>
                  {profile === "instructor" ? "Deseja cadastrar sua Autoescola? " : "Ainda não tem conta de aluno? "}
                  <button 
                    onClick={() => { setMode("signup"); setError(""); setSuccess(""); setPassword(""); setConfirmPassword(""); }}
                    className="font-bold text-slate-800 dark:text-white hover:underline cursor-pointer"
                  >
                    Registre-se agora
                  </button>
                </>
              ) : (
                <>
                  Já possui uma conta ativa?{" "}
                  <button 
                    onClick={() => { setMode("login"); setError(""); setSuccess(""); setPassword(""); setConfirmPassword(""); }}
                    className="font-bold text-slate-800 dark:text-white hover:underline cursor-pointer"
                  >
                    Faça login aqui
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
