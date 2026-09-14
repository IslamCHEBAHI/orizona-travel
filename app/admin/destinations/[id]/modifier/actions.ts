"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { deleteCloudinaryImage, } from "@/lib/cloudinary";
import { unlink, } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
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

export async function updateDestination(
  formData: FormData
) {
  await requireAdmin();
  const id = Number(formData.get("id"));

  const name = String(
    formData.get("name") ?? ""
  ).trim();

  const country = String(
    formData.get("country") ?? ""
  ).trim();

  const tag = String(
    formData.get("tag") ?? ""
  ).trim();

  const description = String(
    formData.get("description") ?? ""
  ).trim();

  const published =
    formData.get("published") === "on";

  if (!Number.isInteger(id)) {
    throw new Error("Destination invalide.");
  }

  if (!name || !country || !description) {
    throw new Error(
      "Le nom, le pays et la description sont obligatoires."
    );
  }

  const currentDestination =
    await prisma.destination.findUnique({
      where: {
        id,
      },
    });

  if (!currentDestination) {
    throw new Error(
      "Destination introuvable."
    );
  }

  let slug = createSlug(name);

  const destinationWithSameSlug =
    await prisma.destination.findUnique({
      where: {
        slug,
      },
    });

  if (
    destinationWithSameSlug &&
    destinationWithSameSlug.id !== id
  ) {
    slug = `${slug}-${id}`;
  }

  await prisma.destination.update({
    where: {
      id,
    },

    data: {
      name,
      country,
      tag: tag || null,
      description,
      published,
      slug,
    },
  });

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");

  revalidatePath(
    `/destinations/${currentDestination.slug}`
  );

  revalidatePath(
    `/destinations/${slug}`
  );

  redirect("/admin/destinations");
}
export async function setDestinationCover(
  formData: FormData
) {
  await requireAdmin();

  const destinationId =
    Number(
      formData.get(
        "destinationId"
      )
    );

  const imageId =
    Number(
      formData.get(
        "imageId"
      )
    );


  if (
    !Number.isInteger(
      destinationId
    ) ||
    !Number.isInteger(
      imageId
    )
  ) {
    return;
  }


  const image =
    await prisma.destinationImage.findFirst({

      where: {
        id: imageId,
        destinationId,
      },

      include: {
        destination: true,
      },

    });


  if (!image) return;


  await prisma.destination.update({

    where: {
      id: destinationId,
    },

    data: {
      coverImage:
        image.url,
    },

  });


  revalidatePath(
    `/admin/destinations/${destinationId}/modifier`
  );

  revalidatePath(
    "/admin/destinations"
  );

  revalidatePath(
    "/destinations"
  );

  revalidatePath(
    `/destinations/${image.destination.slug}`
  );

  revalidatePath("/");
}
export async function deleteDestinationImage(
  formData: FormData
) {
  await requireAdmin();

  const destinationId =
    Number(
      formData.get(
        "destinationId"
      )
    );

  const imageId =
    Number(
      formData.get(
        "imageId"
      )
    );


  if (
    !Number.isInteger(
      destinationId
    ) ||
    !Number.isInteger(
      imageId
    )
  ) {
    return;
  }


  const image =
    await prisma.destinationImage.findFirst({

      where: {
        id: imageId,
        destinationId,
      },

      include: {
        destination: true,
      },

    });


  if (!image) return;


  const wasCover =
    image.destination
      .coverImage === image.url;


  let replacement:
    { url: string } |
    null = null;


  if (wasCover) {

    replacement =
      await prisma.destinationImage.findFirst({

        where: {

          destinationId,

          id: {
            not: imageId,
          },

        },

        orderBy: {
          sortOrder: "asc",
        },

        select: {
          url: true,
        },

      });

  }


  if (wasCover) {

    await prisma.destination.update({

      where: {
        id: destinationId,
      },

      data: {
        coverImage:
          replacement?.url ??
          null,
      },

    });

  }


  await prisma.destinationImage.delete({

    where: {
      id: imageId,
    },

  });


  /*
    SUPPRESSION CLOUDINARY
  */

  if (image.publicId) {

    await deleteCloudinaryImage(
      image.publicId
    ).catch(() => {});

  }

  /*
    ANCIENNES PHOTOS LOCALES
  */

  else if (
    image.url.startsWith(
      "/uploads/"
    )
  ) {

    const relativePath =
      image.url.replace(
        /^\/+/,
        ""
      );

    const physicalPath =
      path.join(
        process.cwd(),
        "public",
        relativePath
      );


    await unlink(
      physicalPath
    ).catch(() => {});

  }


  revalidatePath(
    `/admin/destinations/${destinationId}/modifier`
  );

  revalidatePath(
    "/admin/destinations"
  );

  revalidatePath(
    "/destinations"
  );

  revalidatePath(
    `/destinations/${image.destination.slug}`
  );

  revalidatePath("/");
}