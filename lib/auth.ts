import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/admin/login",
  },

  providers: [
    CredentialsProvider({
      name: "Administrateur",

      credentials: {
        email: {
          label: "Adresse e-mail",
          type: "email",
        },
        password: {
          label: "Mot de passe",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email
          .trim()
          .toLowerCase();

        const admin = await prisma.adminUser.findUnique({
          where: {
            email,
          },
        });

        if (!admin || !admin.active) {
          return null;
        }

        const passwordValid = await bcrypt.compare(
          credentials.password,
          admin.passwordHash
        );

        console.log("ADMIN:", admin.email);
        console.log("PASSWORD VALID:", passwordValid);

        if (!passwordValid) {
          return null;
        }

        return {
          id: String(admin.id),
          name: admin.name ?? "Administrateur",
          email: admin.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = String(user.id);
        token.email = user.email;
        token.name = user.name;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.email = token.email;
        session.user.name = token.name;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
export async function getAuthSession() {
  return await getServerSession(authOptions);
}