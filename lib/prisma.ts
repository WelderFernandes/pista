import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "@/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export function getTenantPrisma(tenantId: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const tenantModels = ["Student", "ClassSession", "Transaction", "InstructorSettings"];
          if (!tenantModels.includes(model)) {
            return query(args);
          }

          const anyArgs = args as any;

          if (["findFirst", "findMany", "count", "aggregate", "groupBy"].includes(operation)) {
            anyArgs.where = {
              ...anyArgs.where,
              organizationId: tenantId,
            };
          } else if (operation === "findUnique" || operation === "findUniqueOrThrow") {
            const newOperation = operation === "findUnique" ? "findFirst" : "findFirstOrThrow";
            anyArgs.where = {
              ...anyArgs.where,
              organizationId: tenantId,
            };
            const ctx = Prisma.getExtensionContext(this);
            return (ctx as any)[model][newOperation](anyArgs);
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
          } else if (["update", "updateMany", "upsert", "delete", "deleteMany"].includes(operation)) {
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

export { prisma };

