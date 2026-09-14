/**
 * Exemple de connexion PostgreSQL pour la mise en production.
 * Le projet reste volontairement sur SQLite en local afin de conserver votre
 * base actuelle. Quand vous basculerez réellement sur PostgreSQL, installez
 * @prisma/adapter-pg et pg, générez schema.postgresql.prisma puis remplacez
 * lib/prisma.ts par l'équivalent de ce fichier.
 */

// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "../generated/prisma-postgres/client";
//
// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL!,
// });
//
// export const prisma = new PrismaClient({ adapter });

export {};
