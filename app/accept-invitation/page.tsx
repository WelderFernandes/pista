"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {  useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { getInvitationDetailsAction, acceptInvitationAction } from "@/app/actions";
import Link from "next/link";

function AcceptInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("id");

  const { data: session } = useSession();
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!invitationId) {
      Promise.resolve().then(() => {
        setError("Convite inválido ou ausente.");
        setLoading(false);
      });
      return;
    }

    getInvitationDetailsAction(invitationId)
      .then((data) => {
        if (!data) {
          setError("Este convite não foi encontrado ou já foi cancelado.");
        } else if (data.status !== "pending") {
          setError("Este convite já foi aceito ou expirou.");
        } else {
          setInvitation(data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao carregar os detalhes do convite.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [invitationId]);

  const handleAccept = async () => {
    if (!invitationId) return;
    setLoading(true);
    setError("");

    try {
      await acceptInvitationAction(invitationId);

      setSuccess("Convite aceito com sucesso! Redirecionando para o painel...");
      setTimeout(() => {
        // Redireciona para o portal correspondente
        if (invitation.role === "instructor" || invitation.role === "owner" || invitation.role === "admin") {
          router.push("/instructor");
        } else {
          router.push("/student");
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao tentar aceitar o convite.");
      setLoading(false);
    }
  };

  if (loading && !invitation) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm font-semibold text-slate-400">Verificando convite...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <div className="absolute inset-0 bg-linear-to-tr from-orange-600/10 to-blue-600/10 opacity-30 pointer-events-none" />
      
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-orange-600 to-orange-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-orange-500/20 text-white mb-4">
            V
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Convite de Autoescola</h2>
          <p className="text-xs text-slate-400 mt-1">Você foi convidado para fazer parte da equipe!</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-xl mb-6 font-semibold text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-4 rounded-xl mb-6 font-semibold text-center">
            {success}
          </div>
        )}

        {invitation && !success && (
          <div className="flex flex-col gap-6">
            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Organização:</span>
                <span className="font-bold text-white">{invitation.organization.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Sua Role:</span>
                <span className="font-bold text-orange-400 uppercase text-xs tracking-wider">{invitation.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Destinatário:</span>
                <span className="font-semibold text-white">{invitation.email}</span>
              </div>
            </div>

            {session ? (
              // Usuário Logado
              session.user.email.toLowerCase() !== invitation.email.toLowerCase() ? (
                <div className="flex flex-col gap-3 text-center">
                  <p className="text-xs text-amber-400 font-medium">
                    Atenção: Você está logado como <span className="underline">{session.user.email}</span>, mas o convite foi enviado para <span className="underline">{invitation.email}</span>.
                  </p>
                  <Button
                    onClick={handleAccept}
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold p-3 rounded-xl cursor-pointer"
                  >
                    Aceitar mesmo assim
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAccept}
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold p-3 rounded-xl cursor-pointer"
                >
                  Confirmar e Aceitar Convite
                </Button>
              )
            ) : (
              // Usuário Não Logado
              <div className="flex flex-col gap-3">
                <p className="text-xs text-slate-400 text-center">
                  Você precisa estar logado para aceitar este convite. Se ainda não possui conta, cadastre-se com o e-mail convidado.
                </p>
                <Link
                  href={`/login?profile=instructor&email=${encodeURIComponent(invitation.email)}`}
                  className="w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-bold p-3 rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cadastrar ou Entrar para Aceitar
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-slate-500 hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm font-semibold text-slate-400">Carregando convite...</p>
        </div>
      </div>
    }>
      <AcceptInvitationContent />
    </Suspense>
  );
}
