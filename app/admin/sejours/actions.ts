"use server";

import { requireAdmin } from "@/lib/admin-auth";

import { prisma } from "@/lib/prisma";

import {
  deleteCloudinaryImage,
} from "@/lib/cloudinary";

import {
  revalidatePath,
} from "next/cache";


export async function deleteStay(
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


  const stay =
    await prisma.promotion.findUnique({

      where: {
        id,
      },

      include: {
        images: true,
      },

    });


  if (!stay) {
    return;
  }


  for (
    const image of stay.images
  ) {

    if (image.publicId) {

      await deleteCloudinaryImage(
        image.publicId
      ).catch(() => {});

    }

  }


  await prisma.promotion.delete({

    where: {
      id,
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
}