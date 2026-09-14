import Link from "next/link";
import {
  BarChart3,
  BedDouble,
  Globe2,
  Plane,
  Plus,
  Tag,
  CalendarDays,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { countFlightRequests, listFlightRequests } from "@/lib/ticketing-db";
import AdminSidebar from "@/components/admin/AdminSidebar";



export default async function AdminPage() {
  const [destinationCount, hotelCount, stayCount] = await Promise.all([
    prisma.destination.count({ where: { published: true } }),
    prisma.hotel.count({ where: { published: true } }),
    prisma.promotion.count({ where: { published: true } }),
  ]);
  const ticketCount = await countFlightRequests();
  const newTicketCount = await countFlightRequests(["NEW"]);
  const recentTickets = await listFlightRequests(undefined, 4);

  return (
    <main className="admin-shell admin-dashboard-v2">
      <AdminSidebar newTicketCount={newTicketCount} />

      <section className="admin-content">
        <header className="admin-dashboard-header">
          <div><span>Administration</span><h1>Pilotez votre agence</h1><p>Une vue claire sur votre catalogue et les nouvelles demandes clients.</p></div>
          <div className="admin-header-actions">
            <Link href="/admin/billetterie" className="admin-ghost-btn"><CalendarDays size={17} /> Demandes billets</Link>
            <Link href="/admin/sejours/nouveau" className="admin-main-btn"><Plus size={17} /> Ajouter un séjour</Link>
          </div>
        </header>

        <div className="stats-grid admin-stats-v2">
          <article><span><Globe2 /></span><div><small>Destinations publiées</small><strong>{destinationCount}</strong><em>Catalogue public</em></div></article>
          <article><span><BedDouble /></span><div><small>Hôtels publiés</small><strong>{hotelCount}</strong><em>Établissements actifs</em></div></article>
          <article><span><Plane /></span><div><small>Séjours actifs</small><strong>{stayCount}</strong><em>Offres visibles</em></div></article>
          <article className={newTicketCount > 0 ? "attention" : ""}><span><CalendarDays /></span><div><small>Demandes billetterie</small><strong>{ticketCount}</strong><em>{newTicketCount} nouvelle{newTicketCount > 1 ? "s" : ""}</em></div></article>
        </div>

        <div className="admin-panels">
          <article className="admin-card large admin-overview-card">
            <div className="admin-card-head"><div><small>Vue d'ensemble</small><h2>Activité de l'agence</h2></div><span className="admin-live-dot">Données actuelles</span></div>
            <div className="admin-overview-visual"><BarChart3 size={40} /><div><strong>{destinationCount + hotelCount + stayCount + ticketCount}</strong><span>éléments suivis dans votre back-office</span></div></div>
            <div className="admin-overview-links"><Link href="/admin/destinations">Destinations</Link><Link href="/admin/hotels">Hôtels</Link><Link href="/admin/sejours">Séjours</Link><Link href="/admin/billetterie">Billetterie</Link></div>
          </article>

          <article className="admin-card">
            <div className="admin-card-head"><div><small>Actions rapides</small><h2>Gérer le site</h2></div></div>
            <div className="quick-actions">
              <Link href="/admin/destinations/nouveau"><Globe2 />Ajouter une destination</Link>
              <Link href="/admin/hotels/nouveau"><BedDouble />Ajouter un hôtel</Link>
              <Link href="/admin/sejours/nouveau"><Plane />Nouveau séjour</Link>
              <Link href="/admin/promotions/nouveau"><Tag />Nouvelle promotion</Link>
            </div>
          </article>
        </div>

        <article className="admin-card admin-recent-ticket-card">
          <div className="admin-card-head"><div><small>Billetterie</small><h2>Dernières demandes de vols</h2></div><Link href="/admin/billetterie" className="admin-inline-link">Voir toutes</Link></div>
          {recentTickets.length === 0 ? <div className="admin-dashboard-empty">Aucune demande de billet pour le moment.</div> : (
            <div className="admin-dashboard-ticket-list">
              {recentTickets.map((request) => (
                <Link href={`/admin/billetterie/${request.id}`} key={request.id}>
                  <div><strong>{request.origin} → {request.destination}</strong><span>{request.fullName} · {request.reference}</span></div>
                  <small>{request.departureDate.toLocaleDateString("fr-FR")}</small>
                  <b className={`admin-mini-status status-${request.status.toLowerCase()}`}>{request.status === "NEW" ? "Nouvelle" : request.status === "IN_PROGRESS" ? "En traitement" : request.status === "QUOTED" ? "Proposition" : request.status === "CONFIRMED" ? "Confirmée" : request.status}</b>
                </Link>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
