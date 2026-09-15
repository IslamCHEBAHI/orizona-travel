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


  const id = Number(
    formData.get("id")
  );


  if (!Number.isInteger(id)) {
    throw new Error("Promotion invalide.");
  }



  const promotion =
    await prisma.promotion.findUnique({

      where:{
        id,
      },

      include:{
        images:true,
      },

    });



  if (!promotion) {
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



  const published =
    formData.get("published") === "on";


  const featured =
    formData.get("featured") === "on";



  const images =
    JSON.parse(
      String(
        formData.get("images") ?? "[]"
      )
    ) as {
      url:string;
      publicId:string;
    }[];



  /*
    IMAGES SUPPRIMEES
  */

  const remainingUrls =
    images.map(
      image => image.url
    );



  const removedImages =
    promotion.images.filter(
      image =>
        !remainingUrls.includes(
          image.url
        )
    );



  for (const image of removedImages) {


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





  /*
    NOUVELLES IMAGES UNIQUEMENT
  */


  const existingUrls =
    promotion.images.map(
      image => image.url
    );



  const newImages =
    images.filter(
      image =>
        !existingUrls.includes(
          image.url
        )
    );





  let slug =
    createSlug(title);



  const sameSlug =
    await prisma.promotion.findFirst({

      where:{

        slug,

        NOT:{
          id,
        },

      },

    });



  if(sameSlug){

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
        ((oldPrice-price)
        /
        oldPrice)
        *100
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


      published,

      featured,



      coverImage:
        images.length > 0
          ? images[0].url
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


  revalidatePath("/");



  redirect(
    "/admin/promotions"
  );

}