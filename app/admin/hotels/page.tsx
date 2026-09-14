import Link from "next/link";

import {
  Building2,
  Globe2,
  Images,
  MapPin,
  Plus,
} from "lucide-react";

import DeleteSubmitButton
  from "@/components/admin/DeleteSubmitButton";

import {
  deleteHotel,
} from "./actions";

import { prisma } from "@/lib/prisma";


export default async function AdminHotelsPage() {

  const hotelDestinations =
    await prisma.hotelDestination.findMany({

      include: {
        _count: {
          select: {
            cities: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

    });


  const hotels =
    await prisma.hotel.findMany({

      include: {

        hotelCity: {
          include: {
            hotelDestination: true,
          },
        },

      },

      orderBy: {
        createdAt: "desc",
      },

      take: 8,

    });


  return (

    <main className="admin-hotels-page">

      <div className="admin-hotels-container">


        {/* =====================================
            HEADER
        ===================================== */}

        <div className="admin-hotels-header">

          <div>

            <Link
              href="/admin"
              className="admin-destination-back"
            >
              ← Retour au tableau de bord
            </Link>


            <span className="admin-small-title">
              ADMINISTRATION
            </span>


            <h1>
              Hôtels
            </h1>


            <p>
              Gérez les pays, les villes et les
              établissements proposés sur votre site.
            </p>

          </div>


          <div className="admin-hotels-header-actions">

            <Link
              href="/admin/hotels/destinations/nouveau"
              className="admin-add-hotel-destination"
            >
              <Globe2 size={17} />

              Ajouter une destination
            </Link>


            <Link
              href="/admin/hotels/nouveau"
              className="admin-add-hotel"
            >
              <Plus size={17} />

              Ajouter un hôtel
            </Link>

          </div>

        </div>



        {/* =====================================
            DESTINATIONS HOTELIERES
        ===================================== */}

        <section className="admin-hotel-section">

          <div className="admin-hotel-section-title">

            <div className="admin-hotel-section-icon">
              <Globe2 size={20} />
            </div>


            <div>

              <span>
                DESTINATIONS
              </span>

              <h2>
                Pays et destinations
              </h2>

              <p>
                Gérez les villes disponibles
                dans chaque destination hôtelière.
              </p>

            </div>

          </div>



          {hotelDestinations.length === 0 ? (

            <div className="admin-hotel-empty">

              <div className="admin-hotel-empty-icon">
                <MapPin size={27} />
              </div>


              <h3>
                Aucune destination
              </h3>


              <p>
                Créez par exemple Algérie,
                Maroc ou Égypte.
              </p>


              <Link
                href="/admin/hotels/destinations/nouveau"
                className="admin-empty-action"
              >
                <Plus size={16} />

                Créer une destination
              </Link>

            </div>

          ) : (

            <div className="admin-hotel-destination-grid">

              {hotelDestinations.map(
                (destination) => (

                  <article
                    key={destination.id}
                    className="admin-hotel-destination-card"
                  >

                    <div className="admin-hotel-destination-image">

                      {destination.coverImage ? (

                        <img loading="lazy" decoding="async"
                          src={destination.coverImage}
                          alt={destination.name}
                        />

                      ) : (

                        <div className="admin-hotel-destination-no-photo">

                          <Images size={27} />

                          <span>
                            Aucune photo
                          </span>

                        </div>

                      )}


                      <span
                        className={
                          destination.published
                            ? "hotel-destination-status published"
                            : "hotel-destination-status draft"
                        }
                      >
                        {destination.published
                          ? "Publié"
                          : "Masqué"}
                      </span>


                      {destination.featuredHome && (

                        <span className="hotel-home-badge">
                          Accueil
                        </span>

                      )}

                    </div>



                    <div className="admin-hotel-destination-content">

                      <span className="admin-hotel-destination-label">
                        DESTINATION HÔTELIÈRE
                      </span>


                      <h3>
                        {destination.name}
                      </h3>


                      <p>
                        {destination.description ||
                          "Aucune description."}
                      </p>



                      <div className="admin-hotel-destination-footer">

                        <span>
                          <MapPin size={15} />

                          {destination._count.cities}{" "}
                          ville
                          {destination._count.cities !== 1
                            ? "s"
                            : ""}
                        </span>


                        <Link
                          href={`/admin/hotels/destinations/${destination.id}`}
                        >
                          Gérer les villes →
                        </Link>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>



        {/* =====================================
            HOTELS
        ===================================== */}

        <section className="admin-hotel-section">

          <div className="admin-hotel-section-title">

            <div className="admin-hotel-section-icon">
              <Building2 size={20} />
            </div>


            <div>

              <span>
                ÉTABLISSEMENTS
              </span>

              <h2>
                Hôtels enregistrés
              </h2>

              <p>
                Les établissements créés apparaîtront
                ici après la création des villes.
              </p>

            </div>

          </div>



          {hotels.length === 0 ? (

            <div className="admin-hotel-empty compact">

              <div className="admin-hotel-empty-icon">
                <Building2 size={27} />
              </div>


              <h3>
                Aucun hôtel pour le moment
              </h3>


              <p>
                Créez d'abord les villes,
                puis nous ajouterons les hôtels.
              </p>

            </div>

          ) : (

            <div className="admin-hotel-list">

              {hotels.map((hotel) => (

                <article
                  key={hotel.id}
                  className="admin-hotel-row"
                >

                  <div className="admin-hotel-row-image">

                    {hotel.coverImage ? (

                      <img loading="lazy" decoding="async"
                        src={hotel.coverImage}
                        alt={hotel.name}
                      />

                    ) : (

                      <Building2 size={24} />

                    )}

                  </div>


                  <div className="admin-hotel-row-main">

                    <span>
                      {hotel.hotelCity.name}
                      {" · "}
                      {hotel.hotelCity.hotelDestination.name}
                    </span>


                    <h3>
                      {hotel.name}
                    </h3>


                    <div className="admin-hotel-stars">
                      {"★".repeat(hotel.stars)}
                    </div>

                  </div>


                  <div className="admin-hotel-row-price">

                    <small>
                      À partir de
                    </small>


                    <strong>
                      {hotel.price.toLocaleString("fr-FR")} DA
                    </strong>


                    <span>
                      / nuit
                    </span>

                    <Link
                    href={`/admin/hotels/${hotel.id}/modifier`}
                    className="admin-hotel-edit-link"
                  >
                    Modifier →
                  </Link>
                  <form
                    action={deleteHotel}
                    className="admin-hotel-delete-form"
                  >

                    <input
                      type="hidden"
                      name="hotelId"
                      value={hotel.id}
                    />


                    <DeleteSubmitButton
                      label="Supprimer"
                      className="admin-delete-hotel-btn"
                      confirmMessage={`Supprimer définitivement l'hôtel "${hotel.name}" et toutes ses photos ?`}
                    />

                  </form>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>


      </div>

    </main>

  );
}