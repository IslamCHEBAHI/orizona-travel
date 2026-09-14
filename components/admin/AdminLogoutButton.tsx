"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminLogoutButton() {
  return (
    <button className="logout" type="button" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
      <LogOut size={18} /> Déconnexion
    </button>
  );
}
