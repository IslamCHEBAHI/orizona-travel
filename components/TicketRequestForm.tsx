"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import { createFlightRequest } from "@/app/billetterie/actions";
import AirportAutocomplete from "@/components/AirportAutocomplete";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="ticket-submit" type="submit" disabled={pending}>
      <span>{pending ? "Envoi en cours..." : "Envoyer ma demande"}</span>
      {!pending && <ArrowRight size={18} />}
    </button>
  );
}

export default function TicketRequestForm({
  initialOrigin = "",
  initialDestination = "",
  initialDepartureDate = "",
  initialReturnDate = "",
  initialAdults = "1",
}: {
  initialOrigin?: string;
  initialDestination?: string;
  initialDepartureDate?: string;
  initialReturnDate?: string;
  initialAdults?: string;
}) {
  const [tripType, setTripType] = useState<"ROUND_TRIP" | "ONE_WAY">(initialReturnDate ? "ROUND_TRIP" : "ROUND_TRIP");

  return (
    <form action={createFlightRequest} className="ticket-request-form">
      <div className="ticket-honeypot" aria-hidden="true">
        <label>Votre site web<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="ticket-trip-tabs" role="group" aria-label="Type de voyage">
        <label className={tripType === "ROUND_TRIP" ? "active" : ""}>
          <input
            type="radio"
            name="tripType"
            value="ROUND_TRIP"
            checked={tripType === "ROUND_TRIP"}
            onChange={() => setTripType("ROUND_TRIP")}
          />
          Aller-retour
        </label>
        <label className={tripType === "ONE_WAY" ? "active" : ""}>
          <input
            type="radio"
            name="tripType"
            value="ONE_WAY"
            checked={tripType === "ONE_WAY"}
            onChange={() => setTripType("ONE_WAY")}
          />
          Aller simple
        </label>
      </div>

      <div className="ticket-form-section">
        <div className="ticket-section-title">
          <span>01</span>
          <div><strong>Votre itinéraire</strong><small>Indiquez le trajet souhaité.</small></div>
        </div>

        <div className="ticket-route-grid">
          <AirportAutocomplete
            name="origin"
            label="Départ"
            placeholder="Tapez ALG, Alger, Houari Boumediene..."
            icon="plane"
            required
            initialValue={initialOrigin}
          />
          <AirportAutocomplete
            name="destination"
            label="Destination"
            placeholder="Tapez CDG, Paris, Istanbul, Dubaï..."
            icon="pin"
            required
            initialValue={initialDestination}
          />
          <label className="ticket-field">
            <span><CalendarDays size={15} /> Date aller</span>
            <input name="departureDate" type="date" defaultValue={initialDepartureDate} required />
          </label>
          <label className={`ticket-field ${tripType === "ONE_WAY" ? "disabled" : ""}`}>
            <span><CalendarDays size={15} /> Date retour</span>
            <input name="returnDate" type="date" defaultValue={initialReturnDate} disabled={tripType === "ONE_WAY"} required={tripType === "ROUND_TRIP"} />
          </label>
        </div>

        <label className="ticket-check-line">
          <input name="flexibleDates" type="checkbox" />
          <span>Mes dates sont flexibles</span>
        </label>
      </div>

      <div className="ticket-form-section">
        <div className="ticket-section-title">
          <span>02</span>
          <div><strong>Voyageurs & confort</strong><small>Précisez les passagers et la classe.</small></div>
        </div>

        <div className="ticket-passengers-grid">
          <label className="ticket-field"><span><Users size={15} /> Adultes</span><input name="adults" type="number" min="1" defaultValue={initialAdults} required /></label>
          <label className="ticket-field"><span>Enfants</span><input name="children" type="number" min="0" defaultValue="0" /></label>
          <label className="ticket-field"><span>Bébés</span><input name="infants" type="number" min="0" defaultValue="0" /></label>
          <label className="ticket-field">
            <span>Classe</span>
            <select name="cabinClass" defaultValue="ECONOMY">
              <option value="ECONOMY">Économique</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Affaires</option>
              <option value="FIRST">Première</option>
            </select>
          </label>
          <label className="ticket-field ticket-field-wide">
            <span>Bagage souhaité</span>
            <select name="baggage" defaultValue="">
              <option value="">Pas de préférence</option>
              <option value="Cabine uniquement">Cabine uniquement</option>
              <option value="20-23 kg en soute">20–23 kg en soute</option>
              <option value="30-32 kg en soute">30–32 kg en soute</option>
            </select>
          </label>
        </div>
      </div>

      <div className="ticket-form-section">
        <div className="ticket-section-title">
          <span>03</span>
          <div><strong>Vos coordonnées</strong><small>Notre conseiller vous contactera avec les meilleures options.</small></div>
        </div>

        <div className="ticket-contact-grid">
          <label className="ticket-field"><span><Users size={15} /> Nom complet</span><input name="fullName" maxLength={100} placeholder="Nom et prénom" required /></label>
          <label className="ticket-field"><span><Phone size={15} /> Téléphone</span><input name="phone" type="tel" maxLength={30} placeholder="+213 ..." required /></label>
          <label className="ticket-field ticket-field-wide"><span><Mail size={15} /> Email (facultatif)</span><input name="email" type="email" maxLength={160} placeholder="vous@email.com" /></label>
          <label className="ticket-field ticket-field-wide ticket-textarea"><span><Mail size={15} /> Précisions</span><textarea name="notes" maxLength={1500} rows={4} placeholder="Horaires préférés, escales à éviter, compagnie souhaitée, besoins particuliers..." /></label>
        </div>
      </div>

      <div className="ticket-form-footer">
        <div className="ticket-form-assurance"><Check size={17} /><span>Aucun paiement en ligne. Votre demande est vérifiée par un conseiller avant toute réservation.</span></div>
        <SubmitButton />
      </div>
    </form>
  );
}
