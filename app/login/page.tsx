import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex items-center justify-center p-4 md:p-12 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Background radial glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-500/5 dark:bg-orange-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-550/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

      <LoginForm />
    </div>
  );
}
