"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, User as UserIcon } from "@phosphor-icons/react";
import { authClient } from "@/lib/auth-client";
import { getCurrentUser } from "@/lib/user";
import { User } from "@/generated";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface InstructorHeaderProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export function InstructorHeader({ isCollapsed, toggleCollapse }: InstructorHeaderProps) {
  const { data: session } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setMounted(true);
    if (session?.user.id) {
      getCurrentUser({ id: session.user.id }).then((u) => {
        setUser(u);
      });
    }
  }, [session]);

  return (
    <header
      className={cn(
        "w-full sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 ",
        "backdrop-blur-md border-b border-slate-200/50 dark:border-slate-850",
        "flex items-center justify-between px-6 py-3.5 ",
        "shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-all duration-300"
      )}
    >
      {/* Toggle Collapse Button */}
      <button
        type="button"
        onClick={toggleCollapse}
        className="p-2 rounded-xl border border-slate-200/60 bg-slate-50 hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:bg-slate-955 text-slate-500 hover:text-blue-600 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer flex items-center justify-center h-9 w-9 shadow-xs"
        aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
      >
        <svg
          className="w-4.5 h-4.5 text-slate-550 dark:text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          {isCollapsed ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h16" />
          )}
        </svg>
      </button>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl border border-slate-200/60 bg-slate-50 hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:bg-slate-950 text-slate-500 hover:text-blue-600 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer flex items-center justify-center h-9 w-9 shadow-xs relative">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-hidden text-left">
              <Avatar className="w-9 h-9 border border-slate-200 dark:border-slate-800">
                {(user?.image || session?.user?.image) && (
                  <AvatarImage
                    src={user?.image || session?.user?.image || undefined}
                    alt="Avatar do Instrutor"
                  />
                )}
                <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {user?.name || session?.user?.name || "Instrutor"}
                </h1>
                <p className="text-[10px] text-blue-600 dark:text-blue-500 font-bold uppercase tracking-wider">Instrutor</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52 mt-2 rounded-xl p-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 shadow-xl">
            <DropdownMenuLabel className="px-2.5 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 border-t border-slate-100 dark:border-slate-800" />
            <DropdownMenuItem asChild>
              <Link href="/instructor/profile" className="flex items-center gap-2 px-2.5 py-2 text-xs cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800 rounded-lg font-medium">
                Meu Perfil
              </Link>
            </DropdownMenuItem>
            {mounted && (
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-2 px-2.5 py-2 text-xs cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800 rounded-lg font-medium"
                aria-label="Alternar tema"
              >
                {theme === "dark" ? (
                  <>
                    Tema Claro
                    <Sun className="w-4 h-4 text-amber-500" />
                  </>
                ) : (
                  <>
                    Tema Escuro
                    <Moon className="w-4 h-4 text-indigo-600" />
                  </>
                )}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/instructor/settings" className="flex items-center gap-2 px-2.5 py-2 text-xs cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800 rounded-lg font-medium">
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 border-t border-slate-100 dark:border-slate-800" />
            <DropdownMenuItem
              onClick={async () => {
                await authClient.signOut();
                window.location.href = "/login";
              }}
              className="flex items-center gap-2 px-2.5 py-2 text-xs cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 dark:text-red-400 rounded-lg font-semibold"
            >
              Fazer Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
