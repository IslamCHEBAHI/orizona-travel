"use server";

import { requireAdmin } from "@/lib/admin-auth";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import {
  deleteCloudinaryImage,
  uploadCloudinaryImage,
} from "@/lib/cloudinary";


function createSlug(value: string) {

  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

}


async function getUniqueSlug(
  name: string
) {

  const baseSlug =
    createSlug(name) || "hotel";

  let slug = baseSlug;

  let counter = 2;


  while (
    await prisma.hotel.findUnique({
      where: {
        slug,
      },
    })
  ) {

    slug =
      `${baseSlug}-${counter}`;

    counter++;

  }


  return slug;
}


export async function createHotel(
  formData: FormData
) {
  await requireAdmin();

  const name =
    String(
      formData.get("name") ?? ""
    ).trim();


  const description =
    String(
      formData.get("description") ?? ""
    ).trim();


  const hotelCityId =
    Number(
      formData.get("hotelCityId")
    );


  const stars =
    Number(
      formData.get("stars")
    );


  const price =
    Number(
      formData.get("price")
    );


  const oldPriceText =
    String(
      formData.get("oldPrice") ?? ""
    ).trim();


  const oldPrice =
    oldPriceText
      ? Number(oldPriceText)
      : null;


  const published =
    formData.get("published") === "on";


  const monthlyOffer =
    formData.get("monthlyOffer") === "on";


  const requestedCoverIndex =
    Number(
      formData.get("coverIndex") ?? 0
    );


  const files =
    formData
      .getAll("images")
      .filter(
        (item): item is File =>
          item instanceof File &&
          item.size > 0
      );


  if (!name) {
    throw new Error(
      "Le nom de l'hôtel est obligatoire."
    );
  }


  if (!description) {
    throw new Error(
      "La description est obligatoire."
    );
  }


  if (
    !Number.isInteger(hotelCityId)
  ) {
    throw new Error(
      "La ville sélectionnée est invalide."
    );
  }


  if (
    !Number.isInteger(stars) ||
    stars < 1 ||
    stars > 5
  ) {
    throw new Error(
      "Le classement doit être compris entre 1 et 5 étoiles."
    );
  }


  if (
    !Number.isFinite(price) ||
    price <= 0
  ) {
    throw new Error(
      "Le prix est invalide."
    );
  }


  if (files.length > 8) {
    throw new Error(
      "Maximum 8 photos par hôtel."
    );
  }


  const city =
    await prisma.hotelCity.findUnique({

      where: {
        id: hotelCityId,
      },

      include: {
        hotelDestination: true,
      },

    });


  if (!city) {
    throw new Error(
      "Ville introuvable."
    );
  }


  const slug =
    await getUniqueSlug(name);


  const uploadedImages: {
    url: string;
    publicId: string;
  }[] = [];


  try {

    for (const file of files) {

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];


      if (
        !allowedTypes.includes(
          file.type
        )
      ) {
        throw new Error(
          "Les photos doivent être JPEG, PNG ou WEBP."
        );
      }


      if (
        file.size >
        4 * 1024 * 1024
      ) {
        throw new Error(
          "Chaque photo doit faire moins de 4 Mo."
        );
      }


      const buffer =
        Buffer.from(
          await file.arrayBuffer()
        );


      const result =
        await uploadCloudinaryImage(
          buffer,
          "agence-voyage/hotels"
        );


      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
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


    await prisma.hotel.create({

      data: {

        name,

        slug,

        description,

        stars,

        price,

        oldPrice,

        published,

        monthlyOffer,

        hotelCityId,

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


  } catch (error) {

    for (
      const image
      of uploadedImages
    ) {

      await deleteCloudinaryImage(
        image.publicId
      ).catch(() => {});

    }


    throw error;
  }


  revalidatePath(
    "/admin/hotels"
  );

  revalidatePath(
    `/admin/hotels/destinations/${city.hotelDestinationId}`
  );

  revalidatePath(
    `/hotels/${city.hotelDestination.slug}/${city.slug}`
  );

  revalidatePath(
    "/"
  );


  redirect(
    "/admin/hotels"
  );

}