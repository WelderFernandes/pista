import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization, emailOTP } from "better-auth/plugins";
import { prisma } from "./prisma";
import { sendEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Verifique seu endereço de e-mail",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Olá, ${user.name}!</h2>
            <p>Obrigado por se cadastrar no Pista. Por favor, clique no botão abaixo para verificar seu endereço de e-mail:</p>
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #7763f1; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
              Verificar E-mail
            </a>
            <p>Se o botão acima não funcionar, copie e cole o seguinte link no seu navegador:</p>
            <p style="word-break: break-all; color: #7763f1;">${url}</p>
          </div>
        `,
      });
    },
    sendOnSignUp: true,
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Recuperação de Senha",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Olá, ${user.name}!</h2>
            <p>Recebemos uma solicitação para redefinir a sua senha. Clique no botão abaixo para prosseguir:</p>
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #7763f1; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
              Redefinir Senha
            </a>
            <p>Se você não solicitou isso, pode ignorar este e-mail.</p>
            <p>Se o botão acima não funcionar, copie e cole o link a seguir no seu navegador:</p>
            <p style="word-break: break-all; color: #7763f1;">${url}</p>
          </div>
        `,
      });
    },
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log("[Better Auth] sendVerificationOTP called:", { email, otp, type });
        if (type === "forget-password") {
          sendEmail({
            to: email,
            template: {
              id: "recuperar-senha",
              variables: {
                verify_code: parseInt(otp, 10),
              },
            },
          }).then(result => {
            console.log("[Better Auth] OTP email sent successfully:", result);
          }).catch(err => {
            console.error("[Better Auth] Error sending OTP email:", err);
          });
        }
      },
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
