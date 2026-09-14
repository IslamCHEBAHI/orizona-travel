import Link from "next/link";

import {
  ArrowRight,
  Building2,
  MapPin,
  Star,
} from "lucide-react";

import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";


type HotelDetailPageProps = {
  params: Promise<{
    destinationSlug: string;
    citySlug: string;
    hotelSlug: string;
  }>;
};


export default async function HotelDetailPage({
  params,
}: HotelDetailPageProps) {

  const {
    destinationSlug,
    citySlug,
    hotelSlug,
  } = await params;


  /* =====================================================
     RÉCUPÉRATION DE L'HÔTEL
  ===================================================== */

  const hotel = await prisma.hotel.findFirst({

    where: {

      slug: hotelSlug,

      published: true,

      hotelCity: {

        slug: citySlug,

        published: true,

        hotelDestination: {

          slug: destinationSlug,

          published: true,

        },

      },

    },

    include: {

      images: {

        orderBy: {
          sortOrder: "asc",
        },

      },

      hotelCity: {

        include: {
          hotelDestination: true,
        },

      },

    },

  });


  if (!hotel) {
    notFound();
  }


  const city = hotel.hotelCity;

  const destination =
    hotel.hotelCity.hotelDestination;


  /* =====================================================
     GALERIE
  ===================================================== */

  const galleryImages = [

    ...(hotel.coverImage
      ? [hotel.coverImage]
      : []),

    ...hotel.images
      .map((image) => image.url)
      .filter(
        (url) =>
          url !== hotel.coverImage
      ),

  ];


  const visibleGallery =
    galleryImages.slice(0, 5);


  /* =====================================================
     RÉDUCTION
  ===================================================== */

  const discount =
    hotel.oldPrice &&
    hotel.oldPrice > hotel.price

      ? Math.round(
          (
            (
              hotel.oldPrice -
              hotel.price
            ) /
            hotel.oldPrice
          ) *
            100
        )

      : null;


  return (

    <main className="hotel-detail-page">


      {/* =================================================
          FIL D'ARIANE
      ================================================= */}

      <section className="hotel-detail-breadcrumb">

        <div className="shell">

          <Link
            href={`/hotels/${destination.slug}/${city.slug}`}
            className="public-back-link"
          >
            Retour aux hôtels de {city.name}
          </Link>


          <div className="hotel-detail-breadcrumb-path">

            <span>
              {destination.name}
            </span>

            <span>•</span>

            <span>
              {city.name}
            </span>

            <span>•</span>

            <strong>
              {hotel.name}
            </strong>

          </div>

        </div>

      </section>



      {/* =================================================
          INTRODUCTION
      ================================================= */}

      <section className="hotel-detail-intro">

        <div className="shell">

          <div className="hotel-detail-intro-main">


            <div className="hotel-detail-location">

              <MapPin size={14} />

              {city.name}
              {" · "}
              {destination.name}

            </div>


            <h1>
              {hotel.name}
            </h1>


            <div className="hotel-detail-meta">

              <div className="hotel-detail-stars">

                {Array.from({
                  length: hotel.stars,
                }).map((_, index) => (

                  <Star
                    key={index}
                    size={15}
                    fill="currentColor"
                  />

                ))}

              </div>


              {hotel.monthlyOffer && (

                <span className="hotel-detail-offer-badge">
                  Offre du mois
                </span>

              )}


              {discount && (

                <span className="hotel-detail-discount-badge">
                  -{discount}%
                </span>

              )}

            </div>

          </div>


          <div className="hotel-detail-intro-price">

            <span>
              À partir de
            </span>


            {hotel.oldPrice &&
              hotel.oldPrice >
                hotel.price && (

                <small>

                  {hotel.oldPrice.toLocaleString(
                    "fr-FR"
                  )}{" "}
                  DA

                </small>

              )}


            <strong>

              {hotel.price.toLocaleString(
                "fr-FR"
              )}{" "}
              DA

            </strong>


            <em>
              par nuit
            </em>

          </div>

        </div>

      </section>



      {/* =================================================
          GALERIE PREMIUM
      ================================================= */}

      <section className="hotel-detail-gallery-section">

        <div className="shell">


          {visibleGallery.length > 0 ? (

            <div
              className={`hotel-detail-gallery hotel-detail-gallery-${Math.min(
                visibleGallery.length,
                5
              )}`}
            >

              {visibleGallery.map(
                (image, index) => (

                  <div
                    key={`${image}-${index}`}
                    className={`hotel-detail-gallery-item hotel-detail-gallery-item-${index + 1}`}
                  >

                    <img loading="lazy" decoding="async"
                      src={image}
                      alt={`${hotel.name} - photo ${index + 1}`}
                    />


                    {index === 4 &&
                      galleryImages.length > 5 && (

                        <div className="hotel-detail-gallery-more">

                          <span>
                            +{
                              galleryImages.length -
                              5
                            }
                          </span>

                          <small>
                            photos
                          </small>

                        </div>

                      )}

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="hotel-detail-gallery-empty">

              <Building2 size={40} />

              <span>
                Photos bientôt disponibles
              </span>

            </div>

          )}

        </div>

      </section>



      {/* =================================================
          CONTENU PRINCIPAL
      ================================================= */}

      <section className="hotel-detail-content-section">

        <div className="shell hotel-detail-content-layout">


          {/* DESCRIPTION */}

          <div className="hotel-detail-content">

            <span className="hotel-detail-section-label">
              L&apos;établissement
            </span>


            <h2>
              Découvrez{" "}
              {hotel.name}
            </h2>


            <div className="hotel-detail-description">

              {hotel.description}

            </div>


            <div className="hotel-detail-place-card">

              <div className="hotel-detail-place-icon">

                <MapPin size={20} />

              </div>


              <div>

                <span>
                  Destination
                </span>

                <strong>
                  {city.name},{" "}
                  {destination.name}
                </strong>

              </div>

            </div>

          </div>



          {/* =============================================
              CARTE DE RÉSERVATION
          ============================================= */}

          <aside className="hotel-detail-booking-card">

            {hotel.monthlyOffer && (

              <div className="hotel-detail-booking-offer">

                Offre spéciale

              </div>

            )}


            <span className="hotel-detail-booking-label">

              Votre séjour à partir de

            </span>


            {hotel.oldPrice &&
              hotel.oldPrice >
                hotel.price && (

                <div className="hotel-detail-old-price">

                  {hotel.oldPrice.toLocaleString(
                    "fr-FR"
                  )}{" "}
                  DA

                </div>

              )}


            <div className="hotel-detail-current-price">

              {hotel.price.toLocaleString(
                "fr-FR"
              )}

              <span>
                DA
              </span>

            </div>


            <p>
              Prix indicatif par nuit.
              Contactez notre agence pour
              connaître les disponibilités
              et obtenir votre offre.
            </p>


            {discount && (

              <div className="hotel-detail-saving">

                Vous économisez{" "}

                <strong>

                  {(
                    hotel.oldPrice! -
                    hotel.price
                  ).toLocaleString(
                    "fr-FR"
                  )}{" "}
                  DA

                </strong>

              </div>

            )}


            <button
              type="button"
              className="hotel-detail-booking-button"
            >

              Demander une réservation

              <ArrowRight size={16} />

            </button>


            <small className="hotel-detail-booking-note">

              Notre équipe vous accompagne
              dans l&apos;organisation de votre
              séjour.

            </small>

          </aside>

        </div>

      </section>



      {/* =================================================
          RETOUR VILLE
      ================================================= */}

      <section className="hotel-detail-bottom">

        <div className="shell">

          <div>

            <span>
              Continuer votre recherche
            </span>

            <h2>
              Découvrez d&apos;autres hôtels
              à {city.name}
            </h2>

          </div>


          <Link
            href={`/hotels/${destination.slug}/${city.slug}`}
            className="hotel-detail-bottom-link"
          >

            Voir les hôtels

            <ArrowRight size={16} />

          </Link>

        </div>

      </section>


    </main>

  );
}