"use server";

import { requireAdmin } from "@/lib/admin-auth";

import { prisma } from "@/lib/prisma";

import {
  uploadCloudinaryImage,
  deleteCloudinaryImage,
} from "@/lib/cloudinary";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


function createSlug(text: string) {

  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

}


export async function updateStay(
  formData: FormData
) {
  await requireAdmin();

  const id =
    Number(
      formData.get("id")
    );


  if (!Number.isInteger(id)) {
    throw new Error(
      "Séjour invalide."
    );
  }


  const currentStay =
    await prisma.promotion.findUnique({

      where: {
        id,
      },

      include: {
        images: true,
      },

    });


  if (!currentStay) {
    throw new Error(
      "Séjour introuvable."
    );
  }


  const title =
    String(
      formData.get("title") ?? ""
    ).trim();


  const description =
    String(
      formData.get("description") ?? ""
    ).trim();


  const duration =
    String(
      formData.get("duration") ?? ""
    ).trim();


  const destinationId =
    Number(
      formData.get("destinationId")
    );


  const departureCity =
    String(
      formData.get("departureCity") ?? ""
    ).trim();


  const departureDateValue =
    String(
      formData.get("departureDate") ?? ""
    ).trim();


  const returnDateValue =
    String(
      formData.get("returnDate") ?? ""
    ).trim();


  const availableSeatsValue =
    String(
      formData.get("availableSeats") ?? ""
    ).trim();


  const hotelName =
    String(
      formData.get("hotelName") ?? ""
    ).trim();


  const hotelStarsValue =
    String(
      formData.get("hotelStars") ?? ""
    ).trim();


  const boardType =
    String(
      formData.get("boardType") ?? ""
    ).trim();


  const transport =
    String(
      formData.get("transport") ?? ""
    ).trim();


  const baggage =
    String(
      formData.get("baggage") ?? ""
    ).trim();


  const oldPriceValue =
    String(
      formData.get("oldPrice") ?? ""
    ).trim();


  const priceValue =
    String(
      formData.get("price") ?? ""
    ).trim();


  const program =
    String(
      formData.get("program") ?? ""
    ).trim();


  const included =
    String(
      formData.get("included") ?? ""
    ).trim();


  const excluded =
    String(
      formData.get("excluded") ?? ""
    ).trim();


  const published =
    formData.get("published") === "on";


  const featured =
    formData.get("featured") === "on";


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
      "Destination invalide."
    );
  }


  const price =
    Number(priceValue);


  if (
    !Number.isInteger(price) ||
    price <= 0
  ) {

    throw new Error(
      "Prix invalide."
    );

  }


  const oldPrice =
    oldPriceValue
      ? Number(oldPriceValue)
      : null;


  const availableSeats =
    availableSeatsValue
      ? Number(availableSeatsValue)
      : null;


  const hotelStars =
    hotelStarsValue
      ? Number(hotelStarsValue)
      : null;


  let discount:
    number | null = null;


  if (
    oldPrice &&
    oldPrice > price
  ) {

    discount =
      Math.round(
        ((oldPrice - price) /
          oldPrice) *
          100
      );

  }


  let slug =
    createSlug(title);


  const slugExists =
    await prisma.promotion.findFirst({

      where: {

        slug,

        NOT: {
          id,
        },

      },

    });


  if (slugExists) {

    slug =
      `${slug}-${id}`;

  }


  const files =
    formData
      .getAll("images")
      .filter(
        (entry): entry is File =>
          typeof entry !== "string" &&
          entry.size > 0
      );


  const uploadedImages: {
    url: string;
    publicId: string;
  }[] = [];


  for (const file of files) {

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {

      throw new Error(
        `Format non autorisé : ${file.name}`
      );

    }


    if (
      file.size >
      4 * 1024 * 1024
    ) {

      throw new Error(
        `${file.name} dépasse 4 Mo.`
      );

    }


    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      );


    const upload =
      await uploadCloudinaryImage(
        buffer,
        "agence-voyage/sejours"
      );


    uploadedImages.push({

      url:
        upload.secure_url,

      publicId:
        upload.public_id,

    });

  }


  const nextSortOrder =
    currentStay.images.length;


  await prisma.promotion.update({

    where: {
      id,
    },

    data: {

      title,
      slug,
      description,

      duration:
        duration || null,

      destinationId,

      departureCity:
        departureCity || null,

      departureDate:
        departureDateValue
          ? new Date(
              `${departureDateValue}T00:00:00`
            )
          : null,

      returnDate:
        returnDateValue
          ? new Date(
              `${returnDateValue}T00:00:00`
            )
          : null,

      availableSeats,

      hotelName:
        hotelName || null,

      hotelStars,

      boardType:
        boardType || null,

      transport:
        transport || null,

      baggage:
        baggage || null,

      oldPrice,
      price,
      discount,

      program:
        program || null,

      included:
        included || null,

      excluded:
        excluded || null,

      published,
      featured,

      coverImage:
        currentStay.coverImage ??
        uploadedImages[0]?.url ??
        null,

      images: {

        create:
          uploadedImages.map(
            (image, index) => ({

              url:
                image.url,

              publicId:
                image.publicId,

              sortOrder:
                nextSortOrder +
                index,

            })
          ),

      },

    },

  });


  revalidatePath(
    "/admin/sejours"
  );

  revalidatePath(
    `/admin/sejours/${id}/modifier`
  );

  revalidatePath(
    "/sejours"
  );

  revalidatePath(
    `/sejours/${slug}`
  );

  revalidatePath(
    "/"
  );


  redirect(
    "/admin/sejours"
  );
}