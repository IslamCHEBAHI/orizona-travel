import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowRight,
  Building2,
  MapPin,
} from "lucide-react";

import { prisma } from "@/lib/prisma";


export default async function HotelDestinationPage({
  params,
}: {
  params: Promise<{
    destinationSlug: string;
  }>;
}) {

  const {
    destinationSlug,
  } = await params;


  const destination =
    await prisma.hotelDestination.findUnique({

      where: {
        slug: destinationSlug,
      },

      include: {

        cities: {

          where: {
            published: true,
          },

          include: {

            _count: {
              select: {
                hotels: true,
              },
            },

          },

          orderBy: [
            {
              sortOrder: "asc",
            },
            {
              createdAt: "desc",
            },
          ],

        },

      },

    });


  if (
    !destination ||
    !destination.published
  ) {
    notFound();
  }


  return (

    <main className="hotel-country-page">


      {/* =====================================
          HERO
      ===================================== */}

      <section
        className="hotel-country-hero"
        style={
          destination.coverImage
            ? {
                backgroundImage: `
                  linear-gradient(
                    90deg,
                    rgba(4, 25, 28, 0.82),
                    rgba(4, 25, 28, 0.35)
                  ),
                  url("${destination.coverImage}")
                `,
              }
            : undefined
        }
      >

        <div className="shell hotel-country-hero-inner">


          {/* BOUTON RETOUR PREMIUM */}

          <Link
            href="/hotels"
            className="public-back-link"
          >
            Toutes les destinations
          </Link>


          <div className="hotel-country-hero-content">

            <span>
              HÔTELS · {destination.name.toUpperCase()}
            </span>


            <h1>
              Séjournez à
              <em>
                {" "}
                {destination.name}
              </em>
            </h1>


            <p>
              {destination.description ||
                `Découvrez notre sélection de villes et d'hôtels à ${destination.name}.`}
            </p>


            <div className="hotel-country-hero-meta">

              <div>

                <MapPin size={17} />

                <strong>
                  {destination.cities.length}
                </strong>

                <span>
                  ville
                  {destination.cities.length !== 1
                    ? "s"
                    : ""}
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* =====================================
          VILLES
      ===================================== */}

      <section className="hotel-country-cities">

        <div className="shell">


          <div className="hotel-country-section-head">

            <div>

              <span className="eyebrow">
                OÙ SOUHAITEZ-VOUS SÉJOURNER ?
              </span>


              <h2>
                Explorez les villes
              </h2>


              <p>
                Choisissez votre ville et découvrez
                les établissements disponibles.
              </p>

            </div>


            <span className="hotel-country-count">
              {destination.cities.length} destination
              {destination.cities.length !== 1
                ? "s"
                : ""}
            </span>

          </div>



          {destination.cities.length === 0 ? (

            <div className="public-city-empty">

              <MapPin size={30} />

              <h3>
                Aucune ville disponible
              </h3>

              <p>
                Les villes proposées pour cette
                destination seront bientôt disponibles.
              </p>

            </div>

          ) : (

            <div className="public-city-grid">

              {destination.cities.map(
                (city, index) => (

                  <Link
                    key={city.id}
                    href={`/hotels/${destination.slug}/${city.slug}`}
                    className={
                      index === 0
                        ? "public-city-card public-city-card-featured"
                        : "public-city-card"
                    }
                  >


                    {/* PHOTO */}

                    {city.coverImage ? (

                      <img loading="lazy" decoding="async"
                        src={city.coverImage}
                        alt={city.name}
                      />

                    ) : (

                      <div className="public-city-placeholder">
                        <MapPin size={30} />
                      </div>

                    )}



                    {/* DEGRADE */}

                    <div className="public-city-overlay" />



                    {/* NUMERO */}

                    <span className="public-city-number">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>



                    {/* CONTENU */}

                    <div className="public-city-content">

                      <span className="public-city-country">
                        {destination.name}
                      </span>


                      <h2>
                        {city.name}
                      </h2>


                      {city.description && (

                        <p>
                          {city.description}
                        </p>

                      )}


                      <div className="public-city-footer">

                        <div>

                          <Building2 size={15} />

                          <span>
                            {city._count.hotels}{" "}
                            hôtel
                            {city._count.hotels !== 1
                              ? "s"
                              : ""}
                          </span>

                        </div>


                        <span className="public-city-arrow">
                          <ArrowRight size={18} />
                        </span>

                      </div>

                    </div>

                  </Link>

                )
              )}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}