import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen  bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 p-12 lg:px-8 transition-colors duration-300 relative overflow-hidden">

      {/* <div className="min-h-screen text-slate-900 flex flex-1 items-center justify-center p-4 md:p-12 relative overflow-hidden font-sans transition-colors duration-300"> */}
      {/* Background radial glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-500/5 dark:bg-orange-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-550/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

      <LoginForm />
    </div>

  );
}
