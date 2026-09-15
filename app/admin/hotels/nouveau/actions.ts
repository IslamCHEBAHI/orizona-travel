"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";


function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


async function getUniqueSlug(name: string) {

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

    slug = `${baseSlug}-${counter}`;
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


  if (
    uploadedImages.length > 8
  ) {

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



  const coverIndex =
    Number.isInteger(
      requestedCoverIndex
    ) &&
    requestedCoverIndex >= 0 &&
    requestedCoverIndex < uploadedImages.length
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
          ? uploadedImages[coverIndex].url
          : null,


      images: {

        create:
          uploadedImages.map(
            (image, index) => ({

              url: image.url,

              publicId: image.publicId,

              sortOrder: index,

            })
          ),

      },

    },

  });



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