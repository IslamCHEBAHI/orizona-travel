import {
  Check,
  Clock3,
  Phone,
  Plane,
  MapPin,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import TicketRequestForm from "@/components/TicketRequestForm";

const AIRLINES = [
  {
    code: "AH",
    name: "Air Algérie",
    logo: "/images/airlines/air-algerie.jpg",
  },
  {
    code: "TU",
    name: "Tunisair",
    logo: "/images/airlines/tunisia-air.png",
  },
  {
    code: "Et",
    name: "Etihad",
    logo: "/images/airlines/etihad.png",
  },
  {
    code: "CA",
    name: "Air Canada",
    logo: "/images/airlines/air-canada.png",
  },
  {
    code: "AF",
    name: "Air France",
    logo: "/images/airlines/Air_France.png",
  },
  {
    code: "Tr",
    name: "Transavia",
    logo: "/images/airlines/Transavia.png",
  },
  {
    code: "TK",
    name: "Turkish Airlines",
    logo: "/images/airlines/turkish-airlignes.png",
  },
  {
    code: "EK",
    name: "Emirates",
    logo: "/images/airlines/fly-emirate.png",
  },
  {
    code: "QR",
    name: "Qatar Airways",
    logo: "/images/airlines/quatar-airwayes.jfif",
  },
  {
    code: "SV",
    name: "Saudia",
    logo: "/images/airlines/saudia-airlignes.png",
  },
  {
    code: "BA",
    name: "British Airways",
    logo: "/images/airlines/british-airwayes.jfif",
  },
  {
    code: "AZ",
    name: "ITA Airways",
    logo: "/images/airlines/air-italia.png",
  },
] as const;

export default async function BilletteriePage({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    error?: string;
    origin?: string;
    destination?: string;
    departureDate?: string;
    returnDate?: string;
    adults?: string;
  }>;
}) {
  const {
    success,
    error,
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
  } = await searchParams;

  return (
    <main className="ticketing-page">
      <section className="ticketing-hero">
        <div className="ticketing-hero-glow" />
        <div className="shell ticketing-hero-inner">
          <div className="ticketing-hero-copy">
            <span className="ticketing-kicker">
              <Star size={14} /> Billetterie sur mesure
            </span>
            <h1>
              Votre prochain vol,
              <br />
              <em>sans perdre de temps.</em>
            </h1>
            <p>
              Décrivez votre voyage. Notre équipe compare les options disponibles
              auprès de ses outils professionnels et vous transmet une proposition
              claire avant toute réservation.
            </p>
            <div className="ticketing-hero-trust">
              <span><ShieldCheck size={17} /> Demande sans engagement</span>
              <span><Phone size={17} /> Conseiller dédié</span>
              <span><Clock3 size={17} /> Réponse personnalisée</span>
            </div>
          </div>

          <div className="ticketing-form-wrap" id="demande-billet">
            {success && (
              <div className="ticket-alert success">
                <Check size={22} />
                <div>
                  <strong>Demande bien reçue</strong>
                  <span>Votre référence : {success}. Conservez-la pour le suivi.</span>
                </div>
              </div>
            )}
            {error && (
              <div className="ticket-alert error">
                <strong>Vérifiez votre demande.</strong>
                <span>
                  {error === "return"
                    ? "La date de retour est obligatoire pour un aller-retour."
                    : error === "dates"
                      ? "Les dates saisies ne sont pas cohérentes."
                      : error === "contact"
                        ? "Vérifiez votre numéro de téléphone ou votre adresse e-mail."
                        : error === "route"
                          ? "Le départ et la destination doivent être différents."
                          : error === "rate"
                            ? "Trop de demandes ont été envoyées récemment. Réessayez dans quelques minutes."
                            : "Certains champs obligatoires sont manquants."}
                </span>
              </div>
            )}
            <TicketRequestForm
              initialOrigin={origin ?? ""}
              initialDestination={destination ?? ""}
              initialDepartureDate={departureDate ?? ""}
              initialReturnDate={returnDate ?? ""}
              initialAdults={adults ?? "1"}
            />
          </div>
        </div>
      </section>

      <section className="airline-marquee-section">
        <div className="shell airline-marquee-heading">
          <span>COMPAGNIES AÉRIENNES</span>
          <h2>Des itinéraires parmi les compagnies les plus demandées.</h2>
          <p>
            Notre équipe recherche la meilleure option disponible selon votre trajet,
            vos dates et vos préférences.
          </p>
        </div>

        <div className="airline-marquee" aria-label="Compagnies aériennes">
          <div className="airline-marquee-track">
            {[...AIRLINES, ...AIRLINES].map((airline, index) => (
              <div
                className="airline-logo-card"
                key={`${airline.code}-${index}`}
              >
                <img
                  src={airline.logo}
                  alt={airline.name}
                  className="airline-logo-image"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ticketing-how shell">
        <div className="ticketing-section-heading">
          <span>COMMENT ÇA MARCHE</span>
          <h2>Une demande simple, une réponse humaine.</h2>
          <p>
            Le site recueille votre besoin. L’agence recherche ensuite les options
            réellement disponibles avant de vous proposer un tarif.
          </p>
        </div>
        <div className="ticketing-steps">
          <article>
            <span>01</span>
            <MapPin size={24} />
            <h3>Vous décrivez le trajet</h3>
            <p>Destination, dates, voyageurs, classe et préférences.</p>
          </article>
          <article>
            <span>02</span>
            <Search size={24} />
            <h3>Nous recherchons</h3>
            <p>Notre conseiller compare les solutions adaptées à votre demande.</p>
          </article>
          <article>
            <span>03</span>
            <Plane size={24} />
            <h3>Vous choisissez</h3>
            <p>Vous recevez une proposition détaillée avant confirmation du billet.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
