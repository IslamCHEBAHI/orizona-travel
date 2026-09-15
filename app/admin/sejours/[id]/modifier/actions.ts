"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


function createSlug(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}



export async function updateStay(
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



  const currentStay =
    await prisma.promotion.findUnique({

      where:{
        id,
      },

      include:{
        images:true,
      },

    });



  if (!currentStay) {
    throw new Error(
      "Séjour introuvable."
    );
  }



  const title =
    String(
      formData.get("title") ?? ""
    ).trim();


  const description =
    String(
      formData.get("description") ?? ""
    ).trim();


  const duration =
    String(
      formData.get("duration") ?? ""
    ).trim();



  const destinationId =
    Number(
      formData.get("destinationId")
    );


  const imagesText =
    String(
      formData.get("images") ?? "[]"
    );


  let newImages:{
    url:string;
    publicId:string;
  }[] = [];


  try {

    newImages =
      JSON.parse(imagesText);

  } catch {

    throw new Error(
      "Images invalides."
    );

  }



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


  const featured =
    formData.get("featured") === "on";



  let slug =
    createSlug(title);



  const slugExists =
    await prisma.promotion.findFirst({

      where:{
        slug,

        NOT:{
          id,
        },

      },

    });



  if(slugExists){

    slug =
      `${slug}-${id}`;

  }



  let discount:number|null = null;


  if(
    oldPrice &&
    oldPrice > price
  ){

    discount =
      Math.round(
        ((oldPrice-price) /
        oldPrice) * 100
      );

  }



  const nextSortOrder =
    currentStay.images.length;



  await prisma.promotion.update({

    where:{
      id,
    },


    data:{


      title,

      slug,

      description,


      duration:
        duration || null,


      destinationId,


      oldPrice,

      price,

      discount,


      published,

      featured,



      coverImage:
        currentStay.coverImage ??
        newImages[0]?.url ??
        null,



      images:{

        create:

          newImages.map(
            (image,index)=>({

              url:
                image.url,

              publicId:
                image.publicId,

              sortOrder:
                nextSortOrder + index,

            })
          ),

      },


    },

  });



  revalidatePath(
    "/admin/sejours"
  );


  revalidatePath(
    `/admin/sejours/${id}/modifier`
  );


  revalidatePath(
    "/sejours"
  );


  revalidatePath(
    "/"
  );


  redirect(
    "/admin/sejours"
  );

}