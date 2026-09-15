"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import { unlink } from "fs/promises";
import path from "path";
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


  const id =
    Number(
      formData.get("id")
    );


  const name =
    String(
      formData.get("name") ?? ""
    ).trim();


  const country =
    String(
      formData.get("country") ?? ""
    ).trim();


  const tag =
    String(
      formData.get("tag") ?? ""
    ).trim();


  const description =
    String(
      formData.get("description") ?? ""
    ).trim();


  const published =
    formData.get("published") === "on";



  const imagesText =
    String(
      formData.get("images") ?? "[]"
    );


  let newImages: {
    url: string;
    publicId: string;
  }[] = [];


  try {

    newImages =
      JSON.parse(imagesText);

  } catch {

    throw new Error(
      "Images invalides."
    );

  }



  if (!Number.isInteger(id)) {

    throw new Error(
      "Destination invalide."
    );

  }



  const currentDestination =
    await prisma.destination.findUnique({

      where:{
        id,
      },

      include:{
        images:true,
      },

    });



  if (!currentDestination) {

    throw new Error(
      "Destination introuvable."
    );

  }



  let slug =
    createSlug(name);



  const sameSlug =
    await prisma.destination.findUnique({

      where:{
        slug,
      },

    });



  if (
    sameSlug &&
    sameSlug.id !== id
  ) {

    slug =
      `${slug}-${id}`;

  }



  await prisma.destination.update({

    where:{
      id,
    },

    data:{

      name,

      country,

      tag:
        tag || null,

      description,

      published,

      slug,

    },

  });



  /*
    Ajout des nouvelles images
    déjà uploadées sur Cloudinary
  */

  if (
    newImages.length > 0
  ) {


    const lastImage =
      await prisma.destinationImage.findFirst({

        where:{
          destinationId:id,
        },

        orderBy:{
          sortOrder:"desc",
        },

      });



    const startOrder =
      lastImage
        ? lastImage.sortOrder + 1
        : 0;



    await prisma.destinationImage.createMany({

      data:

        newImages.map(
          (image,index)=>({

            destinationId:id,

            url:
              image.url,

            publicId:
              image.publicId,

            sortOrder:
              startOrder + index,

          })
        ),

    });



    if (
      !currentDestination.coverImage
    ) {

      await prisma.destination.update({

        where:{
          id,
        },

        data:{
          coverImage:
            newImages[0].url,
        },

      });

    }

  }



  revalidatePath(
    "/admin/destinations"
  );


  revalidatePath(
    `/admin/destinations/${id}/modifier`
  );


  revalidatePath(
    "/destinations"
  );


  revalidatePath(
    "/"
  );


  redirect(
    "/admin/destinations"
  );

}





export async function setDestinationCover(
  formData: FormData
) {

  await requireAdmin();


  const destinationId =
    Number(
      formData.get("destinationId")
    );


  const imageId =
    Number(
      formData.get("imageId")
    );



  const image =
    await prisma.destinationImage.findFirst({

      where:{
        id:imageId,
        destinationId,
      },

      include:{
        destination:true,
      },

    });



  if (!image) return;



  await prisma.destination.update({

    where:{
      id:destinationId,
    },

    data:{
      coverImage:image.url,
    },

  });



  revalidatePath(
    `/admin/destinations/${destinationId}/modifier`
  );

  revalidatePath(
    "/destinations"
  );

  revalidatePath(
    "/"
  );

}





export async function deleteDestinationImage(
  formData: FormData
) {

  await requireAdmin();


  const destinationId =
    Number(
      formData.get("destinationId")
    );


  const imageId =
    Number(
      formData.get("imageId")
    );



  const image =
    await prisma.destinationImage.findFirst({

      where:{
        id:imageId,
        destinationId,
      },

      include:{
        destination:true,
      },

    });



  if (!image) return;



  const wasCover =
    image.destination.coverImage === image.url;



  if (wasCover) {

    const replacement =
      await prisma.destinationImage.findFirst({

        where:{
          destinationId,
          id:{
            not:imageId,
          },
        },

        orderBy:{
          sortOrder:"asc",
        },

      });



    await prisma.destination.update({

      where:{
        id:destinationId,
      },

      data:{
        coverImage:
          replacement?.url ?? null,
      },

    });

  }



  await prisma.destinationImage.delete({

    where:{
      id:imageId,
    },

  });



  if (image.publicId) {

    await deleteCloudinaryImage(
      image.publicId
    ).catch(()=>{});

  }
  else if (
    image.url.startsWith("/uploads/")
  ) {

    const relativePath =
      image.url.replace(
        /^\/+/,
        ""
      );


    await unlink(
      path.join(
        process.cwd(),
        "public",
        relativePath
      )
    ).catch(()=>{});

  }



  revalidatePath(
    `/admin/destinations/${destinationId}/modifier`
  );

  revalidatePath(
    "/destinations"
  );

  revalidatePath(
    "/"
  );

}