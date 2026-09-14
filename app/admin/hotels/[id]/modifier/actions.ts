"use server";

import { requireAdmin } from "@/lib/admin-auth";

import { revalidatePath } from "next/cache";

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


async function createUniqueHotelSlug(
  name: string,
  hotelId: number
) {

  const base =
    createSlug(name) || "hotel";

  let slug = base;
  let counter = 2;


  while (true) {

    const existing =
      await prisma.hotel.findUnique({
        where: {
          slug,
        },
      });


    if (
      !existing ||
      existing.id === hotelId
    ) {
      return slug;
    }


    slug =
      `${base}-${counter}`;

    counter++;

  }

}


async function revalidateHotelPages(
  hotelId: number
) {

  const hotel =
    await prisma.hotel.findUnique({

      where: {
        id: hotelId,
      },

      include: {

        hotelCity: {
          include: {
            hotelDestination: true,
          },
        },

      },

    });


  revalidatePath(
    "/admin/hotels"
  );


  revalidatePath(
    `/admin/hotels/${hotelId}/modifier`
  );


  revalidatePath("/");


  if (hotel) {

    revalidatePath(
      `/hotels/${hotel.hotelCity.hotelDestination.slug}/${hotel.hotelCity.slug}`
    );

  }

}


export async function updateHotel(
  formData: FormData
) {
  await requireAdmin();
  const hotelId =
    Number(
      formData.get("hotelId")
    );

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

  const oldPriceValue =
    String(
      formData.get("oldPrice") ?? ""
    ).trim();

  const oldPrice =
    oldPriceValue
      ? Number(oldPriceValue)
      : null;

  const published =
    formData.get("published") === "on";

  const monthlyOffer =
    formData.get("monthlyOffer") === "on";

  if (!Number.isInteger(hotelId)) {
    throw new Error(
      "Hôtel invalide."
    );
  }

  if (!name) {
    throw new Error(
      "Le nom est obligatoire."
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
      "Ville invalide."
    );
  }

  if (
    !Number.isInteger(stars) ||
    stars < 1 ||
    stars > 5
  ) {
    throw new Error(
      "Nombre d'étoiles invalide."
    );
  }

  if (
    !Number.isFinite(price) ||
    price <= 0
  ) {
    throw new Error(
      "Prix invalide."
    );
  }

  if (
    oldPrice !== null &&
    (
      !Number.isFinite(oldPrice) ||
      oldPrice < 0
    )
  ) {
    throw new Error(
      "Ancien prix invalide."
    );
  }

  const currentHotel =
    await prisma.hotel.findUnique({
      where: {
        id: hotelId,
      },
    });

  if (!currentHotel) {
    throw new Error(
      "Hôtel introuvable."
    );
  }

  const city =
    await prisma.hotelCity.findUnique({
      where: {
        id: hotelCityId,
      },
    });

  if (!city) {
    throw new Error(
      "Ville introuvable."
    );
  }

  const slug =
    await createUniqueHotelSlug(
      name,
      hotelId
    );

  await prisma.hotel.update({
    where: {
      id: hotelId,
    },

    data: {
      name,
      slug,
      description,
      hotelCityId,
      stars,
      price,
      oldPrice,
      published,
      monthlyOffer,
    },
  });

  await revalidateHotelPages(
    hotelId
  );
}

export async function setHotelCover(
  formData: FormData
) {
  await requireAdmin();
  const hotelId =
    Number(
      formData.get("hotelId")
    );

  const imageId =
    Number(
      formData.get("imageId")
    );

  const image =
    await prisma.hotelImage.findFirst({
      where: {
        id: imageId,
        hotelId,
      },
    });

  if (!image) {
    throw new Error(
      "Photo introuvable."
    );
  }

  await prisma.hotel.update({
    where: {
      id: hotelId,
    },

    data: {
      coverImage: image.url,
    },
  });

  await revalidateHotelPages(
    hotelId
  );
}

export async function deleteHotelImage(
  formData: FormData
) {
  await requireAdmin();

  const hotelId =
    Number(
      formData.get("hotelId")
    );


  const imageId =
    Number(
      formData.get("imageId")
    );


  const image =
    await prisma.hotelImage.findFirst({

      where: {
        id: imageId,
        hotelId,
      },

    });


  if (!image) {
    throw new Error(
      "Photo introuvable."
    );
  }


  const hotel =
    await prisma.hotel.findUnique({

      where: {
        id: hotelId,
      },

    });


  if (!hotel) {
    throw new Error(
      "Hôtel introuvable."
    );
  }


  if (image.publicId) {

    await deleteCloudinaryImage(
      image.publicId
    );

  }


  await prisma.hotelImage.delete({

    where: {
      id: image.id,
    },

  });


  if (
    hotel.coverImage === image.url
  ) {

    const nextImage =
      await prisma.hotelImage.findFirst({

        where: {
          hotelId,
        },

        orderBy: {
          sortOrder: "asc",
        },

      });


    await prisma.hotel.update({

      where: {
        id: hotelId,
      },

      data: {

        coverImage:
          nextImage?.url ??
          null,

      },

    });

  }


  await revalidateHotelPages(
    hotelId
  );

}

