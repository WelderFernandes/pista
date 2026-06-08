"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkle } from "@phosphor-icons/react";

export function Header() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isInstructors = pathname === "/instrutores";

  return (
    <header className="w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
            V
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-white">Volante Certo</h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Plataforma de Direção</p>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link 
            href="/" 
            className={`transition-colors hover:text-white ${isHome ? "text-orange-500" : ""}`}
          >
            Início
          </Link>
          <Link 
            href="/instrutores" 
            className={`transition-colors hover:text-white flex items-center gap-1.5 ${isInstructors ? "text-orange-500 font-semibold" : ""}`}
          >
            {isInstructors && <Sparkle className="w-4 h-4 animate-spin-slow" />}
            Instrutores
          </Link>
          <Link 
            href={isHome ? "#como-funciona" : "/#como-funciona"} 
            className="hover:text-white transition-colors"
          >
            Como Funciona
          </Link>
          <Link 
            href={isHome ? "#faq" : "/#faq"} 
            className="hover:text-white transition-colors"
          >
            Dúvidas
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-xs font-semibold px-4 py-2 border border-slate-800 hover:border-slate-700 rounded-xl bg-slate-900/40 hover:bg-slate-900 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-slate-200"
          >
            Área Restrita
          </Link>
        </div>
      </div>
    </header>
  );
}
