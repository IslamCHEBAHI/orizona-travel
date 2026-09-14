import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Mail,
  Phone,
  Plane,
  Users,
} from "lucide-react";
import { countFlightRequests, getFlightRequest } from "@/lib/ticketing-db";
import { updateFlightRequest } from "../actions";
import AdminSidebar from "@/components/admin/AdminSidebar";

const cabinLabel: Record<string, string> = {
  ECONOMY: "Économique",
  PREMIUM_ECONOMY: "Premium Economy",
  BUSINESS: "Affaires",
  FIRST: "Première",
};

export default async function FlightRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const requestId = Number(id);
  if (!Number.isInteger(requestId)) notFound();
  const request = await getFlightRequest(requestId);
  if (!request) notFound();

  const newCount = await countFlightRequests(["NEW"]);
  const passengers = request.adults + request.children + request.infants;
  const whatsappText = encodeURIComponent(`Bonjour ${request.fullName}, nous vous contactons au sujet de votre demande de billet ${request.reference} (${request.origin} → ${request.destination}).`);
  const phoneDigits = request.phone.replace(/[^0-9]/g, "");

  return (
    <main className="admin-shell admin-dashboard-v2 admin-ticket-shell-layout">
      <AdminSidebar newTicketCount={newCount} />

      <section className="admin-content admin-ticket-content-v2">
        <div className="admin-ticket-shell detail">
          <header className="admin-ticket-header compact admin-ticket-header-v2">
            <div>
              <Link href="/admin/billetterie" className="admin-premium-back"><ArrowLeft size={15} /> Toutes les demandes</Link>
              <span className="admin-ticket-kicker">DOSSIER · {request.reference}</span>
              <h1>{request.origin} <span>→</span> {request.destination}</h1>
              <p>Demande reçue le {request.createdAt.toLocaleString("fr-FR")}</p>
            </div>
            <div className="admin-ticket-contact-actions">
              <a href={`tel:${request.phone}`}><Phone size={16} /> Appeler</a>
              <a className="whatsapp" href={`https://wa.me/${phoneDigits}?text=${whatsappText}`} target="_blank" rel="noreferrer"><Phone size={16} /> WhatsApp</a>
            </div>
          </header>

          <div className="admin-ticket-detail-grid">
            <div className="admin-ticket-detail-main">
              <section className="admin-ticket-detail-card">
                <div className="admin-ticket-card-head"><Plane size={19} /><div><span>VOYAGE</span><h2>Itinéraire demandé</h2></div></div>
                <div className="admin-ticket-flightline"><div><small>Départ</small><strong>{request.origin}</strong></div><span><Plane size={18} /></span><div><small>Destination</small><strong>{request.destination}</strong></div></div>
                <div className="admin-ticket-info-grid">
                  <div><CalendarDays size={16} /><span>Date aller</span><strong>{request.departureDate.toLocaleDateString("fr-FR")}</strong></div>
                  <div><CalendarDays size={16} /><span>Date retour</span><strong>{request.returnDate?.toLocaleDateString("fr-FR") ?? "Aller simple"}</strong></div>
                  <div><Users size={16} /><span>Voyageurs</span><strong>{passengers} au total</strong><small>{request.adults} adulte(s), {request.children} enfant(s), {request.infants} bébé(s)</small></div>
                  <div><Check size={16} /><span>Classe</span><strong>{cabinLabel[request.cabinClass] ?? request.cabinClass}</strong></div>
                </div>
                {(request.flexibleDates || request.baggage) && <div className="admin-ticket-tags">{request.flexibleDates && <span>Dates flexibles</span>}{request.baggage && <span>{request.baggage}</span>}</div>}
              </section>

              <section className="admin-ticket-detail-card">
                <div className="admin-ticket-card-head"><Users size={19} /><div><span>CLIENT</span><h2>Coordonnées du demandeur</h2></div></div>
                <div className="admin-ticket-client-grid">
                  <div><Users size={16} /><span>Nom complet</span><strong>{request.fullName}</strong></div>
                  <div><Phone size={16} /><span>Téléphone</span><strong>{request.phone}</strong></div>
                  <div><Mail size={16} /><span>Email</span><strong>{request.email || "Non renseigné"}</strong></div>
                </div>
                {request.notes && <div className="admin-ticket-client-note"><span>Précisions du client</span><p>{request.notes}</p></div>}
              </section>
            </div>

            <aside className="admin-ticket-workflow">
              <div className="admin-ticket-card-head"><Clock3 size={19} /><div><span>SUIVI DU DOSSIER</span><h2>Traitement</h2></div></div>
              <form action={updateFlightRequest}>
                <input type="hidden" name="id" value={request.id} />
                <label><span>Statut</span><select name="status" defaultValue={request.status}><option value="NEW">Nouvelle</option><option value="IN_PROGRESS">En traitement</option><option value="QUOTED">Proposition envoyée</option><option value="CONFIRMED">Confirmée</option><option value="CLOSED">Clôturée</option><option value="CANCELLED">Annulée</option></select></label>
                <label><span>Notes internes</span><textarea name="adminNotes" rows={8} defaultValue={request.adminNotes ?? ""} placeholder="Compagnie consultée, tarif proposé, délai d'option, remarques..." /></label>
                <button type="submit" className="admin-primary-action">Enregistrer le suivi</button>
              </form>
              <p className="admin-ticket-workflow-note">Les notes internes ne sont jamais visibles par le visiteur.</p>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
