"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: ""
    }
  });

  const requestResetMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data, error: authError } = await authClient.emailOtp.requestPasswordReset({
        email,
      });

      if (authError) {
        throw new Error(authError.message || "Erro ao solicitar redefinição de senha.");
      }

      return data;
    },
    onSuccess: (_, email) => {
      setSuccess("Código de recuperação enviado! Redirecionando...");
      setTimeout(() => {
        router.push(`/redefinir-senha?email=${encodeURIComponent(email)}`);
      }, 1500);
    },
    onError: (err: Error) => {
      setError(err.message || "Não foi possível processar a solicitação.");
    }
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setError("");
    setSuccess("");
    requestResetMutation.mutate(data.email);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex items-center justify-center p-4 md:p-12 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Background radial glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-500/5 dark:bg-orange-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-550/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

      <div className="w-full max-w-[500px] bg-slate-50 border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden p-8 md:p-12 relative z-10 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-orange-600 to-orange-500 flex items-center justify-center font-bold text-base shadow-lg shadow-orange-500/20 text-white">
            V
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">Volante Certo</span>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight text-center">
          Recuperar Senha
        </h2>
        <p className="text-xs text-slate-550 dark:text-slate-400 mb-6 text-center">
          Digite seu e-mail cadastrado para receber um código OTP de recuperação.
        </p>

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
          <div>
            <Label htmlFor="email">E-mail cadastrado</Label>
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
                  placeholder="seuemail@provedor.com"
                  {...register("email", { required: "O e-mail é obrigatório." })}
                />
              </InputGroup>
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-500 font-semibold mt-1 pl-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={requestResetMutation.isPending}
            className="w-full font-bold p-3.5 rounded-xl shadow-lg mt-4 text-xs transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 text-white disabled:opacity-50 h-11 bg-orange-600 hover:bg-orange-700 shadow-orange-600/20"
          >
            {requestResetMutation.isPending ? "Enviando..." : "Enviar Código OTP"}
          </Button>
        </form>

        <div className="mt-8 text-center text-xs">
          <Link href="/login" className="font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white hover:underline">
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}
