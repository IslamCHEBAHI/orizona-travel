import Link from "next/link";
import { Menu, PlaneTakeoff } from "lucide-react";

const links = [
  ["Accueil", "/"],
  ["Destinations", "/destinations"],
  ["Séjours", "/sejours"],
  ["Hôtels", "/hotels"],
  ["Billetterie", "/billetterie"],
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="Accueil">
          <span className="brand-mark"><PlaneTakeoff size={20} /></span>
          <span>ORIZON<span className="brand-accent">A</span></span>
        </Link>
        <nav className="desktop-nav">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <button className="menu-button" aria-label="Menu"><Menu /></button>
        </div>
      </div>
    </header>
  );
}
