import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
 * Obtém informações detalhadas do membro atual do Tenant ativo.
 */
export async function getActiveMember() {
  const data = await getSessionAndTenant();
  if (!data) return null;

  const { user, session, activeOrgId } = data;

  if (!activeOrgId) {
    return {
      user,
      session,
      activeOrgId: null,
      role: null,
    };
  }

  const member = await prisma.member.findFirst({
    where: {
      userId: user.id,
      organizationId: activeOrgId,
    },
  });

  return {
    user,
    session,
    activeOrgId,
    role: member?.role || null,
  };
}

/**
 * Garante que o usuário esteja autenticado, possua uma organização ativa (tenant) e pertença a uma das roles autorizadas.
 * Caso contrário, redireciona para a página de login.
 */
export async function requireRole(allowedRoles: string[]) {
  const memberInfo = await getActiveMember();
  if (!memberInfo) {
    redirect("/login");
  }

  let activeOrgId = memberInfo.activeOrgId;
  let role = memberInfo.role;

  if (!activeOrgId) {
    const firstMember = await prisma.member.findFirst({
      where: { userId: memberInfo.user.id },
    });
    if (firstMember) {
      activeOrgId = firstMember.organizationId;
      role = firstMember.role;
    } else {
      redirect("/login?error=no_org");
    }
  }

  if (!role || !allowedRoles.includes(role)) {
    redirect("/login?error=unauthorized");
  }

  return {
    user: memberInfo.user,
    session: memberInfo.session,
    activeOrgId,
    role,
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
  
  let activeOrgId = data.activeOrgId;
  
  if (!activeOrgId) {
    const firstMember = await prisma.member.findFirst({
      where: { userId: data.user.id },
    });
    if (firstMember) {
      activeOrgId = firstMember.organizationId;
    } else {
      redirect("/login?error=no_org");
    }
  }
  
  return {
    user: data.user,
    session: data.session,
    activeOrgId,
  };
}
