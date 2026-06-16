import { prisma } from "../lib/prisma";

async function main() {
  const sessions = await prisma.session.findMany({
    include: {
      user: true,
    },
  });

  console.log("Current time (Node.js):", new Date().toISOString());
  console.log("Current sessions count:", sessions.length);
  for (const session of sessions) {
    console.log({
      id: session.id,
      user: session.user.email,
      expiresAt: session.expiresAt.toISOString(),
      expiresAtRaw: session.expiresAt,
      createdAt: session.createdAt.toISOString(),
      isExpired: session.expiresAt < new Date(),
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
