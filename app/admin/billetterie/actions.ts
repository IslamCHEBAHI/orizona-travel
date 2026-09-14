"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteFlightRequestRecord, updateFlightRequestRecord } from "@/lib/ticketing-db";

const allowedStatuses = new Set(["NEW", "IN_PROGRESS", "QUOTED", "CONFIRMED", "CLOSED", "CANCELLED"]);

export async function updateFlightRequest(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  const adminNotes = String(formData.get("adminNotes") ?? "").trim().slice(0, 4000);
  if (!Number.isInteger(id) || !allowedStatuses.has(status)) throw new Error("Demande invalide.");

  await updateFlightRequestRecord(id, status, adminNotes || null);

  revalidatePath("/admin");
  revalidatePath("/admin/billetterie");
  revalidatePath(`/admin/billetterie/${id}`);
}

export async function deleteFlightRequest(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Demande invalide.");
  await deleteFlightRequestRecord(id);
  revalidatePath("/admin");
  revalidatePath("/admin/billetterie");
}
