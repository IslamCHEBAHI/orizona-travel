import Link from "next/link";

import { notFound } from "next/navigation";

import {
  ArrowRight,
  Building2,
  MapPin,
  Star,
} from "lucide-react";

import { prisma } from "@/lib/prisma";


export default async function HotelCityPage({
  params,
}: {
  params: Promise<{
    destinationSlug: string;
    citySlug: string;
  }>;
}) {

  const {
    destinationSlug,
    citySlug,
  } = await params;


  const city =
    await prisma.hotelCity.findFirst({

      where: {

        slug:
          citySlug,

        published:
          true,

        hotelDestination: {

          slug:
            destinationSlug,

          published:
            true,

        },

      },


      include: {

        hotelDestination:
          true,


        hotels: {

          where: {
            published:
              true,
          },

          orderBy: [
            {
              monthlyOffer:
                "desc",
            },
            {
              createdAt:
                "desc",
            },
          ],

        },

      },

    });


  if (!city) {
    notFound();
  }


  return (

    <main className="public-hotels-city-page">


      {/* =====================================
          HERO
      ===================================== */}

      <section
        className="public-hotels-city-hero"
        style={
          city.coverImage
            ? {
                backgroundImage: `
                  linear-gradient(
                    90deg,
                    rgba(4, 24, 27, .80),
                    rgba(4, 24, 27, .30)
                  ),
                  url("${city.coverImage}")
                `,
              }
            : undefined
        }
      >

        <div className="shell">


          {/* BOUTON RETOUR PREMIUM */}

          <Link
            href={`/hotels/${city.hotelDestination.slug}`}
            className="public-back-link"
          >
            Retour aux villes
          </Link>


          <div className="public-hotels-city-hero-copy">

            <span>
              HÔTELS ·{" "}
              {city.hotelDestination.name.toUpperCase()}
            </span>


            <h1>
              Séjournez à
              <em>
                {" "}
                {city.name}
              </em>
            </h1>


            <p>
              {city.description ||
                `Découvrez notre sélection d'établissements à ${city.name}.`}
            </p>


            <div className="public-city-hotel-count">

              <Building2 size={16} />

              {city.hotels.length}{" "}
              hôtel
              {city.hotels.length !== 1
                ? "s"
                : ""}

            </div>

          </div>

        </div>

      </section>



      {/* =====================================
          LISTE HOTELS
      ===================================== */}

      <section className="public-hotels-list-section">

        <div className="shell">


          <div className="public-hotels-list-heading">

            <div>

              <span className="eyebrow">
                NOTRE SÉLECTION
              </span>


              <h2>
                Hôtels à {city.name}
              </h2>


              <p>
                Découvrez les établissements
                disponibles et trouvez celui
                qui correspond à votre séjour.
              </p>

            </div>


            <span className="public-hotels-result-count">
              {city.hotels.length} établissement
              {city.hotels.length !== 1
                ? "s"
                : ""}
            </span>

          </div>



          {city.hotels.length === 0 ? (

            <div className="public-city-empty">

              <Building2 size={30} />

              <h3>
                Aucun hôtel disponible
              </h3>

              <p>
                Les établissements de cette ville
                seront bientôt disponibles.
              </p>

            </div>

          ) : (

            <div className="public-hotel-row-list">


              {city.hotels.map(
                (hotel) => {

                  const discount =
                    hotel.oldPrice &&
                    hotel.oldPrice >
                      hotel.price

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

                    <article
                      key={hotel.id}
                      className="booking-hotel-card"
                    >


                      {/* ==========================
                          PHOTO
                      ========================== */}

                      <div className="booking-hotel-photo">

                        {hotel.coverImage ? (

                          <img loading="lazy" decoding="async"
                            src={hotel.coverImage}
                            alt={hotel.name}
                          />

                        ) : (

                          <div className="booking-hotel-placeholder">
                            <Building2 size={28} />
                          </div>

                        )}


                        {discount && (

                          <span className="booking-discount-badge">
                            -{discount}%
                          </span>

                        )}

                      </div>



                      {/* ==========================
                          INFORMATIONS
                      ========================== */}

                      <div className="booking-hotel-info">


                        <div className="booking-hotel-top">

                          <div>

                            <h2>
                              {hotel.name}
                            </h2>


                            <div className="booking-stars">

                              {Array.from({
                                length: hotel.stars,
                              }).map((_, index) => (

                                <Star
                                  key={index}
                                  size={13}
                                  fill="currentColor"
                                />

                              ))}

                            </div>

                          </div>

                        </div>



                        <div className="booking-location">

                          <MapPin size={13} />

                          <span>
                            {city.name}
                            {" · "}
                            {city.hotelDestination.name}
                          </span>

                        </div>



                        <p className="booking-hotel-description">
                          {hotel.description}
                        </p>



                        <div className="booking-hotel-tags">

                          {hotel.monthlyOffer && (

                            <span className="booking-offer-tag">
                              Offre du mois
                            </span>

                          )}


                          {hotel.oldPrice &&
                            hotel.oldPrice > hotel.price && (

                              <span>
                                Tarif promotionnel
                              </span>

                            )}

                        </div>

                      </div>



                      {/* ==========================
                          PRIX
                      ========================== */}

                      <aside className="booking-hotel-price-panel">


                        <div className="booking-hotel-price-copy">

                          <span>
                            À partir de
                          </span>


                          {hotel.oldPrice &&
                            hotel.oldPrice > hotel.price && (

                              <small>
                                {hotel.oldPrice.toLocaleString(
                                  "fr-FR"
                                )} DA
                              </small>

                            )}


                          <strong>
                            {hotel.price.toLocaleString(
                              "fr-FR"
                            )} DA
                          </strong>


                          <em>
                            par nuit
                          </em>

                        </div>



                        <Link
                          href={`/hotels/${city.hotelDestination.slug}/${city.slug}/${hotel.slug}`}
                          className="booking-hotel-button"
                        >
                          Voir l&apos;hôtel

                          <ArrowRight size={16} />
                        </Link>


                      </aside>

                    </article>

                  );

                }
              )}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}