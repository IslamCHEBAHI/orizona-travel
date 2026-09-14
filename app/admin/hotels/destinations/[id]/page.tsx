import Link from "next/link";
import { notFound } from "next/navigation";

import DeleteSubmitButton
  from "@/components/admin/DeleteSubmitButton";

import {
  deleteHotelCity,
} from "./actions";

import {
  Building2,
  Images,
  MapPin,
  Plus,
} from "lucide-react";

import { prisma } from "@/lib/prisma";


export default async function HotelDestinationAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const destinationId =
    Number(id);


  if (!Number.isInteger(destinationId)) {
    notFound();
  }


  const destination =
    await prisma.hotelDestination.findUnique({

      where: {
        id: destinationId,
      },

      include: {

        cities: {

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


  if (!destination) {
    notFound();
  }


  return (

    <main className="admin-hotel-cities-page">

      <div className="admin-hotel-cities-container">


        {/* =====================================
            HEADER
        ===================================== */}

        <header className="admin-hotel-cities-header">

          <div>

            <Link
              href="/admin/hotels"
              className="admin-destination-back"
            >
              ← Retour aux hôtels
            </Link>


            <span className="admin-small-title">
              DESTINATION HÔTELIÈRE
            </span>


            <h1>
              {destination.name}
            </h1>


            <p>
              Gérez les villes dans lesquelles
              votre agence propose des hôtels.
            </p>

          </div>


          <Link
            href={`/admin/hotels/destinations/${destination.id}/villes/nouveau`}
            className="admin-add-city-btn"
          >
            <Plus size={17} />

            Ajouter une ville
          </Link>

        </header>



        {/* =====================================
            VILLES
        ===================================== */}

        {destination.cities.length === 0 ? (

          <div className="admin-city-empty">

            <div>
              <MapPin size={30} />
            </div>


            <h2>
              Aucune ville dans {destination.name}
            </h2>


            <p>
              Ajoutez par exemple Alger,
              Oran, Annaba ou Constantine.
            </p>


            <Link
              href={`/admin/hotels/destinations/${destination.id}/villes/nouveau`}
            >
              <Plus size={16} />

              Ajouter la première ville
            </Link>

          </div>

        ) : (

          <div className="admin-city-grid">

            {destination.cities.map(
              (city) => (

                <article
                  key={city.id}
                  className="admin-city-card"
                >

                  <div className="admin-city-card-image">

                    {city.coverImage ? (

                      <img loading="lazy" decoding="async"
                        src={city.coverImage}
                        alt={city.name}
                      />

                    ) : (

                      <div className="admin-city-no-image">
                        <Images size={25} />
                      </div>

                    )}


                    <span
                      className={
                        city.published
                          ? "admin-city-status published"
                          : "admin-city-status draft"
                      }
                    >
                      {city.published
                        ? "Publiée"
                        : "Masquée"}
                    </span>

                  </div>



                  <div className="admin-city-card-content">

                    <span>
                      {destination.name}
                    </span>


                    <h2>
                      {city.name}
                    </h2>


                    <p>
                      {city.description ||
                        `Découvrez les hôtels disponibles à ${city.name}.`}
                    </p>



                    <div className="admin-city-card-bottom">

                      <div className="admin-city-hotel-count">

                        <Building2 size={15} />

                        {city._count.hotels}{" "}
                        hôtel
                        {city._count.hotels !== 1
                          ? "s"
                          : ""}

                      </div>


                      <div className="admin-city-actions">

                        <Link
                          href={`/admin/hotels/destinations/${destination.id}/villes/${city.id}/modifier`}
                          className="admin-delete-city-btn"
                        >
                          Modifier
                        </Link>

                        <form
                          action={deleteHotelCity}
                        >

                          <input
                            type="hidden"
                            name="cityId"
                            value={city.id}
                          />

                          <input
                            type="hidden"
                            name="destinationId"
                            value={destination.id}
                          />


                          <DeleteSubmitButton
                            label="Supprimer"
                            className="admin-delete-city-btn"
                            confirmMessage={
                              city._count.hotels > 0
                                ? `Attention : supprimer ${city.name} supprimera également ses ${city._count.hotels} hôtel(s) et leurs photos. Confirmer la suppression ?`
                                : `Supprimer définitivement la ville ${city.name} ?`
                            }
                          />

                        </form>

                      </div>

                    </div>

                  </div>

                </article>

              )
            )}

          </div>

        )}


      </div>

    </main>

  );
}