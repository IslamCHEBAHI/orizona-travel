import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { uploadCloudinaryImage } from "@/lib/cloudinary";


export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Aucun fichier reçu.",
        },
        {
          status: 400,
        }
      );
    }


    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];


    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Format image non autorisé.",
        },
        {
          status: 400,
        }
      );
    }


    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "Image trop volumineuse.",
        },
        {
          status: 400,
        }
      );
    }


    const buffer = Buffer.from(
      await file.arrayBuffer()
    );


    const result =
      await uploadCloudinaryImage(
        buffer,
        "agence-voyage/hotels"
      );


    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });


  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Upload impossible.",
      },
      {
        status: 500,
      }
    );
  }
}