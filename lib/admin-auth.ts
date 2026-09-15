import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function requireAdmin() {
  const cookieStore = await cookies();

  const token = await getToken({
    req: {
      cookies: Object.fromEntries(
        cookieStore.getAll().map((c) => [c.name, c.value])
      ),
    } as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("ADMIN TOKEN:", token);

  if (!token) {
    throw new Error("Accès administrateur requis.");
  }

  const email = token.email;

  if (!email) {
    throw new Error("Accès administrateur requis.");
  }

  const admin = await prisma.adminUser.findFirst({
    where: {
      email: email.toLowerCase(),
      active: true,
    },
  });

  if (!admin) {
    throw new Error("Accès administrateur requis.");
  }

  return {
    user: {
      id: String(admin.id),
      email: admin.email,
      name: admin.name,
    },
  };
}