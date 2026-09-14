import Link from "next/link";

import {
  ArrowRight,
  Building2,
  MapPin,
  Star,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string; date?: string; travelers?: string }>;
}) {

  const { destination: destinationQuery = "" } = await searchParams;

  const allDestinations =
    await prisma.hotelDestination.findMany({

      where: {
        published: true,
      },

      include: {

        cities: {

          where: {
            published: true,
          },

          orderBy: [
            {
              sortOrder: "asc",
            },
            {
              name: "asc",
            },
          ],

          include: {

            hotels: {

              where: {
                published: true,
              },

              orderBy: [
                {
                  monthlyOffer: "desc",
                },
                {
                  createdAt: "desc",
                },
              ],

            },

          },

        },

      },

      orderBy: {
        name: "asc",
      },

    });


  const normalizedQuery = destinationQuery
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const destinations = normalizedQuery
    ? allDestinations
        .map((destination) => {
          const destinationText = destination.name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

          const cities = destination.cities
            .map((city) => {
              const cityText = city.name
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
              const hotels = city.hotels.filter((hotel) => {
                const hotelText = `${hotel.name} ${hotel.description}`
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase();
                return destinationText.includes(normalizedQuery) || cityText.includes(normalizedQuery) || hotelText.includes(normalizedQuery);
              });
              return { ...city, hotels };
            })
            .filter((city) => city.hotels.length > 0 || destinationText.includes(normalizedQuery) || city.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(normalizedQuery));

          return { ...destination, cities };
        })
        .filter((destination) => destination.cities.some((city) => city.hotels.length > 0))
    : allDestinations;

  const totalHotels =
    destinations.reduce(
      (destinationTotal, destination) => {

        return (
          destinationTotal +
          destination.cities.reduce(
            (cityTotal, city) =>
              cityTotal +
              city.hotels.length,
            0
          )
        );

      },
      0
    );


  return (
    

    <main className="all-hotels-page">


      {/* ==========================================
          HERO
      ========================================== */}

      <section className="all-hotels-hero">
        <div className="all-hotels-hero-background">
          <img loading="lazy" decoding="async"
            src="/images/hotels-hero.jpg"
            alt="Sélection d'hôtels"
          />
        </div>

        <div className="all-hotels-hero-overlay" />

        <div className="shell all-hotels-hero-content">
          <span className="all-hotels-hero-eyebrow">
            Nos hébergements
          </span>

          <h1>
            Trouvez votre hôtel idéal
          </h1>

          <p>
            Découvrez une sélection d'hôtels soigneusement choisis
            pour vos séjours en Algérie et à l'étranger.
          </p>
        </div>
      </section>



      {/* ==========================================
          CONTENU
      ========================================== */}

      <section className="all-hotels-content">

        <div className="shell">

          {destinationQuery && (
            <div className="public-search-result-note hotel-search-note">
              <span>Hôtels correspondant à</span>
              <strong>{destinationQuery}</strong>
              <Link href="/hotels">Effacer la recherche</Link>
            </div>
          )}

          {totalHotels === 0 ? (

            <div className="all-hotels-empty">

              <Building2 size={35} />

              <h2>
                Aucun hôtel disponible
              </h2>

              <p>
                Les établissements publiés
                depuis l&apos;administration
                apparaîtront automatiquement ici.
              </p>

            </div>

          ) : (

            destinations.map(
              (destination) => {

                const destinationHotelCount =
                  destination.cities.reduce(
                    (total, city) =>
                      total +
                      city.hotels.length,
                    0
                  );


                if (
                  destinationHotelCount === 0
                ) {
                  return null;
                }


                return (

                  <section
                    key={destination.id}
                    className="all-hotels-destination"
                  >


                    {/* ==============================
                        PAYS
                    ============================== */}

                    <div className="all-hotels-destination-head">

                      <div>

                        <span>
                          Destination
                        </span>

                        <h2>
                          {destination.name}
                        </h2>

                      </div>


                      <Link
                        href={`/hotels/${destination.slug}`}
                        className="all-hotels-destination-link"
                      >
                        Voir les villes

                        <ArrowRight
                          size={15}
                        />
                      </Link>

                    </div>



                    {/* ==============================
                        VILLES
                    ============================== */}

                    {destination.cities.map(
                      (city) => {

                        if (
                          city.hotels.length === 0
                        ) {
                          return null;
                        }


                        return (

                          <section
                            key={city.id}
                            className="all-hotels-city"
                          >


                            {/* TITRE VILLE */}

                            <div className="all-hotels-city-head">

                              <div>

                                <div className="all-hotels-city-location">

                                  <MapPin
                                    size={14}
                                  />

                                  {destination.name}

                                </div>

                                <h3>
                                  Hôtels à{" "}
                                  {city.name}
                                </h3>

                                <p>
                                  {city.hotels.length}
                                  {" "}
                                  établissement
                                  {city.hotels.length !== 1
                                    ? "s"
                                    : ""}
                                </p>

                              </div>


                              <Link
                                href={`/hotels/${destination.slug}/${city.slug}`}
                                className="all-hotels-city-link"
                              >
                                Voir tous les hôtels
                                de {city.name}

                                <ArrowRight
                                  size={14}
                                />
                              </Link>

                            </div>



                            {/* ==============================
                                HOTELS
                            ============================== */}

                            <div className="all-hotels-grid">

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
                                      className="all-hotel-card"
                                    >


                                      {/* PHOTO */}

                                      <div className="all-hotel-photo">

                                        {hotel.coverImage ? (

                                          <img loading="lazy" decoding="async"
                                            src={
                                              hotel.coverImage
                                            }
                                            alt={
                                              hotel.name
                                            }
                                          />

                                        ) : (

                                          <div className="all-hotel-no-photo">

                                            <Building2
                                              size={30}
                                            />

                                          </div>

                                        )}


                                        {discount && (

                                          <span className="all-hotel-discount">

                                            -{discount}%

                                          </span>

                                        )}


                                        {hotel.monthlyOffer && (

                                          <span className="all-hotel-offer">

                                            Offre du mois

                                          </span>

                                        )}

                                      </div>



                                      {/* INFORMATIONS */}

                                      <div className="all-hotel-content">

                                        <div className="all-hotel-location">

                                          <MapPin
                                            size={12}
                                          />

                                          {city.name}
                                          {" · "}
                                          {destination.name}

                                        </div>


                                        <h4>
                                          {hotel.name}
                                        </h4>


                                        <div className="all-hotel-stars">

                                          {Array.from({
                                            length:
                                              hotel.stars,
                                          }).map(
                                            (
                                              _,
                                              index
                                            ) => (

                                              <Star
                                                key={
                                                  index
                                                }
                                                size={
                                                  12
                                                }
                                                fill="currentColor"
                                              />

                                            )
                                          )}

                                        </div>


                                        <p className="all-hotel-description">

                                          {hotel.description}

                                        </p>



                                        {/* PRIX */}

                                        <div className="all-hotel-bottom">

                                          <div className="all-hotel-price">

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


                                          <Link
                                            href={`/hotels/${destination.slug}/${city.slug}`}
                                            className="all-hotel-button"
                                          >
                                            Voir

                                            <ArrowRight
                                              size={14}
                                            />
                                          </Link>

                                        </div>

                                      </div>

                                    </article>

                                  );

                                }
                              )}

                            </div>

                          </section>

                        );

                      }
                    )}

                  </section>

                );

              }
            )

          )}

        </div>

      </section>

    </main>
    

  );
}