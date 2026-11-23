import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware de proteção de rotas.
 *
 * Rotas públicas (não exigem autenticação):
 * - /, /login, /recuperar-senha, /redefinir-senha
 * - /instrutores (lista pública de instrutores)
 * - /api/auth/* (rotas do better-auth)
 *
 * Rotas protegidas (exigem sessão válida):
 * - /instructor/* (painel do instrutor)
 * - /student/* (portal do aluno)
 * - /instructor-setup (onboarding do instrutor)
 */

const publicRoutes = ["/", "/login", "/recuperar-senha", "/redefinir-senha", "/instrutores"];
const publicRoutePrefixes = ["/api/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rotas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Permitir rotas da API do auth
  if (publicRoutePrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Rotas protegidas exigem autenticação
  const protectedPrefixes = ["/instructor", "/student", "/instructor-setup"];
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isProtected) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export default middleware;
