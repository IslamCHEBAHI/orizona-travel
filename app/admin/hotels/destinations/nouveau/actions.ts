"use server";

import { requireAdmin } from "@/lib/admin-auth";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import {
  deleteCloudinaryImage,
  uploadCloudinaryImage,
} from "@/lib/cloudinary";


/* =====================================================
   CREATION DU SLUG
===================================================== */

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


/* =====================================================
   SLUG UNIQUE
===================================================== */

async function getUniqueSlug(name: string) {
  const baseSlug =
    createSlug(name) || "destination-hotel";

  let slug = baseSlug;

  let counter = 2;


  while (
    await prisma.hotelDestination.findUnique({
      where: {
        slug,
      },
    })
  ) {
    slug = `${baseSlug}-${counter}`;

    counter++;
  }


  return slug;
}


/* =====================================================
   CREER DESTINATION HOTELIERE
===================================================== */

export async function createHotelDestination(
  formData: FormData
) {
  await requireAdmin();

  const name = String(
    formData.get("name") ?? ""
  ).trim();


  const description = String(
    formData.get("description") ?? ""
  ).trim();


  const published =
    formData.get("published") === "on";


  const featuredHome =
    formData.get("featuredHome") === "on";


  const coverFile =
    formData.get("coverImage");


  /* ===================================================
     VALIDATION
  =================================================== */

  if (!name) {
    throw new Error(
      "Le nom de la destination est obligatoire."
    );
  }


  const slug =
    await getUniqueSlug(name);


  let coverImage: string | null =
    null;


  let publicId: string | null =
    null;


  try {

    /* =================================================
       PHOTO CLOUDINARY
    ================================================= */

    if (
      coverFile instanceof File &&
      coverFile.size > 0
    ) {

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];


      if (
        !allowedTypes.includes(
          coverFile.type
        )
      ) {
        throw new Error(
          "Format de photo non accepté."
        );
      }


      const maxSize =
        4 * 1024 * 1024;


      if (
        coverFile.size > maxSize
      ) {
        throw new Error(
          "La photo ne doit pas dépasser 4 Mo."
        );
      }


      const arrayBuffer =
        await coverFile.arrayBuffer();


      const buffer =
        Buffer.from(arrayBuffer);


      const uploadResult =
        await uploadCloudinaryImage(
          buffer,
          "agence-voyage/hotel-destinations"
        );


      coverImage =
        uploadResult.secure_url;


      publicId =
        uploadResult.public_id;
    }


    /* =================================================
       CREATION PRISMA
    ================================================= */

    await prisma.hotelDestination.create({

      data: {

        name,

        slug,

        description:
          description || null,

        coverImage,

        publicId,

        published,

        featuredHome,

      },

    });

  } catch (error) {

    /* ===============================================
       SI PRISMA ECHOUE APRES UPLOAD CLOUDINARY
       ON SUPPRIME LA PHOTO CLOUDINARY
    =============================================== */

    if (publicId) {

      await deleteCloudinaryImage(
        publicId
      ).catch(() => {});

    }


    throw error;
  }


  /* =================================================
     RAFRAICHISSEMENT DES PAGES
  ================================================= */

  revalidatePath(
    "/admin/hotels"
  );

  revalidatePath(
    "/hotels"
  );

  revalidatePath(
    "/"
  );


  redirect(
    "/admin/hotels"
  );
}