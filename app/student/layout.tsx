"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";
import { useSession } from "@/lib/auth-client";
import { useApp } from "@/lib/context";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { students } = useApp();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const student = students.find((s) => s.userId === session?.user?.id) || students.find((s) => s.id === "mariana-costa") || students[0];

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const navItems = [
    {
      label: "Início",
      href: "/student",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-6 h-6 text-blue-655 dark:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      )
    },
    {
      label: "Agenda",
      href: "/student/agenda",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-6 h-6 text-blue-655 dark:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v13a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H8V3a1 1 0 00-1-1zM4 8h16v11H4V8zm2 2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1v-2z" />
        </svg>
      )
    },
    {
      label: "Progresso",
      href: "/student/progress",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-6 h-6 text-blue-655 dark:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2 10a2 2 0 012-2h3a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8zM15 10a2 2 0 012-2h3a2 2 0 012 2v8a2 2 0 01-2 2h-3a2 2 0 01-2-2v-8zM8.5 4a1.5 1.5 0 011.5-1.5h2a1.5 1.5 0 011.5 1.5v14a1.5 1.5 0 01-1.5 1.5h-2a1.5 1.5 0 01-1.5-1.5V4z" />
        </svg>
      )
    },
    {
      label: "Perfil",
      href: "/student/profile",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-6 h-6 text-blue-655 dark:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M18 10a6 6 0 11-12 0 6 6 0 0112 0zm-6 8a8 8 0 00-8 8h16a8 8 0 00-8-8z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen pb-[80px] md:pb-0 md:pl-[240px] flex flex-col font-sans transition-colors duration-300">
      {/* Top Selector Bar (Switch Portals) */}
      <div className="bg-slate-900 text-white text-xs py-2 px-6 flex justify-between items-center z-50 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-[10px] text-slate-350">Modo Aluno Ativo</span>
        </div>
        <Link 
          href="/" 
          className="text-blue-400 hover:text-blue-355 transition-colors font-semibold flex items-center gap-1 text-[11px]"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Trocar Portal
        </Link>
      </div>

      {/* Top Nav Header */}
      <header className="w-full sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between px-6 py-4 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3">
          <img
            alt="Foto de perfil do aluno"
            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
            src={student?.photoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDcYC49gnQHyORIvqGwE3WVPlQpEEo_2rcGqxv90gPI0UL-8cHL1jE-hr08ErRhrGyaOCnzIXFAvAu-Y23apkm4mU1oFNL7XGlQDshIjte4e-Lljs0EI4uQuth6rnfe32x5z6CxN42rOxE8KXNzUYFI3snjUmmlRKrmnJcuudKc3zvyQjnucFGgtA4kirUs22QMw7vAxhLORKCV5VXRlncOvbKeBmzvUvv5aDZcE0PC8lm8h24k-G-2zb4RmOgHHpEpaLJaupvS-aY"}
          />
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{student?.name || session?.user?.name || "Carregando..."}</h1>
            <p className="text-xs text-blue-600 dark:text-blue-500 font-semibold">{student ? `Categoria ${student.categories?.[0] || 'B'}` : "Aluno"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-650 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:bg-slate-955 dark:text-slate-350 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center h-10 w-10 shadow-xs"
              aria-label="Alternar tema"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-650" />
              )}
            </button>
          )}

          <button className="p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-955/50 dark:hover:bg-slate-955 relative cursor-pointer text-slate-500 hover:text-blue-655 transition-all duration-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full border border-white dark:border-slate-900" />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] bg-white dark:bg-slate-900 text-slate-800 dark:text-white fixed top-[37px] bottom-0 left-0 border-r border-slate-200 dark:border-slate-850 z-30 justify-between transition-colors duration-300">
        <div className="py-6 flex flex-col gap-2">
          <div className="px-6 mb-6">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Navegação Aluno</span>
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/student" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-500 border-r-4 border-blue-500 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                {isActive ? item.activeIcon : item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="p-6 border-t border-slate-200 dark:border-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm text-white">
              V
            </div>
            <div>
              <p className="text-xs font-bold text-slate-850 dark:text-white">Volante Certo</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400">Portal do Aluno</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 animate-fade-in-up">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center pt-3 pb-safe px-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-850 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] z-50 transition-colors duration-300">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/student" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 active:scale-95 transition-transform duration-200 ${
                isActive ? "text-blue-655 dark:text-blue-500 font-bold" : "text-slate-500 dark:text-slate-450 font-medium"
              }`}
            >
              <div className="mb-1">{isActive ? item.activeIcon : item.icon}</div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
