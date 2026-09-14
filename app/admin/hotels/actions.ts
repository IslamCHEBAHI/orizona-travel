"use server";

import { requireAdmin } from "@/lib/admin-auth";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

import {
  deleteCloudinaryImage,
} from "@/lib/cloudinary";


export async function deleteHotel(
  formData: FormData
) {
  await requireAdmin();
  const hotelId =
    Number(
      formData.get("hotelId")
    );


  if (
    !Number.isInteger(hotelId)
  ) {
    throw new Error(
      "Hôtel invalide."
    );
  }


  const hotel =
    await prisma.hotel.findUnique({
      where: {
        id: hotelId,
      },

      include: {
        images: true,

        hotelCity: {
          include: {
            hotelDestination: true,
          },
        },
      },
    });


  if (!hotel) {
    throw new Error(
      "Hôtel introuvable."
    );
  }


  const publicIds =
    hotel.images
      .map(
        (image) =>
          image.publicId
      )
      .filter(
        (
          publicId
        ): publicId is string =>
          Boolean(publicId)
      );


  /*
   * La suppression Hotel
   * supprime automatiquement HotelImage
   * grâce au Cascade Prisma.
   */

  await prisma.hotel.delete({
    where: {
      id: hotel.id,
    },
  });


  /*
   * Suppression physique
   * des photos Cloudinary.
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
    `/admin/hotels/destinations/${hotel.hotelCity.hotelDestinationId}`
  );

  revalidatePath(
    `/hotels/${hotel.hotelCity.hotelDestination.slug}/${hotel.hotelCity.slug}`
  );

  revalidatePath("/");
}