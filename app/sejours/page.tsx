import Link from "next/link";
import { prisma } from "@/lib/prisma";

import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Plane,
  Star,
  Users,
} from "lucide-react";
export const dynamic = "force-dynamic";
export default async function SejoursPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string; date?: string; budget?: string; travelers?: string }>;
}) {
  const {
    destination: destinationQuery = "",
    date: dateQuery = "",
    budget: budgetQuery = "",
  } = await searchParams;
  const allStays =
    await prisma.promotion.findMany({
      where: {
        published: true,
      },

      include: {
        destination: true,
        images: true,
      },

      orderBy: [
        {
          featured: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

  const normalizedQuery = destinationQuery
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const stays = allStays.filter((stay) => {
    const searchable = [
      stay.title,
      stay.description,
      stay.destination?.name ?? "",
      stay.destination?.country ?? "",
      stay.hotelName ?? "",
      stay.departureCity ?? "",
    ]
      .join(" ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const destinationMatch = !normalizedQuery || searchable.includes(normalizedQuery);

    const stayDate = stay.departureDate
      ? stay.departureDate.toISOString().slice(0, 10)
      : "";
    const dateMatch = !dateQuery || stayDate === dateQuery;

    const budgetMatch =
      !budgetQuery ||
      (budgetQuery === "UNDER_100" && stay.price < 100000) ||
      (budgetQuery === "100_200" && stay.price >= 100000 && stay.price <= 200000) ||
      (budgetQuery === "OVER_200" && stay.price > 200000);

    return destinationMatch && dateMatch && budgetMatch;
  });

  return (
    <main className="public-stays-page">

      {/* =====================================
          HERO
      ===================================== */}

      <section className="public-stays-hero">

        <div className="public-stays-hero-overlay" />

        <div className="public-stays-hero-content">

          <span>
            SÉJOURS & ÉVASIONS
          </span>

          <h1>
            Votre prochain voyage
            <br />
            commence ici
          </h1>

          <p>
            Explorez une sélection de séjours conçus
            pour conjuguer confort, découverte et sérénité.
          </p>

        </div>

      </section>


      {/* =====================================
          INTRODUCTION
      ===================================== */}

      <section className="public-stays-intro">

        <div>

          <span className="public-stays-eyebrow">
            NOTRE SÉLECTION
          </span>

          <h2>
            Des expériences pensées
            pour chaque envie d&apos;ailleurs
          </h2>

        </div>

        <p>
          City breaks, circuits, séjours balnéaires
          et escapades : découvrez les offres préparées
          par notre agence avec hébergement, transport
          et prestations sélectionnées.
        </p>

      </section>


      {/* =====================================
          FILTRES VISUELS
      ===================================== */}

      <section className="public-stays-filter-section">
        <form className="stay-filter-pro" method="GET">
          <label className="stay-filter-field stay-filter-destination">
            <span>Destination</span>
            <div>
              <MapPin size={17} />
              <input
                type="text"
                name="destination"
                placeholder="Ville, pays ou hôtel"
                defaultValue={destinationQuery}
              />
            </div>
          </label>

          <label className="stay-filter-field">
            <span>Date de départ</span>
            <div>
              <CalendarDays size={17} />
              <input
                type="date"
                name="date"
                defaultValue={dateQuery}
              />
            </div>
          </label>

          <label className="stay-filter-field">
            <span>Budget / personne</span>
            <div>
              <select name="budget" defaultValue={budgetQuery}>
                <option value="">Tous les budgets</option>
                <option value="UNDER_100">Moins de 100 000 DA</option>
                <option value="100_200">100 000 – 200 000 DA</option>
                <option value="OVER_200">Plus de 200 000 DA</option>
              </select>
            </div>
          </label>

          <button type="submit" className="stay-filter-submit">
            Rechercher
            <ArrowRight size={17} />
          </button>
        </form>
      </section>


      {/* =====================================
          LISTE DES SÉJOURS
      ===================================== */}

      <section className="public-stays-section">

        {(destinationQuery || dateQuery || budgetQuery) && (
          <div className="public-search-result-note stay-search-summary">
            <span>Filtres actifs</span>
            {destinationQuery && <strong>{destinationQuery}</strong>}
            {dateQuery && <strong>{new Date(`${dateQuery}T00:00:00`).toLocaleDateString("fr-FR")}</strong>}
            {budgetQuery && (
              <strong>
                {budgetQuery === "UNDER_100"
                  ? "< 100 000 DA"
                  : budgetQuery === "100_200"
                    ? "100 000 – 200 000 DA"
                    : "> 200 000 DA"}
              </strong>
            )}
            <Link href="/sejours">Réinitialiser</Link>
          </div>
        )}

        {stays.length === 0 ? (

          <div className="public-stays-empty">

            <Plane size={38} />

            <h2>
              Aucun séjour disponible
            </h2>

            <p>
              Nos prochaines offres seront bientôt disponibles.
            </p>

          </div>

        ) : (

          <div className="public-stays-grid">

            {stays.map((stay) => (

              <article
                key={stay.id}
                className="public-stay-card"
              >

                {/* PHOTO */}

                <Link
                  href={`/sejours/${stay.slug}`}
                  className="public-stay-image"
                >

                  {stay.coverImage ? (

                    <img loading="lazy" decoding="async"
                      src={stay.coverImage}
                      alt={stay.title}
                    />

                  ) : (

                    <div className="public-stay-image-placeholder">
                      <Plane size={38} />
                    </div>

                  )}

                  <div className="public-stay-image-shade" />


                  {stay.featured && (

                    <span className="public-stay-featured">
                      Sélection agence
                    </span>

                  )}


                  {stay.discount &&
                    stay.discount > 0 && (

                      <span className="public-stay-discount">
                        -{stay.discount}%
                      </span>

                    )}


                  {stay.destination && (

                    <div className="public-stay-location">

                      <MapPin size={14} />

                      <span>
                        {stay.destination.name}
                      </span>

                    </div>

                  )}

                </Link>


                {/* CONTENU */}

                <div className="public-stay-card-content">

                  <div className="public-stay-meta">

                    {stay.duration && (

                      <span>

                        <CalendarDays size={15} />

                        {stay.duration}

                      </span>

                    )}


                    {stay.departureCity && (

                      <span>

                        <Plane size={15} />

                        Depuis {stay.departureCity}

                      </span>

                    )}

                  </div>


                  <Link
                    href={`/sejours/${stay.slug}`}
                    className="public-stay-title-link"
                  >

                    <h2>
                      {stay.title}
                    </h2>

                  </Link>


                  {/* HOTEL */}

                  {stay.hotelName && (

                    <div className="public-stay-hotel">

                      <span>
                        {stay.hotelName}
                      </span>

                      {stay.hotelStars &&
                        stay.hotelStars > 0 && (

                          <div className="public-stay-stars">

                            {Array.from({
                              length: stay.hotelStars,
                            }).map((_, index) => (

                              <Star
                                key={index}
                                size={13}
                                fill="currentColor"
                              />

                            ))}

                          </div>

                        )}

                    </div>

                  )}


                  {/* DESCRIPTION */}

                  <p className="public-stay-description">
                    {stay.description}
                  </p>


                  {/* INFOS */}

                  <div className="public-stay-info-row">

                    {stay.boardType && (

                      <span>
                        {stay.boardType}
                      </span>

                    )}


                    {stay.availableSeats !== null &&
                      stay.availableSeats !== undefined && (

                        <span>

                          <Users size={14} />

                          {stay.availableSeats} places

                        </span>

                      )}

                  </div>


                  {/* PRIX */}

                  <div className="public-stay-card-footer">

                    <div className="public-stay-price">

                      {stay.oldPrice &&
                        stay.oldPrice > stay.price && (

                          <span>
                            {stay.oldPrice.toLocaleString("fr-FR")} DA
                          </span>

                        )}


                      <div>

                        <strong>
                          {stay.price.toLocaleString("fr-FR")} DA
                        </strong>

                        <small>
                          / personne
                        </small>

                      </div>

                    </div>


                    <Link
                      href={`/sejours/${stay.slug}`}
                      className="public-stay-view"
                    >

                      Découvrir

                      <ArrowRight size={17} />

                    </Link>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}