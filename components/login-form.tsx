"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { signIn, signUp, authClient } from "@/lib/auth-client";
import { signUpSchema } from "@/lib/schemas";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { z } from "zod";

type FormData = z.infer<typeof signUpSchema>;

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [profile, setProfile] = useState<"instructor" | "student">("instructor");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      orgName: ""
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryProfile = params.get("profile");
      const queryName = params.get("name");
      const queryEmail = params.get("email");

      if (queryProfile === "instructor" || queryProfile === "student") {
        setTimeout(() => {
          setProfile(queryProfile);
        }, 0);
      }

      if (queryName || queryEmail) {
        setTimeout(() => {
          setMode("signup");
          const defaultName = queryName || "";
          const defaultEmail = queryEmail || "";
          const defaultOrgName = queryProfile === "instructor" && defaultName ? `Aulas de ${defaultName}` : "";
          
          reset({
            name: defaultName,
            email: defaultEmail,
            password: "",
            confirmPassword: "",
            orgName: defaultOrgName
          });
        }, 0);
      }
    }
  }, [reset]);

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

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { data: authData, error: authError } = await signIn.email({
        email: data.email,
        password: data.password,
      });
      if (authError) {
        throw new Error(authError.message || "E-mail ou senha incorretos.");
      }

      // Busca as organizações do usuário e define a primeira como ativa
      // Isso garante que activeOrganizationId esteja preenchido na sessão
      const { data: orgsData } = await authClient.organization.list();
      if (orgsData && orgsData.length > 0) {
        await authClient.organization.setActive({
          organizationId: orgsData[0].id,
        });
      }

      return authData;
    },
    onSuccess: () => {
      setSuccess("Login efetuado com sucesso! Redirecionando...");
      setTimeout(() => {
        if (profile === "instructor") {
          router.push("/instructor");
        } else {
          router.push("/student");
        }
      }, 1200);
    },
    onError: (err: Error) => {
      setError(err.message || "Ocorreu um erro ao tentar efetuar o login.");
    }
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const parsed = signUpSchema.safeParse({
        ...data,
        role: profile,
        orgName: profile === "instructor" ? data.orgName : undefined,
      });

      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "Dados de cadastro inválidos.");
      }

      const { data: userData, error: signUpError } = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (signUpError) {
        throw new Error(signUpError.message || "Erro ao criar sua conta.");
      }

      if (profile === "instructor" && data.orgName) {
        const { data: orgData, error: orgError } = await authClient.organization.create({
          name: data.orgName,
          slug: slugify(data.orgName),
        });

        if (orgError) {
          throw new Error(`Conta criada, mas falhou ao registrar a Autoescola: ${orgError.message}`);
        }
      }

      return userData;
    },
    onSuccess: () => {
      if (profile === "instructor") {
        setSuccess("Autoescola e conta registradas com sucesso! Redirecionando...");
        setTimeout(() => {
          router.push("/instructor");
        }, 1500);
      } else {
        setSuccess("Conta de aluno criada com sucesso! Redirecionando...");
        setTimeout(() => {
          router.push("/student");
        }, 1500);
      }
    },
    onError: (err: Error) => {
      setError(err.message || "Ocorreu um erro no processo de registro.");
    }
  });

  const onSubmit = (data: FormData) => {
    setError("");
    setSuccess("");
    if (mode === "login") {
      loginMutation.mutate(data);
    } else {
      signUpMutation.mutate(data);
    }
  };

  return (
    <div className="w-full max-w-[1000px] bg-slate-50 border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 transition-all duration-300">
      
      {/* Left Side: Branding/Image */}
      <div className="md:w-1/2 relative hidden md:flex flex-col justify-between p-10 bg-slate-100 border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-orange-600/5 to-blue-600/5 opacity-50" />
        
        <div className="z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-orange-600 to-orange-500 flex items-center justify-center font-bold text-base shadow-lg shadow-orange-500/20 text-white">
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
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-orange-600 to-orange-500 flex items-center justify-center font-bold text-base shadow-lg shadow-orange-500/20 text-white">
              V
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">Volante Certo</span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
            {mode === "login" ? "Acesse o Sistema" : (profile === "instructor" ? "Registre sua Autoescola" : "Criar Conta de Aluno")}
          </h2>
          <p className="text-xs text-slate-550 dark:text-slate-400 mb-6">
            {mode === "login" 
              ? "Digite suas credenciais de acesso abaixo." 
              : (profile === "instructor" ? "Preencha as informações para registrar sua Autoescola." : "Preencha os campos para iniciar sua jornada de aprendizado.")}
          </p>

          {/* Profile Tabs Selector */}
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

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {mode === "signup" && (
              <>
                <div>
                  <Label htmlFor="name">Nome completo</Label>
                  <div className="mt-1">
                    <InputGroup className={`rounded-xl border bg-slate-50 dark:bg-slate-950 p-1 h-11 transition-colors ${errors.name ? 'border-red-500 focus-within:border-red-500' : 'border-slate-200 dark:border-slate-800 focus-within:border-orange-500'}`}>
                      <InputGroupAddon align="inline-start">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </InputGroupAddon>
                      <InputGroupInput
                        type="text"
                        id="name"
                        placeholder="Ex: Carlos Eduardo Silva"
                        {...register("name")}
                      />
                    </InputGroup>
                  </div>
                  {errors.name && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1 pl-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {profile === "instructor" && (
                  <div>
                    <Label htmlFor="orgName">Nome da Autoescola (Organização / Tenant)</Label>
                    <div className="mt-1">
                      <InputGroup className={`rounded-xl border bg-slate-50 dark:bg-slate-950 p-1 h-11 transition-colors ${errors.orgName ? 'border-red-500 focus-within:border-red-500' : 'border-slate-200 dark:border-slate-800 focus-within:border-orange-500'}`}>
                        <InputGroupAddon align="inline-start">
                          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </InputGroupAddon>
                        <InputGroupInput
                          type="text"
                          id="orgName"
                          placeholder="Ex: Autoescola Volante Certo Pinheiros"
                          {...register("orgName")}
                        />
                      </InputGroup>
                    </div>
                    {errors.orgName && (
                      <p className="text-[11px] text-red-500 font-semibold mt-1 pl-1">
                        {errors.orgName.message}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            <div>
              <Label htmlFor="email">
                {profile === "instructor" ? "E-mail institucional" : "E-mail de acesso"}
              </Label>
              <div className="mt-1">
                <InputGroup className={`rounded-xl border bg-slate-50 dark:bg-slate-950 p-1 h-11 transition-colors ${errors.email ? 'border-red-500 focus-within:border-red-500' : 'border-slate-200 dark:border-slate-800 focus-within:border-orange-500'}`}>
                  <InputGroupAddon align="inline-start">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </InputGroupAddon>
                  <InputGroupInput
                    type="email"
                    id="email"
                    placeholder={profile === "instructor" ? "instrutor@volantecerto.com" : "aluno@provedor.com"}
                    {...register("email")}
                  />
                </InputGroup>
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 font-semibold mt-1 pl-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Senha de acesso</Label>
              <div className="mt-1">
                <InputGroup className={`rounded-xl border bg-slate-50 dark:bg-slate-950 p-1 h-11 transition-colors ${errors.password ? 'border-red-500 focus-within:border-red-500' : 'border-slate-200 dark:border-slate-800 focus-within:border-orange-500'}`}>
                  <InputGroupAddon align="inline-start">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </InputGroupAddon>
                  <InputGroupInput
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  <InputGroupAddon align="inline-end">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                    >
                      {showPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500 font-semibold mt-1 pl-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {mode === "signup" && (
              <div>
                <Label htmlFor="confirmPassword">Confirmação de senha</Label>
                <div className="mt-1">
                  <InputGroup className={`rounded-xl border bg-slate-50 dark:bg-slate-950 p-1 h-11 transition-colors ${errors.confirmPassword ? 'border-red-500 focus-within:border-red-500' : 'border-slate-200 dark:border-slate-800 focus-within:border-orange-500'}`}>
                    <InputGroupAddon align="inline-start">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </InputGroupAddon>
                    <InputGroupInput
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                    />
                    <InputGroupAddon align="inline-end">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                      >
                        {showConfirmPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1 pl-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}

            {mode === "login" && (
              <div className="flex justify-between items-center text-xs mt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-500 dark:text-slate-400">
                  <input type="checkbox" className="rounded bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-orange-600 focus:ring-0 focus:ring-offset-0" />
                  Lembrar de mim
                </label>
                <Link href="/recuperar-senha" className="text-slate-550 hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              disabled={loginMutation.isPending || signUpMutation.isPending}
              className={`w-full font-bold p-3.5 rounded-xl shadow-lg mt-4 text-xs transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 text-white disabled:opacity-50 h-11 ${
                profile === "instructor"
                  ? "bg-orange-600 hover:bg-orange-700 shadow-orange-600/20"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
              }`}
            >
              {loginMutation.isPending || signUpMutation.isPending ? (
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
            </Button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500">
            {mode === "login" ? (
              <>
                {profile === "instructor" ? "Deseja cadastrar sua Autoescola? " : "Ainda não tem conta de aluno? "}
                <button 
                  onClick={() => { setMode("signup"); setError(""); setSuccess(""); reset(); }}
                  className="font-bold text-slate-800 dark:text-white hover:underline cursor-pointer"
                >
                  Registre-se agora
                </button>
              </>
            ) : (
              <>
                Já possui uma conta ativa?{" "}
                <button 
                  onClick={() => { setMode("login"); setError(""); setSuccess(""); reset(); }}
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
  );
}
