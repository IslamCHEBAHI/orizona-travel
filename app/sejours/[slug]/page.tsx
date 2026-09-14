import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import {
  Briefcase,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Plane,
  Star,
  Users,
  X,
} from "lucide-react";


export default async function StayDetailPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {

  const { slug } =
    await params;


  /* =====================================================
     RÉCUPÉRATION DU SÉJOUR
  ===================================================== */

  const stay =
    await prisma.promotion.findUnique({

      where: {
        slug,
      },

      include: {

        destination: true,

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },

      },

    });


  if (
    !stay ||
    !stay.published
  ) {
    notFound();
  }


  /* =====================================================
     GALERIE
  ===================================================== */

  const gallery = [

    ...(stay.coverImage
      ? [stay.coverImage]
      : []),

    ...stay.images
      .map((image) => image.url)
      .filter(
        (url) =>
          url !== stay.coverImage
      ),

  ];


  /* =====================================================
     DATES
  ===================================================== */

  const departureDate =
    stay.departureDate
      ? stay.departureDate.toLocaleDateString(
          "fr-FR",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        )
      : null;


  const returnDate =
    stay.returnDate
      ? stay.returnDate.toLocaleDateString(
          "fr-FR",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        )
      : null;


  /* =====================================================
     PRESTATIONS
  ===================================================== */

  const includedItems =
    stay.included
      ? stay.included
          .split("\n")
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean)
      : [];


  const excludedItems =
    stay.excluded
      ? stay.excluded
          .split("\n")
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean)
      : [];


  return (

    <main className="stay-detail-page">


      {/* =====================================
          RETOUR PREMIUM
      ===================================== */}

      <section className="stay-detail-topbar">

        <div className="shell">

          <Link
            href="/sejours"
            className="public-back-link"
          >
            Retour aux séjours
          </Link>

        </div>

      </section>



      {/* =====================================
          INTRODUCTION
      ===================================== */}

      <section className="stay-detail-intro">

        <div className="shell">


          <div>


            {stay.destination && (

              <span className="stay-detail-location">

                <MapPin size={14} />

                {stay.destination.name}

                {stay.destination.country
                  ? ` · ${stay.destination.country}`
                  : ""}

              </span>

            )}


            <h1>
              {stay.title}
            </h1>


            <div className="stay-detail-intro-meta">


              {stay.duration && (

                <span>

                  <Clock3 size={15} />

                  {stay.duration}

                </span>

              )}


              {stay.departureCity && (

                <span>

                  <Plane size={15} />

                  Départ de {stay.departureCity}

                </span>

              )}


              {stay.availableSeats !== null &&
                stay.availableSeats !== undefined && (

                  <span>

                    <Users size={15} />

                    {stay.availableSeats} places disponibles

                  </span>

                )}

            </div>

          </div>



          {/* PRIX INTRO */}

          <div className="stay-detail-intro-price">

            <span>
              À partir de
            </span>


            {stay.oldPrice &&
              stay.oldPrice >
                stay.price && (

                <small>

                  {stay.oldPrice.toLocaleString(
                    "fr-FR"
                  )}{" "}
                  DA

                </small>

              )}


            <strong>

              {stay.price.toLocaleString(
                "fr-FR"
              )}{" "}
              DA

            </strong>


            <em>
              par personne
            </em>

          </div>


        </div>

      </section>



      {/* =====================================
          GALERIE
      ===================================== */}

      <section className="stay-detail-gallery-section">

        <div className="shell">


          {gallery.length > 0 ? (

            <div className="stay-detail-gallery">


              {/* GRANDE PHOTO */}

              <div className="stay-detail-gallery-main">

                <img loading="lazy" decoding="async"
                  src={gallery[0]}
                  alt={stay.title}
                />

              </div>



              {/* PHOTOS SECONDAIRES */}

              <div className="stay-detail-gallery-side">

                {gallery
                  .slice(1, 5)
                  .map(
                    (
                      image,
                      index
                    ) => (

                      <div
                        key={`${image}-${index}`}
                        className="stay-detail-gallery-small"
                      >

                        <img loading="lazy" decoding="async"
                          src={image}
                          alt={`${stay.title} ${index + 2}`}
                        />

                      </div>

                    )
                  )}

              </div>


            </div>

          ) : (

            <div className="stay-detail-no-gallery">

              Photos prochainement disponibles

            </div>

          )}


        </div>

      </section>



      {/* =====================================
          CONTENU
      ===================================== */}

      <section className="stay-detail-content-section">

        <div className="stay-detail-content-layout">


          {/* =================================
              COLONNE GAUCHE
          ================================= */}

          <div className="stay-detail-main">



            {/* DESCRIPTION */}

            <section className="stay-detail-section">

              <span className="stay-detail-eyebrow">
                LE SÉJOUR
              </span>


              <h2>
                À propos de cette offre
              </h2>


              <p className="stay-detail-description">
                {stay.description}
              </p>

            </section>



            {/* =================================
                INFORMATIONS VOYAGE
            ================================= */}

            <section className="stay-detail-section">

              <span className="stay-detail-eyebrow">
                INFORMATIONS
              </span>


              <h2>
                Votre voyage
              </h2>


              <div className="stay-detail-info-grid">


                {departureDate && (

                  <article>

                    <CalendarDays size={20} />

                    <span>
                      Départ
                    </span>

                    <strong>
                      {departureDate}
                    </strong>

                  </article>

                )}


                {returnDate && (

                  <article>

                    <CalendarDays size={20} />

                    <span>
                      Retour
                    </span>

                    <strong>
                      {returnDate}
                    </strong>

                  </article>

                )}


                {stay.transport && (

                  <article>

                    <Plane size={20} />

                    <span>
                      Transport
                    </span>

                    <strong>
                      {stay.transport}
                    </strong>

                  </article>

                )}


                {stay.baggage && (

                  <article>

                    <Briefcase size={20} />

                    <span>
                      Bagage
                    </span>

                    <strong>
                      {stay.baggage}
                    </strong>

                  </article>

                )}


              </div>

            </section>



            {/* =================================
                HOTEL
            ================================= */}

            {stay.hotelName && (

              <section className="stay-detail-section">

                <span className="stay-detail-eyebrow">
                  HÉBERGEMENT
                </span>


                <h2>
                  Votre hôtel
                </h2>


                <div className="stay-detail-hotel-box">


                  <div>

                    <h3>
                      {stay.hotelName}
                    </h3>


                    {stay.hotelStars && (

                      <div className="stay-detail-stars">

                        {Array.from({
                          length:
                            stay.hotelStars,
                        }).map(
                          (
                            _,
                            index
                          ) => (

                            <Star
                              key={index}
                              size={15}
                              fill="currentColor"
                            />

                          )
                        )}

                      </div>

                    )}

                  </div>


                  {stay.boardType && (

                    <span>
                      {stay.boardType}
                    </span>

                  )}


                </div>

              </section>

            )}



            {/* =================================
                PROGRAMME
            ================================= */}

            {stay.program && (

              <section className="stay-detail-section">

                <span className="stay-detail-eyebrow">
                  PROGRAMME
                </span>


                <h2>
                  Programme du séjour
                </h2>


                <div className="stay-detail-program-text">

                  {stay.program}

                </div>

              </section>

            )}



            {/* =================================
                INCLUS / NON INCLUS
            ================================= */}

            {(includedItems.length > 0 ||
              excludedItems.length > 0) && (

              <section className="stay-detail-section">

                <span className="stay-detail-eyebrow">
                  PRESTATIONS
                </span>


                <h2>
                  Ce que comprend votre séjour
                </h2>


                <div className="stay-detail-included-grid">


                  {/* INCLUS */}

                  <div>

                    <h3>
                      Inclus
                    </h3>


                    {includedItems.map(
                      (
                        item,
                        index
                      ) => (

                        <p
                          key={`${item}-${index}`}
                        >

                          <Check size={16} />

                          {item}

                        </p>

                      )
                    )}

                  </div>



                  {/* NON INCLUS */}

                  <div className="not-included">

                    <h3>
                      Non inclus
                    </h3>


                    {excludedItems.map(
                      (
                        item,
                        index
                      ) => (

                        <p
                          key={`${item}-${index}`}
                        >

                          <X size={16} />

                          {item}

                        </p>

                      )
                    )}

                  </div>


                </div>

              </section>

            )}


          </div>



          {/* =================================
              CARTE RÉSERVATION
          ================================= */}

          <aside className="stay-detail-booking-card">


            {stay.featured && (

              <span className="stay-detail-booking-badge">

                Sélection agence

              </span>

            )}


            <p>
              À partir de
            </p>


            {stay.oldPrice &&
              stay.oldPrice >
                stay.price && (

                <small>

                  {stay.oldPrice.toLocaleString(
                    "fr-FR"
                  )}{" "}
                  DA

                </small>

              )}


            <div className="stay-detail-booking-price">

              <strong>

                {stay.price.toLocaleString(
                  "fr-FR"
                )}

              </strong>

              <span>
                DA
              </span>

            </div>


            <em>
              par personne
            </em>



            {/* RÉDUCTION */}

            {stay.discount &&
              stay.discount > 0 && (

                <div className="stay-detail-booking-saving">

                  Économisez {stay.discount}%

                </div>

              )}



            {/* RÉSUMÉ */}

            <div className="stay-detail-booking-summary">


              {stay.duration && (

                <span>

                  <Clock3 size={15} />

                  {stay.duration}

                </span>

              )}


              {stay.departureCity && (

                <span>

                  <Plane size={15} />

                  Départ {stay.departureCity}

                </span>

              )}


              {stay.availableSeats !== null &&
                stay.availableSeats !== undefined && (

                  <span>

                    <Users size={15} />

                    {stay.availableSeats} places

                  </span>

                )}


            </div>



            {/* WHATSAPP */}

            <a
              href={`https://wa.me/213777531895?text=${encodeURIComponent(
                `Bonjour, je souhaite avoir plus d'informations concernant le séjour : ${stay.title}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="stay-detail-booking-button"
            >

              Demander une réservation

            </a>


            <span className="stay-detail-booking-note">

              Notre équipe vous confirme
              les disponibilités et le tarif.

            </span>


          </aside>


        </div>

      </section>


    </main>

  );
}