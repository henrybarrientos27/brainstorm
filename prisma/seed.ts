// File: prisma/seed.ts
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

async function main() {
  const password = await hash("test1234", 10);

  const advisor = await prisma.advisor.upsert({
    where: { email: "test@advisor.com" },
    update: {},
    create: {
      name: "Test Advisor",
      email: "test@advisor.com",
      password,
    },
  });

  await prisma.client.upsert({
    where: { email: "jane@client.com" },
    update: {},
    create: {
      name: "Jane Doe",
      email: "jane@client.com",
      advisor: { connect: { id: advisor.id } },
      totalAssets: 500000,
      recentTransfers: 20000,
    },
  });

  console.log("✅ Test advisor and client created successfully");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});