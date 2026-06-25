import * as dotenv from "dotenv";
import * as path from "path";

// Carrega as variáveis do arquivo .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { auth } from "../lib/auth";

async function main() {
  console.log("Iniciando teste de solicitação de OTP com Better Auth...");
  
  const email = "welderx3@gmail.com";
  
  // 1. Tenta cadastrar o usuário primeiro para garantir que ele exista no banco
  try {
    console.log(`Tentando cadastrar o usuário ${email} por garantia...`);
    await auth.api.signUpEmail({
      body: {
        email,
        password: "SenhaTemporaria123!",
        name: "Welder Fernandes",
      }
    });
    console.log("Usuário cadastrado com sucesso (ou já existia).");
  } catch (e: any) {
    console.log("Cadastro pulado/erro (provavelmente já cadastrado):", e.message);
  }

  // 2. Solicita o OTP de recuperação de senha
  try {
    console.log(`Solicitando OTP de recuperação para ${email}...`);
    const result = await auth.api.requestPasswordResetEmailOTP({
      body: {
        email,
      }
    });
    
    console.log("Resultado da API do Better Auth:", result);
    
    // Aguarda um momento para a Promise assíncrona do envio de e-mail resolver
    console.log("Aguardando 5 segundos para a chamada assíncrona de envio do e-mail resolver...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    
    process.exit(0);
  } catch (error) {
    console.error("Erro na API do Better Auth:", error);
    process.exit(1);
  }
}

main();
