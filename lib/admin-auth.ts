import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { headers, cookies } from "next/headers";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Vérification serveur admin robuste pour Vercel/Next.js Server Actions.
 * La session NextAuth peut être absente dans certaines Server Actions,
 * on utilise alors le JWT puis une vérification en base.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  console.log("ADMIN SESSION:", session);

  let userId = session?.user?.id ? String(session.user.id) : null;
  let email = session?.user?.email ?? null;

  if (!userId) {
    const token = await getToken({
      req: {
        headers: await headers(),
        cookies: await cookies(),
      } as any,
      secret: process.env.NEXTAUTH_SECRET,
    });
    console.log("ADMIN TOKEN:", token);

    if (token?.id) {
      userId = String(token.id);
      email = token.email ?? null;
    }
  }

  if (!userId && !email) {
    console.log("NO SESSION");
    console.log("SESSION:", session);

    const allAdmins = await prisma.adminUser.findMany();
    console.log("ADMINS:", allAdmins);

    throw new Error("Accès administrateur requis.");
  }

  const admin = await prisma.adminUser.findFirst({
    where: {
      OR: [
        userId ? { id: Number(userId) } : undefined,
        email ? { email: email.toLowerCase() } : undefined,
      ].filter(Boolean) as any,
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
