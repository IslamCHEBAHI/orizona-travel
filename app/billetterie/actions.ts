"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  countRecentFlightRequestsByIpHash,
  createFlightRequestRecord,
  findFlightRequestByReference,
} from "@/lib/ticketing-db";
import {
  createSecureReference,
  hashClientIp,
  isValidEmail,
  isValidPhone,
  normalizeText,
} from "@/lib/security";

function positiveInt(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

export async function createFlightRequest(formData: FormData) {
  // Honeypot invisible pour bloquer une grande partie des robots basiques.
  if (normalizeText(formData.get("website"), 200)) {
    redirect("/billetterie?success=received");
  }

  const tripType = normalizeText(formData.get("tripType"), 20) === "ONE_WAY" ? "ONE_WAY" : "ROUND_TRIP";
  const origin = normalizeText(formData.get("origin"), 140);
  const destination = normalizeText(formData.get("destination"), 140);
  const departureDateValue = normalizeText(formData.get("departureDate"), 20);
  const returnDateValue = normalizeText(formData.get("returnDate"), 20);
  const cabinClass = normalizeText(formData.get("cabinClass"), 40) || "ECONOMY";
  const fullName = normalizeText(formData.get("fullName"), 100);
  const phone = normalizeText(formData.get("phone"), 30);
  const email = normalizeText(formData.get("email"), 160).toLowerCase();
  const baggage = normalizeText(formData.get("baggage"), 100);
  const notes = normalizeText(formData.get("notes"), 1500);
  const flexibleDates = formData.get("flexibleDates") === "on";

  const adults = Math.min(9, Math.max(1, positiveInt(formData.get("adults"), 1)));
  const children = Math.min(9, positiveInt(formData.get("children"), 0));
  const infants = Math.min(9, positiveInt(formData.get("infants"), 0));

  if (!origin || !destination || !departureDateValue || !fullName || !phone) {
    redirect("/billetterie?error=missing");
  }

  if (!isValidPhone(phone) || !isValidEmail(email)) {
    redirect("/billetterie?error=contact");
  }

  if (origin.toLowerCase() === destination.toLowerCase()) {
    redirect("/billetterie?error=route");
  }

  if (tripType === "ROUND_TRIP" && !returnDateValue) {
    redirect("/billetterie?error=return");
  }

  const departureDate = new Date(`${departureDateValue}T12:00:00`);
  const returnDate = returnDateValue ? new Date(`${returnDateValue}T12:00:00`) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (
    Number.isNaN(departureDate.getTime()) ||
    departureDate < today ||
    (returnDate && returnDate < departureDate)
  ) {
    redirect("/billetterie?error=dates");
  }

  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = h.get("x-real-ip")?.trim();
  const clientIp = forwardedFor || realIp || "unknown";
  const requestIpHash = hashClientIp(clientIp);

  // 5 demandes maximum par fenêtre de 15 minutes et par adresse IP hachée.
  const since = new Date(Date.now() - 15 * 60 * 1000);
  const recentCount = await countRecentFlightRequestsByIpHash(requestIpHash, since);
  if (recentCount >= 5) {
    redirect("/billetterie?error=rate");
  }

  let reference = createSecureReference();
  while (await findFlightRequestByReference(reference)) {
    reference = createSecureReference();
  }

  await createFlightRequestRecord({
    reference,
    tripType,
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    cabinClass,
    fullName,
    phone,
    email: email || null,
    flexibleDates,
    baggage: baggage || null,
    notes: notes || null,
    requestIpHash,
    userAgent: normalizeText(h.get("user-agent"), 300) || null,
  });

  redirect(`/billetterie?success=${encodeURIComponent(reference)}`);
}
