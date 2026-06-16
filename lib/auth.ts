import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
    }),
  ],
  session: {
    // Sessão dura 30 dias no banco de dados
    expiresIn: 60 * 60 * 24 * 30,
    // Renova o prazo da sessão a cada 24 horas de uso
    updateAge: 60 * 60 * 24,
    // Cookie cache reduz consultas ao banco para verificar sessão
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // cache de 5 minutos no cookie
    },
  },
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      // maxAge garante que o cookie persiste no navegador por 30 dias
      maxAge: 60 * 60 * 24 * 30,
    },
  },
});
