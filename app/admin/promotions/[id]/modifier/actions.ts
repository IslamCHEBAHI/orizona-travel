"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  deleteCloudinaryImage,
} from "@/lib/cloudinary";

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
    Number(formData.get("id"));


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


  const startDate =
    String(
      formData.get("startDate") ?? ""
    );


  const endDate =
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



  const currentImages:
    {
      url:string;
      publicId:string;
    }[] =
    JSON.parse(imagesText);





  const oldIds =
    currentPromotion.images.map(
      img => img.url
    );



  const keptUrls =
    currentImages.map(
      img => img.url
    );



  const deletedImages =
    currentPromotion.images.filter(
      img =>
        !keptUrls.includes(img.url)
    );




  for (const image of deletedImages) {

    await prisma.promotionImage.delete({
      where:{
        id:image.id,
      },
    });


    if(image.publicId){

      await deleteCloudinaryImage(
        image.publicId
      ).catch(()=>{});

    }

  }




  const newImages =
    currentImages.filter(
      image =>
        !oldIds.includes(image.url)
    );





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
        startDate
          ? new Date(`${startDate}T00:00:00`)
          : null,


      endDate:
        endDate
          ? new Date(`${endDate}T23:59:59`)
          : null,


      published,

      featured,



      coverImage:
        currentImages.length > 0
          ? currentImages[0].url
          : null,



      images:{

        create:

          newImages.map(
            (image,index)=>({

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