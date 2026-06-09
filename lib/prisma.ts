import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

const basePrisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = basePrisma;
}

/**
 * Retorna uma instância estendida do Prisma Client que aplica automaticamente
 * filtros de segurança de tenant (isolation) em todas as operações de leitura e escrita.
 */
export const getTenantPrisma = (organizationId: string) => {
  return basePrisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          // Lista de modelos da aplicação que possuem suporte a isolamento de tenant
          const tenantModels = ["Student", "ClassSession", "Transaction", "InstructorSettings"];
          
          if (tenantModels.includes(model) && args && typeof args === "object") {
            const typedArgs = args as { where?: Record<string, any>; data?: Record<string, any> };
            
            // Injeta o organizationId no filtro de busca
            typedArgs.where = typedArgs.where || {};
            typedArgs.where.organizationId = organizationId;
            
            // Injeta o organizationId na criação de novos registros para evitar inserção incorreta
            if (operation === "create" || operation === "createMany") {
              if (typedArgs.data) {
                if (Array.isArray(typedArgs.data)) {
                  typedArgs.data.forEach((item) => {
                    item.organizationId = organizationId;
                  });
                } else {
                  typedArgs.data.organizationId = organizationId;
                }
              }
            }
          }
          return query(args);
        },
      },
    },
  });
};

export const prisma = basePrisma;
export type TenantPrismaClient = ReturnType<typeof getTenantPrisma>;
