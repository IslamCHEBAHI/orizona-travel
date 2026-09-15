"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

import {
  deleteCloudinaryImage,
} from "@/lib/cloudinary";

import {
  redirect,
} from "next/navigation";

import {
  revalidatePath,
} from "next/cache";



function createSlug(text:string){

  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"");

}




export async function updatePromotion(
  formData:FormData
){

  await requireAdmin();



  const id =
    Number(
      formData.get("id")
    );


  if(!Number.isInteger(id)){

    throw new Error(
      "Promotion invalide."
    );

  }




  const current =
    await prisma.promotion.findUnique({

      where:{
        id,
      },

      include:{
        images:true,
      },

    });



  if(!current){

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



  const price =
    Number(
      formData.get("price")
    );



  const oldPrice =
    Number(
      formData.get("oldPrice")
    ) || null;



  const published =
    formData.get("published")
    === "on";



  const featured =
    formData.get("featured")
    === "on";



  const startDate =
    String(
      formData.get("startDate") ?? ""
    );



  const endDate =
    String(
      formData.get("endDate") ?? ""
    );





  const images =

    JSON.parse(

      String(
        formData.get("images") ?? "[]"
      )

    ) as {

      url:string;
      publicId:string;

    }[];





  const deletedImages =

    JSON.parse(

      String(
        formData.get("deletedImages") ?? "[]"
      )

    ) as string[];






  /*
    SUPPRESSION DES IMAGES
  */


  for(
    const publicId
    of deletedImages
  ){


    const image =
      current.images.find(
        item =>
          item.publicId === publicId
      );



    if(image){


      await prisma.promotionImage.delete({

        where:{
          id:image.id,
        },

      });



      await deleteCloudinaryImage(
        publicId
      ).catch(()=>{});


    }

  }







  /*
    AJOUT UNIQUEMENT DES NOUVELLES IMAGES
  */


  const existingUrls =
    current.images.map(
      image =>
        image.url
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







  let discount:number|null =
    null;



  if(
    oldPrice &&
    oldPrice > price
  ){

    discount =
      Math.round(
        (
          (oldPrice-price)
          /
          oldPrice
        )
        *
        100
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


      price,

      oldPrice,

      discount,



      published,

      featured,



      startDate:
        startDate
        ? new Date(
            `${startDate}T00:00:00`
          )
        : null,



      endDate:
        endDate
        ? new Date(
            `${endDate}T23:59:59`
          )
        : null,



      coverImage:

        String(
          formData.get("coverImage")
          ??
          ""
        )
        ||
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

                current.images.length
                +
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