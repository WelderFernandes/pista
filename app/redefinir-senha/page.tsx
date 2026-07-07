"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeSlash, ArrowCounterClockwise } from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<"otp" | "password">("otp");
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Timer para o reenvio de OTP
  const [timer, setTimer] = useState(60);
  const canResend = timer === 0;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Mutação para verificar o código OTP
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!email) throw new Error("E-mail não fornecido.");
      if (otp.length < 6) throw new Error("Por favor, digite o código OTP de 6 dígitos.");

      const { data, error: authError } = await authClient.emailOtp.checkVerificationOtp({
        email,
        otp,
        type: "forget-password",
      });

      if (authError) {
        throw new Error(authError.message || "Código inválido ou expirado.");
      }

      return data;
    },
    onSuccess: () => {
      setSuccess("Código verificado com sucesso!");
      setError("");
      setTimeout(() => {
        setSuccess("");
        setStep("password");
      }, 1000);
    },
    onError: (err: Error) => {
      setError(err.message);
    }
  });

  // Mutação para redefinir a senha
  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      if (password !== confirmPassword) {
        throw new Error("As senhas não coincidem.");
      }

      const { data, error: authError } = await authClient.emailOtp.resetPassword({
        email,
        otp,
        password,
      });

      if (authError) {
        throw new Error(authError.message || "Erro ao redefinir a senha. Tente novamente.");
      }

      return data;
    },
    onSuccess: () => {
      setSuccess("Senha redefinida com sucesso! Redirecionando para o login...");
      setError("");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
    onError: (err: Error) => {
      setError(err.message);
    }
  });

  // Mutação para reenviar o OTP
  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      if (!email) throw new Error("E-mail é obrigatório.");
      const { data, error: authError } = await authClient.emailOtp.requestPasswordReset({
        email,
      });

      if (authError) {
        throw new Error(authError.message || "Erro ao reenviar código.");
      }

      return data;
    },
    onSuccess: () => {
      setSuccess("Um novo código OTP foi enviado ao seu e-mail.");
      setError("");
      setTimer(60);
    },
    onError: (err: Error) => {
      setError(err.message);
    }
  });

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    verifyOtpMutation.mutate();
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    resetPasswordMutation.mutate();
  };

  const handleResend = () => {
    setError("");
    setSuccess("");
    resendOtpMutation.mutate();
  };

  return (
    <div className="w-full max-w-[500px] bg-slate-50 border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden p-8 md:p-12 relative z-10 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6 justify-center">
        <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-orange-600 to-orange-500 flex items-center justify-center font-bold text-base shadow-lg shadow-orange-500/20 text-white">
          V
        </div>
        <span className="font-bold text-lg text-slate-900 dark:text-white">Volante Certo</span>
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight text-center">
        {step === "otp" ? "Verificação OTP" : "Criar Nova Senha"}
      </h2>
      <p className="text-xs text-slate-550 dark:text-slate-400 mb-6 text-center">
        {step === "otp" 
          ? `Digite o código OTP de 6 dígitos enviado para ${email || "seu e-mail"}.`
          : "Crie uma nova senha de acesso forte e segura."
        }
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs p-3 rounded-xl mb-4 font-semibold text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs p-3 rounded-xl mb-4 font-semibold text-center">
          {success}
        </div>
      )}

      {step === "otp" ? (
        <form onSubmit={handleVerifyOtp} className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Label className="text-xs text-slate-500">Código de Verificação</Label>
            
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} className="w-12 h-12 rounded-xl text-lg font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-within:border-orange-500" />
                <InputOTPSlot index={1} className="w-12 h-12 rounded-xl text-lg font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-within:border-orange-500" />
                <InputOTPSlot index={2} className="w-12 h-12 rounded-xl text-lg font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-within:border-orange-500" />
                <InputOTPSlot index={3} className="w-12 h-12 rounded-xl text-lg font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-within:border-orange-500" />
                <InputOTPSlot index={4} className="w-12 h-12 rounded-xl text-lg font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-within:border-orange-500" />
                <InputOTPSlot index={5} className="w-12 h-12 rounded-xl text-lg font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-within:border-orange-500" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            type="submit"
            disabled={verifyOtpMutation.isPending || otp.length < 6}
            className="w-full font-bold p-3.5 rounded-xl shadow-lg text-xs transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 text-white disabled:opacity-50 h-11 bg-orange-600 hover:bg-orange-700 shadow-orange-600/20"
          >
            {verifyOtpMutation.isPending ? "Verificando..." : "Verificar Código"}
          </Button>

          <div className="text-center text-xs">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendOtpMutation.isPending}
                className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-bold hover:underline cursor-pointer disabled:opacity-50 mx-auto"
              >
                <ArrowCounterClockwise className="w-4 h-4 animate-spin-hover" />
                Reenviar Código OTP
              </button>
            ) : (
              <span className="text-slate-500">
                Reenviar código em <strong className="text-slate-800 dark:text-white font-mono">{timer}s</strong>
              </span>
            )}
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="password">Nova Senha</Label>
            <div className="mt-1">
              <InputGroup className="rounded-xl border bg-slate-50 dark:bg-slate-950 p-1 h-11 transition-colors border-slate-200 dark:border-slate-800 focus-within:border-orange-500">
                <InputGroupAddon align="inline-start">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </InputGroupAddon>
                <InputGroupInput
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <div className="mt-1">
              <InputGroup className="rounded-xl border bg-slate-50 dark:bg-slate-950 p-1 h-11 transition-colors border-slate-200 dark:border-slate-800 focus-within:border-orange-500">
                <InputGroupAddon align="inline-start">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </InputGroupAddon>
                <InputGroupInput
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
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
          </div>

          <Button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full font-bold p-3.5 rounded-xl shadow-lg mt-4 text-xs transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 text-white disabled:opacity-50 h-11 bg-orange-600 hover:bg-orange-700 shadow-orange-600/20"
          >
            {resetPasswordMutation.isPending ? "Redefinindo..." : "Redefinir Senha"}
          </Button>
        </form>
      )}

      <div className="mt-8 text-center text-xs">
        <Link href="/login" className="font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white hover:underline">
          Voltar para o Login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex items-center justify-center p-4 md:p-12 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Background radial glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-500/5 dark:bg-orange-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-550/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

      <Suspense fallback={<div>Carregando formulário...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
