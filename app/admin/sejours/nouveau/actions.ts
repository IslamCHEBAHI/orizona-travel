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


export async function createStay(
  formData: FormData
) {
  await requireAdmin();

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

  const availableSeatsValue =
    String(
      formData.get("availableSeats") ?? ""
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

  const requestedCoverIndex =
    Number(
      formData.get("coverIndex") ?? 0
    );


  if (!title) {
    throw new Error(
      "Le titre du séjour est obligatoire."
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


  const price =
    Number(priceValue);

  if (
    !Number.isInteger(price) ||
    price <= 0
  ) {
    throw new Error(
      "Le prix est invalide."
    );
  }


  const oldPrice =
    oldPriceValue
      ? Number(oldPriceValue)
      : null;


  const hotelStars =
    hotelStarsValue
      ? Number(hotelStarsValue)
      : null;


  const availableSeats =
    availableSeatsValue
      ? Number(availableSeatsValue)
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


  const existing =
    await prisma.promotion.findUnique({
      where: {
        slug,
      },
    });


  if (existing) {
    slug =
      `${slug}-${Date.now()}`;
  }


  const files =
    formData
      .getAll("images")
      .filter(
        (entry): entry is File =>
          typeof entry !== "string" &&
          entry.size > 0
      );


  if (files.length > 5) {

    throw new Error(
      "Maximum 5 photos par séjour."
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

    if (
      !acceptedTypes.includes(
        file.type
      )
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


    const uploaded =
      await uploadCloudinaryImage(
        buffer,
        "agence-voyage/sejours"
      );


    uploadedImages.push({
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    });

  }


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

      hotelName:
        hotelName || null,

      hotelStars,

      boardType:
        boardType || null,

      transport:
        transport || null,

      baggage:
        baggage || null,

      availableSeats,

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

      destinationId,

      coverImage:
        uploadedImages.length > 0
          ? uploadedImages[
              coverIndex
            ].url
          : null,

      images: {

        create:
          uploadedImages.map(
            (image, index) => ({

              url:
                image.url,

              publicId:
                image.publicId,

              sortOrder:
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
    "/sejours"
  );

  revalidatePath(
    "/"
  );


  redirect(
    "/admin/sejours"
  );
}