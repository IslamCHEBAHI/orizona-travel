import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadCloudinaryImage } from "@/lib/cloudinary";

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Non autorisé.",
        },
        {
          status: 401,
        }
      );
    }

    const { id } =
      await context.params;

    const hotelId =
      Number(id);

    if (
      !Number.isInteger(hotelId)
    ) {
      return NextResponse.json(
        {
          error: "Hôtel invalide.",
        },
        {
          status: 400,
        }
      );
    }

    const hotel =
      await prisma.hotel.findUnique({
        where: {
          id: hotelId,
        },

        include: {
          images: true,
        },
      });

    if (!hotel) {
      return NextResponse.json(
        {
          error: "Hôtel introuvable.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      hotel.images.length >= 8
    ) {
      return NextResponse.json(
        {
          error:
            "Cet hôtel possède déjà 8 photos.",
        },
        {
          status: 400,
        }
      );
    }

    const formData =
      await request.formData();

    const file =
      formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error:
            "Aucune image reçue.",
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

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          error:
            "JPEG, PNG ou WEBP uniquement.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size >
      4 * 1024 * 1024
    ) {
      return NextResponse.json(
        {
          error:
            "Maximum 4 Mo par photo.",
        },
        {
          status: 400,
        }
      );
    }

    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    const result =
      await uploadCloudinaryImage(
        buffer,
        "agence-voyage/hotels"
      );

    const image =
      await prisma.hotelImage.create({
        data: {
          hotelId,

          url:
            result.secure_url,

          publicId:
            result.public_id,

          sortOrder:
            hotel.images.length,
        },
      });

    if (!hotel.coverImage) {
      await prisma.hotel.update({
        where: {
          id: hotelId,
        },

        data: {
          coverImage:
            result.secure_url,
        },
      });
    }

    return NextResponse.json({
      success: true,
      image,
    });
  } catch (error) {
    console.error(
      "HOTEL IMAGE UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erreur lors de l'envoi de la photo.",
      },
      {
        status: 500,
      }
    );
  }
}