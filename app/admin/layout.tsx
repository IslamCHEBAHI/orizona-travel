import AdminGlobalFrame from "@/components/admin/AdminGlobalFrame";
import { countFlightRequests } from "@/lib/ticketing-db";

export const dynamic = "force-dynamic";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const newTicketCount = await countFlightRequests(["NEW"]);

  return (
    <AdminGlobalFrame newTicketCount={newTicketCount}>
      {children}
    </AdminGlobalFrame>
  );
}
