"use server";

import { requireAdmin } from "@/lib/admin-auth";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";

export async function deleteDestination(
  formData: FormData
) {
  await requireAdmin();
  const id = Number(formData.get("id"));

  if (!Number.isInteger(id)) {
    return;
  }

  const destination = await prisma.destination.findUnique({
    where: {
      id,
    },

    include: {
      images: true,
    },
  });

  if (!destination) {
    return;
  }

  const files = destination.images.map(
    (image) => image.url
  );

  await prisma.destination.delete({
    where: {
      id,
    },
  });

  for (const url of files) {
    if (!url.startsWith("/uploads/")) {
      continue;
    }

    const relativePath = url.replace(/^\/+/, "");

    const physicalPath = path.join(
      process.cwd(),
      "public",
      relativePath
    );

    await unlink(physicalPath).catch(() => {});
  }

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
}