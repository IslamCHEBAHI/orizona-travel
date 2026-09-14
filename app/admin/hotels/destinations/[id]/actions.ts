"use server";

import { requireAdmin } from "@/lib/admin-auth";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import {
  deleteCloudinaryImage,
} from "@/lib/cloudinary";


export async function deleteHotelCity(
  formData: FormData
) {
  await requireAdmin();
  const cityId =
    Number(
      formData.get("cityId")
    );

  const destinationId =
    Number(
      formData.get("destinationId")
    );


  if (
    !Number.isInteger(cityId) ||
    !Number.isInteger(destinationId)
  ) {
    throw new Error(
      "Ville invalide."
    );
  }


  const city =
    await prisma.hotelCity.findFirst({
      where: {
        id: cityId,
        hotelDestinationId:
          destinationId,
      },

      include: {
        hotelDestination: true,

        hotels: {
          include: {
            images: true,
          },
        },
      },
    });


  if (!city) {
    throw new Error(
      "Ville introuvable."
    );
  }


  /*
   * On récupère tous les publicId
   * avant suppression de la BDD.
   */

  const publicIds: string[] = [];


  if (city.publicId) {
    publicIds.push(
      city.publicId
    );
  }


  for (
    const hotel of city.hotels
  ) {
    for (
      const image of hotel.images
    ) {
      if (image.publicId) {
        publicIds.push(
          image.publicId
        );
      }
    }
  }


  /*
   * Grâce au onDelete: Cascade :
   *
   * Ville
   * ↓
   * Hôtels
   * ↓
   * Photos hôtels
   *
   * seront supprimés automatiquement.
   */

  await prisma.hotelCity.delete({
    where: {
      id: city.id,
    },
  });


  /*
   * Nettoyage Cloudinary.
   */

  await Promise.allSettled(
    publicIds.map(
      (publicId) =>
        deleteCloudinaryImage(
          publicId
        )
    )
  );


  revalidatePath(
    "/admin/hotels"
  );

  revalidatePath(
    `/admin/hotels/destinations/${destinationId}`
  );

  revalidatePath(
    `/hotels/${city.hotelDestination.slug}`
  );

  revalidatePath("/");
}