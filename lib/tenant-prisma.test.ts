import { describe, it, expect, vi, beforeEach } from "vitest";

// Substitui o cliente Prisma real: capturamos a configuração passada ao $extends
// para exercitar diretamente o interceptador de tenant.
const { extendsSpy } = vi.hoisted(() => ({
  extendsSpy: vi.fn((config: any) => config),
}));

vi.mock("pg", () => ({ Pool: vi.fn() }));
vi.mock("@prisma/adapter-pg", () => ({ PrismaPg: vi.fn() }));
vi.mock("@/generated", () => ({
  PrismaClient: vi.fn(function () {
    return { $extends: extendsSpy };
  }),
}));

import { getTenantPrisma } from "@/lib/prisma";

function getExtensionHandler(tenantId: string) {
  const config = getTenantPrisma(tenantId) as any;
  return config.query.$allModels.$allOperations as (params: {
    model: string;
    operation: string;
    args: any;
    query: (args: any) => Promise<unknown>;
  }) => Promise<unknown>;
}

async function run(
  tenantId: string,
  model: string,
  operation: string,
  args: any,
) {
  const query = vi.fn(async (a: any) => a);
  const handler = getExtensionHandler(tenantId);
  const result = await handler({ model, operation, args, query });
  return { result, queryArgs: query.mock.calls[0]?.[0] };
}

describe("getTenantPrisma - isolamento de tenant", () => {
  beforeEach(() => {
    extendsSpy.mockClear();
  });

  it("aplica organizationId em leituras de ClassRating", async () => {
    const { queryArgs } = await run("org-A", "ClassRating", "findMany", {
      where: { rating: 5 },
    });
    expect(queryArgs.where).toEqual({ rating: 5, organizationId: "org-A" });
  });

  it("força organizationId em create de ClassRating", async () => {
    const { queryArgs } = await run("org-A", "ClassRating", "create", {
      data: { rating: 4, organizationId: "org-B" },
    });
    expect(queryArgs.data.organizationId).toBe("org-A");
  });

  it("aplica organizationId em update e delete de modelos com tenant", async () => {
    const upd = await run("org-A", "Vehicle", "update", {
      where: { id: "v1" },
      data: {},
    });
    expect(upd.queryArgs.where).toEqual({ id: "v1", organizationId: "org-A" });

    const del = await run("org-A", "Student", "delete", {
      where: { id: "s1" },
    });
    expect(del.queryArgs.where).toEqual({ id: "s1", organizationId: "org-A" });
  });

  it("não altera modelos fora do tenant", async () => {
    const { queryArgs } = await run("org-A", "Member", "findMany", {
      where: { role: "owner" },
    });
    expect(queryArgs.where).toEqual({ role: "owner" });
  });
});
