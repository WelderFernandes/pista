"use client";

import React from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface InstructorSidebarProps {
  isCollapsed: boolean;
  pathname: string;
}

export function InstructorSidebar({ isCollapsed, pathname }: InstructorSidebarProps) {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: orgs } = authClient.useListOrganizations();

  const handleSelectOrg = async (orgId: string) => {
    await authClient.organization.setActive({
      organizationId: orgId,
    });
    window.location.reload();
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/instructor",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 3a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2V5a2 2 0 00-2-2h-4zM5 13a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2H5zM15 13a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2h-4z" />
        </svg>
      )
    },
    {
      label: "Agenda",
      href: "/instructor/agenda",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v13a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H8V3a1 1 0 00-1-1zM4 8h16v11H4V8zm2 2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1v-2z" />
        </svg>
      )
    },
    {
      label: "Alunos",
      href: "/instructor/students",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      )
    },
    {
      label: "Financeiro",
      href: "/instructor/finance",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm1-15a1 1 0 10-2 0v1.07A2.993 2.993 0 009 11a1 1 0 102 0h1a1 1 0 100-2h-1a1 1 0 010-2v-.93zm-3 8a1 1 0 100-2H9a1 1 0 100 2h1a1 1 0 010 2v.93a1 1 0 102 0V17a2.993 2.993 0 002-2.93 1 1 0 10-2 0h-1a1 1 0 100 2h1a1 1 0 010 2H11v-.93a1 1 0 01-1-1.07z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      label: "Perfil",
      href: "/instructor/profile",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M18 10a6 6 0 11-12 0 6 6 0 0112 0zm-6 8a8 8 0 00-8 8h16a8 8 0 00-8-8z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      label: "Ajustes",
      href: "/instructor/settings",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      activeIcon: (
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <aside className={cn(
      "hidden md:flex flex-col bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-md ",
      "fixed top-0 bottom-0 left-0 border-r border-slate-200/40 dark:border-slate-850 ",
      "z-30 justify-between transition-all duration-300",
      isCollapsed ? "w-[68px]" : "w-[240px]"
    )}>
      <div className="py-6 flex flex-col gap-1 overflow-x-hidden">
        <div className={cn(
          "relative mx-auto transition-all duration-300 flex items-center justify-center shrink-0",
          isCollapsed ? "w-8 h-8 mb-1" : "w-[120px] h-[50px] mb-2 "
        )}>
          {/* Logo Completa (Expandida) */}
          <div className={cn(
            "absolute inset-0 transition-all duration-300 flex items-center justify-center",
            isCollapsed ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"
          )}>
            <Image
              src="/img/pista-logo.png"
              alt="Logo Completa"
              fill
              className="object-contain transition-transform duration-300 hover:scale-[1.02]"
              priority
            />
          </div>

          {/* Logo Ícone (Recolhida) */}
          <div className={cn(
            "absolute inset-0 transition-all duration-300 flex items-center justify-center",
            isCollapsed ? "opacity-100 scale-100" : "opacity-0 pointer-events-none scale-75"
          )}>
            <Image
              src="/img/logo-icon.PNG"
              alt="Logo Ícone"
              fill
              className="object-contain transition-transform duration-300 hover:scale-[1.05]"
              priority
            />
          </div>
        </div>
        {/* Organization switcher */}
        <div className={cn("mb-3 transition-all duration-300 relative group/tooltip", isCollapsed ? "px-2" : "px-3")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center justify-between rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer text-left focus:outline-hidden",
                  isCollapsed ? "p-1.5 justify-center" : "p-2"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  {!isCollapsed && (
                    <div className="min-w-0 flex-1 ml-0.5 animate-fade-in">
                      <p className="text-[8px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Organização</p>
                      <p className="text-xs font-black text-slate-850 dark:text-slate-200 truncate mt-1 leading-none">
                        {activeOrg?.name || "Carregando..."}
                      </p>
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <svg className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 mt-1 rounded-2xl p-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 shadow-xl z-50 animate-scale-up">
              <DropdownMenuLabel className="px-2.5 py-2 text-[9px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Minhas Organizaçãos</DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 border-t border-slate-100 dark:border-slate-800" />
              {orgs && orgs.length > 0 ? (
                orgs.map((org) => {
                  const isCurrent = org.id === activeOrg?.id;
                  return (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => handleSelectOrg(org.id)}
                      className={`flex items-center justify-between px-2.5 py-2 text-xs cursor-pointer rounded-xl font-medium transition-colors ${isCurrent
                        ? "bg-blue-50/80 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-bold"
                        : "hover:bg-slate-100/80 dark:hover:bg-slate-850"
                        }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-850 flex items-center justify-center shrink-0">
                          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <span className="truncate">{org.name}</span>
                      </div>
                      {isCurrent && (
                        <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </DropdownMenuItem>
                  );
                })
              ) : (
                <div className="p-2 text-center text-xs text-slate-400">Nenhuma organização vinculada</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {isCollapsed && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 shadow-md whitespace-nowrap z-50 uppercase tracking-wider scale-90 origin-left group-hover/tooltip:scale-100">
              Autoescola: {activeOrg?.name || "Carregando..."}
            </div>
          )}
        </div>

        <div className={`px-6 mb-4 transition-all duration-300 ${isCollapsed ? "opacity-0 h-0 mb-0 px-0" : "opacity-100"}`}>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Navegação</span>
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/instructor" && pathname.startsWith(item.href));
          return (
            <div key={item.href} className="relative group/tooltip">
              <Link
                href={item.href}
                className={`flex items-center rounded-xl text-xs font-semibold transition-all hover:scale-[1.01] active:scale-[0.98] duration-200 ${isCollapsed ? "justify-center py-3 mx-2 px-0" : "gap-3 mx-3 px-4 py-2.5"
                  } ${isActive
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-500 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200/40 dark:border-slate-800/60 font-bold"
                    : "text-slate-500 dark:text-slate-450 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/30 dark:hover:bg-slate-800/30"
                  }`}
              >
                {isActive ? item.activeIcon : item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
              {isCollapsed && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 shadow-md whitespace-nowrap z-50 uppercase tracking-wider scale-90 origin-left group-hover/tooltip:scale-100">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className={`mb-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-200/40 dark:border-slate-800/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 ${isCollapsed ? "p-2 mx-2" : "p-4 mx-3"
        }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-xs shrink-0">
            V
          </div>
          {!isCollapsed && (
            <div className="transition-all duration-300">
              <p className="text-[10px] font-bold text-slate-800 dark:text-white">Pista</p>
              <p className="text-[8px] text-slate-400 dark:text-slate-500">v2.4.0-premium</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
