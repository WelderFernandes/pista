import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};
console.log("🚀 ~ globalForPrisma:", globalForPrisma)

const pool =
  globalForPrisma.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: 20,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.pgPool = pool;
const adapter = new PrismaPg(pool as any);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    // log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

export function getTenantPrisma(tenantId: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const tenantModels = [
            "Student",
            "ClassSession",
            "Transaction",
            "InstructorSettings",
            "Vehicle",
          ];
          if (!tenantModels.includes(model)) {
            return query(args);
          }

          const anyArgs = args as any;

          if (
            ["findFirst", "findMany", "count", "aggregate", "groupBy"].includes(
              operation,
            )
          ) {
            anyArgs.where = {
              ...anyArgs.where,
              organizationId: tenantId,
            };
          } else if (
            operation === "findUnique" ||
            operation === "findUniqueOrThrow"
          ) {
            const newOperation =
              operation === "findUnique" ? "findFirst" : "findFirstOrThrow";
            anyArgs.where = {
              ...anyArgs.where,
              organizationId: tenantId,
            };
            // Usa a instância base do prisma em vez do contexto da extensão que não tem o model delegate aqui
            return (prisma as any)[model][newOperation](anyArgs);
          } else if (operation === "create") {
            anyArgs.data = {
              ...anyArgs.data,
              organizationId: tenantId,
            };
          } else if (operation === "createMany") {
            if (Array.isArray(anyArgs.data)) {
              anyArgs.data = anyArgs.data.map((item: any) => ({
                ...item,
                organizationId: tenantId,
              }));
            } else if (anyArgs.data) {
              anyArgs.data = {
                ...anyArgs.data,
                organizationId: tenantId,
              };
            }
          } else if (
            ["update", "updateMany", "upsert", "delete", "deleteMany"].includes(
              operation,
            )
          ) {
            anyArgs.where = {
              ...anyArgs.where,
              organizationId: tenantId,
            };
            if (operation === "upsert") {
              anyArgs.create = {
                ...anyArgs.create,
                organizationId: tenantId,
              };
              anyArgs.update = {
                ...anyArgs.update,
                organizationId: tenantId,
              };
            }
          }

          return query(anyArgs);
        },
      },
    },
  });
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
