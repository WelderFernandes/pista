import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Obtém a sessão atual e o ID do Tenant (Organização ativa) no lado do servidor.
 */
export async function getSessionAndTenant() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const activeOrgId = session.session.activeOrganizationId;
  return {
    user: session.user,
    session: session.session,
    activeOrgId,
  };
}

/**
 * Garante que o usuário esteja autenticado e possua uma organização ativa (tenant).
 * Caso contrário, redireciona para a página de login.
 */
export async function requireTenant() {
  const data = await getSessionAndTenant();
  if (!data) {
    redirect("/login");
  }
  
  if (!data.activeOrgId) {
    // Se logado mas sem organização ativa, redireciona para onboarding ou seleção
    redirect("/login?error=no_org");
  }
  
  return {
    user: data.user,
    session: data.session,
    activeOrgId: data.activeOrgId,
  };
}
