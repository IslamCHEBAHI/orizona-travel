"use server";

import { requireAdmin } from "@/lib/admin-auth";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import {
  deleteCloudinaryImage,
  uploadCloudinaryImage,
} from "@/lib/cloudinary";


function createSlug(
  value: string
) {

  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );

}


async function getUniqueCitySlug(
  name: string,
  hotelDestinationId: number
) {

  const baseSlug =
    createSlug(name) ||
    "ville";


  let slug =
    baseSlug;


  let counter =
    2;


  while (
    await prisma.hotelCity.findFirst({

      where: {
        hotelDestinationId,
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


export async function createHotelCity(
  formData: FormData
) {
  await requireAdmin();

  const hotelDestinationId =
    Number(
      formData.get(
        "hotelDestinationId"
      )
    );


  const name =
    String(
      formData.get("name") ?? ""
    ).trim();


  const description =
    String(
      formData.get("description") ?? ""
    ).trim();


  const sortOrder =
    Number(
      formData.get("sortOrder") ?? 0
    );


  const published =
    formData.get("published") === "on";


  const featured =
    formData.get("featured") === "on";


  const coverFile =
    formData.get("coverImage");


  if (
    !Number.isInteger(
      hotelDestinationId
    )
  ) {

    throw new Error(
      "Destination hôtelière invalide."
    );

  }


  if (!name) {

    throw new Error(
      "Le nom de la ville est obligatoire."
    );

  }


  const destination =
    await prisma.hotelDestination.findUnique({

      where: {
        id: hotelDestinationId,
      },

    });


  if (!destination) {

    throw new Error(
      "Destination introuvable."
    );

  }


  const slug =
    await getUniqueCitySlug(
      name,
      hotelDestinationId
    );


  let coverImage:
    string | null = null;


  let publicId:
    string | null = null;


  try {

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
          "Utilisez une image JPEG, PNG ou WEBP."
        );

      }


      if (
        coverFile.size >
        4 * 1024 * 1024
      ) {

        throw new Error(
          "La photo ne doit pas dépasser 4 Mo."
        );

      }


      const arrayBuffer =
        await coverFile.arrayBuffer();


      const buffer =
        Buffer.from(
          arrayBuffer
        );


      const uploadResult =
        await uploadCloudinaryImage(
          buffer,
          "agence-voyage/hotel-cities"
        );


      coverImage =
        uploadResult.secure_url;


      publicId =
        uploadResult.public_id;

    }


    await prisma.hotelCity.create({

      data: {

        name,

        slug,

        description:
          description || null,

        coverImage,

        publicId,

        published,

        featured,

        sortOrder:
          Number.isFinite(sortOrder)
            ? sortOrder
            : 0,

        hotelDestinationId,

      },

    });


  } catch (error) {

    if (publicId) {

      await deleteCloudinaryImage(
        publicId
      ).catch(() => {});

    }


    throw error;

  }


  revalidatePath(
    "/admin/hotels"
  );


  revalidatePath(
    `/admin/hotels/destinations/${hotelDestinationId}`
  );


  revalidatePath(
    `/hotels/${destination.slug}`
  );


  redirect(
    `/admin/hotels/destinations/${hotelDestinationId}`
  );

}