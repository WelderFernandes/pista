"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";

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

  return (
    <header className="w-full border-b border-slate-200 bg-white/80 dark:border-slate-900 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-sm bg-linear-to-tr from-blue-600 to-blue-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all duration-300">
            P
          </div>
          <div>
            <h1 className="font-black text-lg leading-tight tracking-tight text-slate-900 dark:text-white">Pista</h1>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 tracking-wider uppercase font-bold">Gestão de Instrutores</p>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-650 dark:text-slate-300">
          <Link 
            href="/" 
            className={`transition-colors hover:text-blue-600 dark:hover:text-blue-500 ${isHome ? "text-blue-600 dark:text-blue-500 font-semibold" : ""}`}
          >
            Início
          </Link>
          <Link 
            href={isHome ? "#funcionalidades" : "/#funcionalidades"} 
            className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
          >
            Funcionalidades
          </Link>
          <Link 
            href={isHome ? "#planos" : "/#planos"} 
            className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
          >
            Planos
          </Link>
          <Link 
            href={isHome ? "#faq" : "/#faq"} 
            className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
          >
            Dúvidas
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-sm border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900 dark:text-slate-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center"
              aria-label="Alternar tema"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </button>
          )}

          <Link 
            href="/login" 
            className="text-xs font-semibold px-4 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900 dark:text-slate-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-sm"
          >
            Entrar
          </Link>

          <Link 
            href={isHome ? "#planos" : "/#planos"} 
            className="text-xs font-bold px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-sm"
          >
            Teste Grátis
          </Link>
        </div>
      </div>
    </header>
  );
}
