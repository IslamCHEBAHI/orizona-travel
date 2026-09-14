"use server";

import { requireAdmin } from "@/lib/admin-auth";

import { prisma } from "@/lib/prisma";
import { uploadCloudinaryImage } from "@/lib/cloudinary";
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

export async function createPromotion(
  formData: FormData
) {
  await requireAdmin();

  const title = String(
    formData.get("title") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const duration = String(
    formData.get("duration") ?? ""
  ).trim();

  const destinationId = Number(
    formData.get("destinationId")
  );

  const oldPriceValue = String(
    formData.get("oldPrice") ?? ""
  ).trim();

  const priceValue = String(
    formData.get("price") ?? ""
  ).trim();

  const startDateValue = String(
    formData.get("startDate") ?? ""
  ).trim();

  const endDateValue = String(
    formData.get("endDate") ?? ""
  ).trim();

  const published =
    formData.get("published") === "on";

  const featured =
    formData.get("featured") === "on";
    const requestedCoverIndex =
      Number(
        formData.get("coverIndex") ?? 0
      );


  if (!title) {
    throw new Error(
      "Le titre est obligatoire."
    );
  }

  if (!description) {
    throw new Error(
      "La description est obligatoire."
    );
  }

  if (!Number.isInteger(destinationId)) {
    throw new Error(
      "Veuillez sélectionner une destination."
    );
  }


  const price = Number(priceValue);

  if (
    !Number.isInteger(price) ||
    price <= 0
  ) {
    throw new Error(
      "Le prix promotionnel est invalide."
    );
  }


  const oldPrice =
    oldPriceValue
      ? Number(oldPriceValue)
      : null;


  if (
    oldPrice !== null &&
    (!Number.isInteger(oldPrice) || oldPrice <= 0)
  ) {
    throw new Error(
      "L'ancien prix est invalide."
    );
  }


  // Calcul automatique du pourcentage de réduction

  let discount: number | null = null;

  if (
    oldPrice &&
    oldPrice > price
  ) {
    discount = Math.round(
      ((oldPrice - price) / oldPrice) * 100
    );
  }


  let slug = createSlug(title);

  const existing =
    await prisma.promotion.findUnique({
      where: {
        slug,
      },
    });

  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }


  // Photos

  const files = formData
    .getAll("images")
    .filter(
      (entry): entry is File =>
        typeof entry !== "string" &&
        entry.size > 0
    );


  if (files.length > 8) {
    throw new Error(
      "Maximum 8 photos par promotion."
    );
  }


  const acceptedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];


  const uploadedImages: {
  url: string;
  publicId: string;
}[] = [];


for (const file of files) {

  if (!acceptedTypes.includes(file.type)) {
    throw new Error(
      `Format non autorisé : ${file.name}`
    );
  }


  if (file.size > 8 * 1024 * 1024) {
    throw new Error(
      `${file.name} dépasse 8 Mo.`
    );
  }


  const buffer = Buffer.from(
    await file.arrayBuffer()
  );


  const uploaded =
    await uploadCloudinaryImage(
      buffer,
      "agence-voyage/promotions"
    );


  uploadedImages.push({
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
  });

}


  // Enregistrement Prisma
  const coverIndex =
    Number.isInteger(
      requestedCoverIndex
    ) &&
    requestedCoverIndex >= 0 &&
    requestedCoverIndex <
      uploadedImages.length
      ? requestedCoverIndex
      : 0;

  await prisma.promotion.create({

    data: {

      title,
      slug,
      description,

      duration:
        duration || null,

      oldPrice,
      price,
      discount,

      published,
      featured,

      startDate:
        startDateValue
          ? new Date(
              `${startDateValue}T00:00:00`
            )
          : null,

      endDate:
        endDateValue
          ? new Date(
              `${endDateValue}T23:59:59`
            )
          : null,

      destinationId,

      coverImage:
        uploadedImages.length > 0
          ? uploadedImages[
              coverIndex
            ].url
          : null,

      images: {
        create: uploadedImages.map(
          (image, index) => ({
            url: image.url,
            publicId: image.publicId,
            sortOrder: index,
          })
        ),
      },

    },

  });


  revalidatePath(
    "/admin/promotions"
  );

  revalidatePath("/");

  revalidatePath(
    "/promotions"
  );


  redirect(
    "/admin/promotions"
  );
}