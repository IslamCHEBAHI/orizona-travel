import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Mail,
  Plane,
  Search,
  Users,
} from "lucide-react";
import { countFlightRequests, listFlightRequests } from "@/lib/ticketing-db";
import AdminSidebar from "@/components/admin/AdminSidebar";

const statusLabel: Record<string, string> = {
  NEW: "Nouvelle",
  IN_PROGRESS: "En traitement",
  QUOTED: "Proposition envoyée",
  CONFIRMED: "Confirmée",
  CLOSED: "Clôturée",
  CANCELLED: "Annulée",
};

export default async function AdminTicketingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filterStatus = status && status !== "ALL" ? status : undefined;
  const requests = await listFlightRequests(filterStatus);
  const newCount = await countFlightRequests(["NEW"]);
  const activeCount = await countFlightRequests(["IN_PROGRESS", "QUOTED"]);
  const confirmedCount = await countFlightRequests(["CONFIRMED"]);
  const totalCount = await countFlightRequests();

  return (
    <main className="admin-shell admin-dashboard-v2 admin-ticket-shell-layout">
      <AdminSidebar newTicketCount={newCount} />

      <section className="admin-content admin-ticket-content-v2">
        <div className="admin-ticket-shell">
          <header className="admin-ticket-header admin-ticket-header-v2">
            <div>
              <span className="admin-ticket-kicker">BILLETTERIE · CENTRE DE DEMANDES</span>
              <h1>Demandes de vols</h1>
              <p>Consultez, qualifiez et suivez chaque demande envoyée depuis le moteur de billetterie du site.</p>
            </div>
            <div className="admin-header-actions">
              <Link href="/billetterie" target="_blank" className="admin-ghost-btn">
                Voir côté visiteur <ArrowRight size={16} />
              </Link>
            </div>
          </header>

          <section className="admin-ticket-stats admin-ticket-stats-v2">
            <article className="highlight"><span className="new"><Mail size={20} /></span><div><small>Nouvelles</small><strong>{newCount}</strong><em>À ouvrir</em></div></article>
            <article><span><Clock3 size={20} /></span><div><small>À traiter</small><strong>{activeCount}</strong><em>En cours / proposition</em></div></article>
            <article><span><Check size={20} /></span><div><small>Confirmées</small><strong>{confirmedCount}</strong><em>Dossiers validés</em></div></article>
            <article><span><Plane size={20} /></span><div><small>Total</small><strong>{totalCount}</strong><em>Toutes les demandes</em></div></article>
          </section>

          <div className="admin-ticket-toolbar">
            <div>
              <strong>File de traitement</strong>
              <span>{requests.length} demande{requests.length !== 1 ? "s" : ""} affichée{requests.length !== 1 ? "s" : ""}</span>
            </div>
            <nav className="admin-ticket-filters">
              {[["ALL", "Toutes"], ["NEW", "Nouvelles"], ["IN_PROGRESS", "En traitement"], ["QUOTED", "Propositions"], ["CONFIRMED", "Confirmées"]].map(([value, label]) => (
                <Link
                  key={value}
                  href={value === "ALL" ? "/admin/billetterie" : `/admin/billetterie?status=${value}`}
                  className={(status ?? "ALL") === value ? "active" : ""}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {requests.length === 0 ? (
            <div className="admin-ticket-empty admin-ticket-empty-v2">
              <span><Search size={28} /></span>
              <h2>Aucune demande</h2>
              <p>Aucune demande ne correspond à ce filtre pour le moment.</p>
            </div>
          ) : (
            <div className="admin-ticket-list admin-ticket-list-v2">
              <div className="admin-ticket-list-head">
                <span>Référence</span><span>Trajet & date</span><span>Client</span><span>Statut</span><span></span>
              </div>
              {requests.map((request) => {
                const passengers = request.adults + request.children + request.infants;
                return (
                  <Link href={`/admin/billetterie/${request.id}`} key={request.id} className="admin-ticket-row">
                    <div className="admin-ticket-ref"><span>{request.reference}</span><small>Reçue le {request.createdAt.toLocaleDateString("fr-FR")}</small></div>
                    <div className="admin-ticket-route">
                      <div><strong>{request.origin}</strong><Plane size={15} /><strong>{request.destination}</strong></div>
                      <small><CalendarDays size={13} /> {request.departureDate.toLocaleDateString("fr-FR")}{request.returnDate ? ` → ${request.returnDate.toLocaleDateString("fr-FR")}` : " · aller simple"}</small>
                    </div>
                    <div className="admin-ticket-client"><strong>{request.fullName}</strong><small><Users size={13} /> {passengers} voyageur{passengers > 1 ? "s" : ""}</small></div>
                    <div className={`admin-ticket-status status-${request.status.toLowerCase()}`}>{statusLabel[request.status] ?? request.status}</div>
                    <ArrowRight className="admin-ticket-open" size={18} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
