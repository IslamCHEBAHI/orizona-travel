import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `La variable ${name} est absente du fichier .env`
    );
  }

  return value;
}

const email = getRequiredEnv("ADMIN_EMAIL")
  .trim()
  .toLowerCase();

const password = getRequiredEnv("ADMIN_PASSWORD");

async function main() {
  const passwordHash = await hash(password, 12);

  await prisma.adminUser.upsert({
    where: {
      email,
    },

    update: {
      passwordHash,
      active: true,
    },

    create: {
      email,
      passwordHash,
      name: "Administrateur",
      active: true,
    },
  });

  console.log(`Administrateur créé : ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });