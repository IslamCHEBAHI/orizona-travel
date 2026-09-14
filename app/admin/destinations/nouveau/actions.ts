"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  uploadCloudinaryImage,
  deleteCloudinaryImage,
} from "@/lib/cloudinary";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function createSlug(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
export async function createDestination(
  formData: FormData
) {
  await requireAdmin();
  /* ==========================================
     1. RÉCUPÉRATION DES INFORMATIONS
  ========================================== */
  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const country = String(
    formData.get("country") ?? ""
  ).trim();

  const tag = String(
    formData.get("tag") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const published =
    formData.get("published") === "on";
    const requestedCoverIndex =
      Number(
        formData.get("coverIndex") ?? 0
      );
  /* ==========================================
     2. VALIDATION
  ========================================== */
  if (!name) {
    throw new Error(
      "Le nom de la destination est obligatoire."
    );
  }

  if (!country) {
    throw new Error(
      "Le pays est obligatoire."
    );
  }

  if (!description) {
    throw new Error(
      "La description est obligatoire."
    );
  }
  /* ==========================================
     3. CRÉATION DU SLUG
  ========================================== */

  let slug = createSlug(name);

  const existingDestination =
    await prisma.destination.findUnique({
      where: {
        slug,
      },
    });

  if (existingDestination) {
    slug = `${slug}-${Date.now()}`;
  }
  /* ==========================================
     4. RÉCUPÉRATION DES PHOTOS
  ========================================== */

  const imageEntries =
    formData.getAll("images");

  const files = imageEntries.filter(
    (entry): entry is File =>
      typeof entry !== "string" &&
      entry.size > 0
  );
  if (files.length > 8) {
    throw new Error(
      "Vous pouvez ajouter au maximum 8 photos."
    );
  }
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  /* ==========================================
     5. VÉRIFICATION DES PHOTOS
  ========================================== */
  for (const file of files) {

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `Format non autorisé : ${file.name}`
      );
    }
    if (file.size > 4 * 1024 * 1024) {
      throw new Error(
        `${file.name} dépasse 4 Mo.`
      );
    }

  }
  /* ==========================================
     6. ENVOI VERS CLOUDINARY
  ========================================== */
  const uploadedImages: {
    url: string;
    publicId: string;
  }[] = [];

  try {
    for (const file of files) {

      const buffer = Buffer.from(
        await file.arrayBuffer()
      );
      const uploaded =
        await uploadCloudinaryImage(
          buffer,
          "agence-voyage/destinations"
        );
      uploadedImages.push({
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      });

    }
    /* ==========================================
       7. ENREGISTREMENT DANS PRISMA
    ========================================== */
    const coverIndex =
      Number.isInteger(
        requestedCoverIndex
      ) &&
      requestedCoverIndex >= 0 &&
      requestedCoverIndex <
        uploadedImages.length
        ? requestedCoverIndex
        : 0;
    await prisma.destination.create({

      data: {
        name,
        slug,
        country,
        tag:
          tag || null,
        description,
        published,

        /* Première photo = photo principale */
        coverImage:
          uploadedImages.length > 0
            ? uploadedImages[
                coverIndex
              ].url
            : null,

        /* Galerie */
        images: {

          create: uploadedImages.map(
            (image, index) => ({

              url: image.url,

              publicId:
                image.publicId,
              sortOrder:
                index,
            })
          ),
        },
      },
    });
  } catch (error) {
    /*
      Si Cloudinary a reçu certaines photos
      mais que l'enregistrement échoue ensuite,
      on supprime les photos déjà envoyées.
    */
    await Promise.allSettled(

      uploadedImages.map(
        (image) =>
          deleteCloudinaryImage(
            image.publicId
          )
      )
    );

    throw error;
  }
  /* ==========================================
     8. RAFRAÎCHISSEMENT DES PAGES
  ========================================== */

  revalidatePath(
    "/admin/destinations"
  );

  revalidatePath(
    "/destinations"
  );
  revalidatePath("/");
  /* ==========================================
     9. RETOUR ADMIN
  ========================================== */
  redirect(
    "/admin/destinations"
  );
}