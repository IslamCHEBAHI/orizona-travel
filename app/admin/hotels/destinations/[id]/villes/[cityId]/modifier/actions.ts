"use server";

import { requireAdmin } from "@/lib/admin-auth";

import {
  revalidatePath,
} from "next/cache";

import {
  redirect,
} from "next/navigation";

import {
  prisma,
} from "@/lib/prisma";

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
  hotelDestinationId: number,
  cityId: number
) {
  const baseSlug =
    createSlug(name) ||
    "ville";

  let slug =
    baseSlug;

  let counter =
    2;

  while (true) {
    const existing =
      await prisma.hotelCity.findFirst({
        where: {
          hotelDestinationId,
          slug,
        },
      });

    if (
      !existing ||
      existing.id === cityId
    ) {
      return slug;
    }

    slug =
      `${baseSlug}-${counter}`;

    counter++;
  }
}


export async function updateHotelCity(
  formData: FormData
) {
  await requireAdmin();
  const cityId =
    Number(
      formData.get("cityId")
    );

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
      formData.get(
        "description"
      ) ?? ""
    ).trim();

  const sortOrder =
    Number(
      formData.get(
        "sortOrder"
      ) ?? 0
    );

  const published =
    formData.get(
      "published"
    ) === "on";

  const featured =
    formData.get(
      "featured"
    ) === "on";

  const coverFile =
    formData.get(
      "coverImage"
    );

  if (
    !Number.isInteger(cityId) ||
    !Number.isInteger(
      hotelDestinationId
    )
  ) {
    throw new Error(
      "Ville invalide."
    );
  }

  if (!name) {
    throw new Error(
      "Le nom de la ville est obligatoire."
    );
  }

  const currentCity =
    await prisma.hotelCity.findFirst({
      where: {
        id: cityId,
        hotelDestinationId,
      },

      include: {
        hotelDestination: true,
      },
    });

  if (!currentCity) {
    throw new Error(
      "Ville introuvable."
    );
  }

  const oldSlug =
    currentCity.slug;

  const slug =
    await getUniqueCitySlug(
      name,
      hotelDestinationId,
      cityId
    );

  let nextCoverImage =
    currentCity.coverImage;

  let nextPublicId =
    currentCity.publicId;

  let uploadedPublicId:
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

      const buffer =
        Buffer.from(
          await coverFile.arrayBuffer()
        );

      const uploadResult =
        await uploadCloudinaryImage(
          buffer,
          "agence-voyage/hotel-cities"
        );

      nextCoverImage =
        uploadResult.secure_url;

      nextPublicId =
        uploadResult.public_id;

      uploadedPublicId =
        uploadResult.public_id;
    }

    await prisma.hotelCity.update({
      where: {
        id: cityId,
      },

      data: {
        name,
        slug,

        description:
          description || null,

        coverImage:
          nextCoverImage,

        publicId:
          nextPublicId,

        published,
        featured,

        sortOrder:
          Number.isFinite(
            sortOrder
          )
            ? sortOrder
            : 0,
      },
    });

    if (
      uploadedPublicId &&
      currentCity.publicId &&
      currentCity.publicId !==
        uploadedPublicId
    ) {
      await deleteCloudinaryImage(
        currentCity.publicId
      ).catch(() => {});
    }

  } catch (error) {
    if (
      uploadedPublicId
    ) {
      await deleteCloudinaryImage(
        uploadedPublicId
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
    `/hotels/${currentCity.hotelDestination.slug}`
  );

  revalidatePath(
    `/hotels/${currentCity.hotelDestination.slug}/${oldSlug}`
  );

  revalidatePath(
    `/hotels/${currentCity.hotelDestination.slug}/${slug}`
  );

  revalidatePath("/");

  redirect(
    `/admin/hotels/destinations/${hotelDestinationId}`
  );
}