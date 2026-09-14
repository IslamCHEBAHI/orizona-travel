import { prisma } from "@/lib/prisma";

export type FlightRequestRecord = Awaited<ReturnType<typeof prisma.flightRequest.findUnique>> extends infer T
  ? NonNullable<T>
  : never;

export async function findFlightRequestByReference(reference: string) {
  return prisma.flightRequest.findUnique({ where: { reference } });
}

export async function createFlightRequestRecord(input: {
  reference: string;
  tripType: string;
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate: Date | null;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
  fullName: string;
  phone: string;
  email: string | null;
  flexibleDates: boolean;
  baggage: string | null;
  notes: string | null;
  requestIpHash?: string | null;
  userAgent?: string | null;
}) {
  return prisma.flightRequest.create({
    data: {
      ...input,
      status: "NEW",
    },
  });
}

export async function listFlightRequests(status?: string, limit?: number) {
  return prisma.flightRequest.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getFlightRequest(id: number) {
  return prisma.flightRequest.findUnique({ where: { id } });
}

export async function countFlightRequests(statuses?: string[]) {
  return prisma.flightRequest.count({
    where:
      statuses && statuses.length > 0
        ? { status: { in: statuses } }
        : undefined,
  });
}

export async function countRecentFlightRequestsByIpHash(
  requestIpHash: string,
  since: Date
) {
  return prisma.flightRequest.count({
    where: {
      requestIpHash,
      createdAt: { gte: since },
    },
  });
}

export async function updateFlightRequestRecord(
  id: number,
  status: string,
  adminNotes: string | null
) {
  return prisma.flightRequest.update({
    where: { id },
    data: { status, adminNotes },
  });
}

export async function deleteFlightRequestRecord(id: number) {
  return prisma.flightRequest.delete({ where: { id } });
}
