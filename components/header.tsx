"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sparkle, Sun, Moon } from "@phosphor-icons/react";

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const isHome = pathname === "/";
  const isInstructors = pathname === "/instrutores";

  return (
    <header className="w-full border-b border-slate-200 bg-white/80 dark:border-slate-900 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
            V
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white">Volante Certo</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wider uppercase font-semibold">Plataforma de Direção</p>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-650 dark:text-slate-300">
          <Link 
            href="/" 
            className={`transition-colors hover:text-slate-900 dark:hover:text-white ${isHome ? "text-orange-600 dark:text-orange-500 font-semibold" : ""}`}
          >
            Início
          </Link>
          <Link 
            href="/instrutores" 
            className={`transition-colors hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 ${isInstructors ? "text-orange-600 dark:text-orange-500 font-semibold" : ""}`}
          >
            {isInstructors && <Sparkle className="w-4 h-4 animate-spin-slow" />}
            Instrutores
          </Link>
          <Link 
            href={isHome ? "#como-funciona" : "/#como-funciona"} 
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Como Funciona
          </Link>
          <Link 
            href={isHome ? "#faq" : "/#faq"} 
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Dúvidas
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900 dark:text-slate-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center"
              aria-label="Alternar tema"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-650" />
              )}
            </button>
          )}

          <Link 
            href="/login" 
            className="text-xs font-semibold px-4 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900 dark:text-slate-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Área Restrita
          </Link>
        </div>
      </div>
    </header>
  );
}
