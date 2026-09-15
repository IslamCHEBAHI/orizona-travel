"use server";

import { requireAdmin } from "@/lib/admin-auth";
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



export async function createDestination(
  formData: FormData
) {

  await requireAdmin();


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


  const requestedCoverIndex =
    Number(
      formData.get("coverIndex") ?? 0
    );



  const imagesText =
    String(
      formData.get("images") ?? "[]"
    );



  let uploadedImages: {
    url: string;
    publicId: string;
  }[] = [];



  try {

    uploadedImages =
      JSON.parse(imagesText);


  } catch {

    throw new Error(
      "Images invalides."
    );

  }



  if (!name) {

    throw new Error(
      "Le nom de la destination est obligatoire."
    );

  }



  if (!country) {

    throw new Error(
      "Le pays est obligatoire."
    );

  }



  if (!description) {

    throw new Error(
      "La description est obligatoire."
    );

  }



  if (
    uploadedImages.length > 8
  ) {

    throw new Error(
      "Maximum 8 photos."
    );

  }



  let slug =
    createSlug(name);



  const existingDestination =
    await prisma.destination.findUnique({

      where: {
        slug,
      },

    });



  if (existingDestination) {

    slug =
      `${slug}-${Date.now()}`;

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



  await prisma.destination.create({

    data: {

      name,

      country,

      slug,

      tag:
        tag || null,


      description,

      published,


      coverImage:
        uploadedImages.length > 0
          ? uploadedImages[coverIndex].url
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
    "/admin/destinations"
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