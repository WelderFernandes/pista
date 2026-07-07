"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, User as UserIcon } from "@phosphor-icons/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { User } from "@/generated";
import { getCurrentUser } from "@/lib/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

     const { 
        data: session, 
        isPending, //loading state
        // error, //error object
        // refetch //refetch the session
    } = authClient.useSession()

    useEffect(() => {
        if (!isPending && !session?.user.id) {
            router.push("/login")
        }
        if (session?.user.id) {
            getCurrentUser({id: session.user.id}).then((user) => {
                setUser(user)
            })
        }
    }, [session, router, isPending])

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  const navItems = [
    {
      label: "Dashboard",
      href: "/instructor",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 3a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2V5a2 2 0 00-2-2h-4zM5 13a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2H5zM15 13a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2h-4z" />
        </svg>
      )
    },
    {
      label: "Agenda",
      href: "/instructor/agenda",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v13a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H8V3a1 1 0 00-1-1zM4 8h16v11H4V8zm2 2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1v-2z" />
        </svg>
      )
    },
    {
      label: "Alunos",
      href: "/instructor/students",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      label: "Equipe",
      href: "/instructor/team",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      )
    },
    {
      label: "Financeiro",
      href: "/instructor/finance",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm1-15a1 1 0 10-2 0v1.07A2.993 2.993 0 009 11a1 1 0 102 0h1a1 1 0 100-2h-1a1 1 0 010-2v-.93zm-3 8a1 1 0 100-2H9a1 1 0 100 2h1a1 1 0 010 2v.93a1 1 0 102 0V17a2.993 2.993 0 002-2.93 1 1 0 10-2 0h-1a1 1 0 100 2h1a1 1 0 010 2H11v-.93a1 1 0 01-1-1.07z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      label: "Perfil",
      href: "/instructor/profile",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M18 10a6 6 0 11-12 0 6 6 0 0112 0zm-6 8a8 8 0 00-8 8h16a8 8 0 00-8-8z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      label: "Ajustes",
      href: "/instructor/settings",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }


  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen pb-[80px] md:pb-0 md:pl-[240px] flex flex-col font-sans transition-colors duration-300">
      {/* Top Selector Bar (Switch Portals) */}
      <div className="bg-slate-900 text-white text-xs py-2 px-6 flex justify-between items-center z-50 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-[10px] text-slate-350">Modo Instrutor Ativo</span>
        </div>
        <Link 
          href="/" 
          className="text-blue-500 hover:text-blue-400 transition-colors font-semibold flex items-center gap-1 text-[11px]"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Trocar Portal
        </Link>
      </div>

      {/* Top Nav Header */}
      <header className="w-full sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between px-6 py-4 shadow-sm transition-colors duration-300">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer focus:outline-hidden text-left">
              <Avatar size="lg" className="border border-slate-200 dark:border-slate-800">
                {(user?.image || session?.user?.image) && (
                  <AvatarImage
                    src={user?.image || session?.user?.image || undefined}
                    alt="Avatar do Instrutor"
                  />
                )}
                <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Olá, {user?.name || session?.user?.name || "Instrutor"}
                </h1>
                <p className="text-xs text-blue-600 dark:text-blue-600 font-semibold">Instrutor</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 mt-1 rounded-sm p-1 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xl">
            <DropdownMenuLabel className="px-2 py-1.5 text-xs text-slate-500 dark:text-slate-400">Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 border-t border-slate-100 dark:border-slate-800" />
            <DropdownMenuItem asChild>
              <Link href="/instructor/profile" className="flex items-center gap-2 px-2 py-1.5 text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm">
                Meu Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/instructor/settings" className="flex items-center gap-2 px-2 py-1.5 text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm">
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 border-t border-slate-100 dark:border-slate-800" />
            <DropdownMenuItem
              onClick={async () => {
                await authClient.signOut();
                window.location.href = "/login";
              }}
              className="flex items-center gap-2 px-2 py-1.5 text-xs cursor-pointer text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 dark:text-red-400 rounded-sm"
            >
              Fazer Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-sm border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:bg-slate-955 dark:text-slate-350 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center h-10 w-10 shadow-xs"
              aria-label="Alternar tema"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          )}

          <button className="p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/50 dark:hover:bg-slate-950 relative cursor-pointer text-slate-500 hover:text-blue-600 transition-all duration-300">
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
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Navegação</span>
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/instructor" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600/10 text-blue-600 dark:text-blue-600 border-r-4 border-blue-600 font-bold"
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
            <div className="w-8 h-8 rounded-sm bg-blue-600 flex items-center justify-center font-bold text-sm text-white">
              V
            </div>
            <div>
              <p className="text-xs font-bold text-slate-850 dark:text-white">Pista</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400">v2.4.0-premium</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 animate-fade-in-up">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center pt-3 pb-safe px-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-850 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] z-50 transition-colors duration-300">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/instructor" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 active:scale-95 transition-transform duration-200 ${
                isActive ? "text-blue-600 dark:text-blue-600 font-bold" : "text-slate-500 dark:text-slate-450 font-medium"
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
