"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminGlobalFrame({
  children,
  newTicketCount = 0,
}: {
  children: React.ReactNode;
  newTicketCount?: number;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="admin-global-layout">
      <div className="admin-global-sidebar-slot">
        <AdminSidebar newTicketCount={newTicketCount} />
      </div>
      <div className="admin-global-main">{children}</div>
    </div>
  );
}
