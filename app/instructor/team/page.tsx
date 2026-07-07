"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeamMembersAction, getPendingInvitationsAction, inviteMemberAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function TeamPage() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  
  const [emailInput, setEmailInput] = useState("");
  const [roleInput, setRoleInput] = useState("instructor");
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  // Queries para carregar membros e convites
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => await getTeamMembersAction(),
  });

  const { data: invitations = [], isLoading: invitesLoading } = useQuery({
    queryKey: ["pending-invitations"],
    queryFn: async () => await getPendingInvitationsAction(),
  });

  // Mutation para disparar convites
  const inviteMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      const response = await inviteMemberAction(email, role);
      if (response && (response as any).error) {
        throw new Error((response as any).error.message || "Erro ao convidar membro.");
      }
      return response;
    },
    onSuccess: () => {
      setInviteSuccess("Convite enviado com sucesso!");
      setEmailInput("");
      setInviteError("");
      queryClient.invalidateQueries({ queryKey: ["pending-invitations"] });
      toast.success("Membro convidado com sucesso!");
      setTimeout(() => setInviteSuccess(""), 4000);
    },
    onError: (err: any) => {
      setInviteError(err.message || "Falha ao enviar o convite.");
      setInviteSuccess("");
    },
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    inviteMutation.mutate({ email: emailInput.trim(), role: roleInput });
  };

  const copyInviteLink = (inviteId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const inviteLink = `${origin}/accept-invitation?id=${inviteId}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success("Link do convite copiado para a área de transferência!");
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/10 text-blue-600 border border-blue-600/20">Proprietário</span>;
      case "admin":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-650 border border-red-500/20">Administrador</span>;
      case "instructor":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">Instrutor</span>;
      case "admin":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Estudante</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-600 border border-slate-500/20">{role}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Instrutores & Equipe</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Gerencie os instrutores ativos da sua autoescola e envie novos convites.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Invite Form & Pending Invites */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Send Invitation Card */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Convidar Membro</h3>
            <p className="text-xs text-slate-400">O convidado receberá o link para se cadastrar e ingressar automaticamente na sua autoescola com o papel escolhido.</p>
            
            <form onSubmit={handleInvite} className="flex flex-col gap-3">
              <div>
                <Label htmlFor="invite-email" className="text-xs text-slate-500 font-semibold mb-1">E-mail de Acesso</Label>
                <input
                  type="email"
                  id="invite-email"
                  placeholder="exemplo@email.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-hidden focus:border-blue-600 transition-colors text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="invite-role" className="text-xs text-slate-500 font-semibold mb-1">Papel (Função)</Label>
                <select
                  id="invite-role"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-hidden focus:border-blue-600 transition-colors text-slate-900 dark:text-white"
                >
                  <option value="instructor">Instrutor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {inviteError && (
                <p className="text-[11px] text-red-500 font-semibold">{inviteError}</p>
              )}
              {inviteSuccess && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{inviteSuccess}</p>
              )}

              <Button
                type="submit"
                disabled={inviteMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3.5 rounded-xl text-xs transition-all cursor-pointer h-11"
              >
                {inviteMutation.isPending ? "Criando..." : "Gerar Convite"}
              </Button>
            </form>
          </section>

          {/* Pending Invitations Card */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Convites Pendentes</h3>
            
            {invitesLoading ? (
              <div className="flex justify-center p-4">
                <div className="h-5 w-5 animate-spin rounded-full border border-blue-600 border-t-transparent" />
              </div>
            ) : invitations.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Nenhum convite pendente.</p>
            ) : (
              <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-1">
                {invitations.map((invite: any) => (
                  <div key={invite.id} className="flex flex-col gap-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{invite.email}</span>
                    <div className="flex justify-between items-center mt-1 text-[10px]">
                      <span className="text-slate-400">Cargo: {invite.role}</span>
                      <span className="px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-600 font-bold border border-yellow-500/20">Pendente</span>
                    </div>
                    <button
                      onClick={() => copyInviteLink(invite.id)}
                      className="mt-2 text-left text-[10px] text-blue-600 dark:text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-2 4h5m-3-3l3 3-3 3" />
                      </svg>
                      Copiar Link do Convite
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column: Active Members list */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Membros Ativos ({members.length})</h3>
            </div>

            {membersLoading ? (
              <div className="flex justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
              </div>
            ) : members.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Nenhum membro ativo encontrado.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {members.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/40 dark:hover:bg-slate-955/80 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80"}
                        alt={member.user.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{member.user.name}</span>
                        <span className="text-xs text-slate-400">{member.user.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getRoleBadge(member.role)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
