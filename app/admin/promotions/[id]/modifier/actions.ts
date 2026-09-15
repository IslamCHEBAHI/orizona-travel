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



export async function updatePromotion(
  formData: FormData
) {

  await requireAdmin();


  const id =
    Number(
      formData.get("id")
    );


  if (!Number.isInteger(id)) {
    throw new Error(
      "Promotion invalide."
    );
  }



  const currentPromotion =
    await prisma.promotion.findUnique({

      where:{
        id,
      },

      include:{
        images:true,
      },

    });



  if (!currentPromotion) {
    throw new Error(
      "Promotion introuvable."
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



  const oldPrice =
    Number(
      formData.get("oldPrice")
    ) || null;



  const price =
    Number(
      formData.get("price")
    );



  const startDateValue =
    String(
      formData.get("startDate") ?? ""
    );



  const endDateValue =
    String(
      formData.get("endDate") ?? ""
    );



  const published =
    formData.get("published") === "on";



  const featured =
    formData.get("featured") === "on";



  const imagesText =
    String(
      formData.get("images") ?? "[]"
    );



  const newImages:{
    url:string;
    publicId:string;
  }[] =
    JSON.parse(imagesText);




  if(!title || !description){

    throw new Error(
      "Informations obligatoires manquantes."
    );

  }




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


      startDate:
        startDateValue
          ? new Date(
              `${startDateValue}T00:00:00`
            )
          : null,


      endDate:
        endDateValue
          ? new Date(
              `${endDateValue}T23:59:59`
            )
          : null,


      published,

      featured,



      images:{

        create:

          newImages.map(
            (image,index)=>({

              url:
                image.url,

              publicId:
                image.publicId,

              sortOrder:
                currentPromotion.images.length + index,

            })
          ),

      },

    },

  });




  revalidatePath(
    "/admin/promotions"
  );


  revalidatePath(
    `/admin/promotions/${id}/modifier`
  );


  revalidatePath(
    "/promotions"
  );


  revalidatePath(
    "/"
  );



  redirect(
    "/admin/promotions"
  );

}