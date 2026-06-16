import { prisma } from "../lib/prisma";

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "welderx3@gmail.com" },
    include: {
      sessions: true,
      members: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (!user) {
    console.log("User not found");
    return;
  }

  console.log("User:", user.email);
  console.log("Members/Orgs:", user.members.length);
  for (const m of user.members) {
    console.log(" - Org:", m.organization.name, "| orgId:", m.organizationId, "| role:", m.role);
  }

  console.log("\nSessions:");
  for (const s of user.sessions) {
    console.log({
      id: s.id,
      activeOrganizationId: s.activeOrganizationId,
      expiresAt: s.expiresAt.toISOString(),
      isExpired: s.expiresAt < new Date(),
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
