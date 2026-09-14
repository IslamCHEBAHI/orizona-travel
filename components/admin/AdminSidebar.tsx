"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BedDouble,
  CalendarDays,
  Globe2,
  LayoutDashboard,
  Plane,
  Tag,
} from "lucide-react";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const menu = [
  [LayoutDashboard, "Tableau de bord", "/admin"],
  [Globe2, "Destinations", "/admin/destinations"],
  [Plane, "Séjours", "/admin/sejours"],
  [BedDouble, "Hôtels", "/admin/hotels"],
  [Tag, "Promotions", "/admin/promotions"],
  [CalendarDays, "Billetterie", "/admin/billetterie"],
] as const;

export default function AdminSidebar({ newTicketCount = 0 }: { newTicketCount?: number }) {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar admin-sidebar-pro">
      <Link href="/admin" className="admin-logo">
        ORIZONA
        <small>ADMIN</small>
      </Link>

      <nav>
        {menu.map(([Icon, label, href]) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={active ? "admin-nav-link active" : "admin-nav-link"}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === "Billetterie" && newTicketCount > 0 && (
                <b className="admin-nav-badge">{newTicketCount}</b>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <span>Espace sécurisé</span>
        <small>Gestion de l'agence</small>
      </div>

      <AdminLogoutButton />
    </aside>
  );
}
