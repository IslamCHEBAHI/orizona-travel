import type { Metadata } from "next";
import "./globals.css";
import PublicLayout from "@/components/PublicLayout";

export const metadata: Metadata = {
  title: "Orizona Travel — Agence de voyage",
  description: "Séjours, hôtels, destinations et billetterie aérienne.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body><PublicLayout>{children}</PublicLayout></body></html>;
}
