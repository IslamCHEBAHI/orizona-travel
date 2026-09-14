import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import AdminPhotoUpload from "@/components/admin/AdminPhotoUpload";

import { updateStay } from "./actions";


export default async function EditStayPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {

  const { id } = await params;

  const stayId = Number(id);

  if (!Number.isInteger(stayId)) {
    notFound();
  }


  const stay =
    await prisma.promotion.findUnique({

      where: {
        id: stayId,
      },

      include: {
        destination: true,
        images: true,
      },

    });


  if (!stay) {
    notFound();
  }


  const destinations =
    await prisma.destination.findMany({

      where: {
        published: true,
      },

      orderBy: {
        name: "asc",
      },

    });


  return (
    <main className="new-destination-page">

      <div className="new-destination-container">

        <div className="new-destination-header">

          <Link
            href="/admin/sejours"
            className="back-admin-link"
          >
            ← Retour aux séjours
          </Link>

          <span className="admin-small-title">
            MODIFICATION
          </span>

          <h1>
            Modifier le séjour
          </h1>

          <p>
            Modifiez les informations du séjour.
          </p>

        </div>


        <form
          action={updateStay}
          className="new-destination-form"
        >

          <input
            type="hidden"
            name="id"
            value={stay.id}
          />


          {/* 01 */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>01</span>

              <div>

                <h2>
                  Informations générales
                </h2>

                <p>
                  Titre, destination et présentation.
                </p>

              </div>

            </div>


            <label>

              <span>
                Titre *
              </span>

              <input
                type="text"
                name="title"
                defaultValue={stay.title}
                required
              />

            </label>


            <div className="admin-fields-grid">

              <label>

                <span>
                  Destination *
                </span>

                <select
                  name="destinationId"
                  defaultValue={
                    stay.destinationId ?? ""
                  }
                  required
                >

                  <option value="">
                    Sélectionner
                  </option>

                  {destinations.map(
                    (destination) => (

                      <option
                        key={destination.id}
                        value={destination.id}
                      >
                        {destination.name}
                        {" — "}
                        {destination.country}
                      </option>

                    )
                  )}

                </select>

              </label>


              <label>

                <span>
                  Durée
                </span>

                <input
                  type="text"
                  name="duration"
                  defaultValue={
                    stay.duration ?? ""
                  }
                />

              </label>

            </div>


            <label>

              <span>
                Description *
              </span>

              <textarea
                name="description"
                rows={8}
                defaultValue={
                  stay.description
                }
                required
              />

            </label>

          </section>


          {/* 02 */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>02</span>

              <div>

                <h2>
                  Dates et départ
                </h2>

              </div>

            </div>


            <div className="admin-fields-grid">

              <label>

                <span>
                  Ville de départ
                </span>

                <input
                  type="text"
                  name="departureCity"
                  defaultValue={
                    stay.departureCity ?? ""
                  }
                />

              </label>


              <label>

                <span>
                  Date de départ
                </span>

                <input
                  type="date"
                  name="departureDate"
                  defaultValue={
                    stay.departureDate
                      ? stay.departureDate
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                />

              </label>

            </div>


            <div className="admin-fields-grid">

              <label>

                <span>
                  Date de retour
                </span>

                <input
                  type="date"
                  name="returnDate"
                  defaultValue={
                    stay.returnDate
                      ? stay.returnDate
                          .toISOString()
                          .slice(0, 10)
                      : ""
                  }
                />

              </label>


              <label>

                <span>
                  Places disponibles
                </span>

                <input
                  type="number"
                  name="availableSeats"
                  min="0"
                  defaultValue={
                    stay.availableSeats ?? ""
                  }
                />

              </label>

            </div>

          </section>


          {/* 03 */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>03</span>

              <div>

                <h2>
                  Hébergement
                </h2>

              </div>

            </div>


            <div className="admin-fields-grid">

              <label>

                <span>
                  Hôtel
                </span>

                <input
                  type="text"
                  name="hotelName"
                  defaultValue={
                    stay.hotelName ?? ""
                  }
                />

              </label>


              <label>

                <span>
                  Étoiles
                </span>

                <select
                  name="hotelStars"
                  defaultValue={
                    stay.hotelStars ?? ""
                  }
                >

                  <option value="">
                    Non renseigné
                  </option>

                  <option value="1">
                    1 étoile
                  </option>

                  <option value="2">
                    2 étoiles
                  </option>

                  <option value="3">
                    3 étoiles
                  </option>

                  <option value="4">
                    4 étoiles
                  </option>

                  <option value="5">
                    5 étoiles
                  </option>

                </select>

              </label>

            </div>


            <label>

              <span>
                Formule
              </span>

              <select
                name="boardType"
                defaultValue={
                  stay.boardType ?? ""
                }
              >

                <option value="">
                  Sélectionner
                </option>

                <option value="Sans repas">
                  Sans repas
                </option>

                <option value="Petit-déjeuner">
                  Petit-déjeuner
                </option>

                <option value="Demi-pension">
                  Demi-pension
                </option>

                <option value="Pension complète">
                  Pension complète
                </option>

                <option value="Tout compris">
                  Tout compris
                </option>

              </select>

            </label>

          </section>


          {/* 04 */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>04</span>

              <div>

                <h2>
                  Transport
                </h2>

              </div>

            </div>


            <div className="admin-fields-grid">

              <label>

                <span>
                  Transport
                </span>

                <select
                  name="transport"
                  defaultValue={
                    stay.transport ?? ""
                  }
                >

                  <option value="">
                    Sélectionner
                  </option>

                  <option value="Vol aller-retour">
                    Vol aller-retour
                  </option>

                  <option value="Vol aller simple">
                    Vol aller simple
                  </option>

                  <option value="Bus">
                    Bus
                  </option>

                  <option value="Sans transport">
                    Sans transport
                  </option>

                </select>

              </label>


              <label>

                <span>
                  Bagage
                </span>

                <input
                  type="text"
                  name="baggage"
                  defaultValue={
                    stay.baggage ?? ""
                  }
                />

              </label>

            </div>

          </section>


          {/* 05 */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>05</span>

              <div>

                <h2>
                  Tarification
                </h2>

              </div>

            </div>


            <div className="admin-fields-grid">

              <label>

                <span>
                  Ancien prix
                </span>

                <input
                  type="number"
                  name="oldPrice"
                  min="0"
                  defaultValue={
                    stay.oldPrice ?? ""
                  }
                />

              </label>


              <label>

                <span>
                  Prix *
                </span>

                <input
                  type="number"
                  name="price"
                  min="1"
                  defaultValue={
                    stay.price
                  }
                  required
                />

              </label>

            </div>

          </section>


          {/* 06 */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>06</span>

              <div>

                <h2>
                  Prestations
                </h2>

              </div>

            </div>


            <label>

              <span>
                Programme
              </span>

              <textarea
                name="program"
                rows={8}
                defaultValue={
                  stay.program ?? ""
                }
              />

            </label>


            <label>

              <span>
                Inclus
              </span>

              <textarea
                name="included"
                rows={6}
                defaultValue={
                  stay.included ?? ""
                }
              />

            </label>


            <label>

              <span>
                Non inclus
              </span>

              <textarea
                name="excluded"
                rows={6}
                defaultValue={
                  stay.excluded ?? ""
                }
              />

            </label>

          </section>


          {/* 07 PHOTO ACTUELLE */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>07</span>

              <div>

                <h2>
                  Photos
                </h2>

                <p>
                  Ajoutez de nouvelles photos
                  si nécessaire.
                </p>

              </div>

            </div>


            {stay.coverImage && (

              <div className="admin-stay-current-cover">

                <img loading="lazy" decoding="async"
                  src={stay.coverImage}
                  alt={stay.title}
                />

                <span>
                  Photo principale actuelle
                </span>

              </div>

            )}


            <AdminPhotoUpload
              title="Ajouter de nouvelles photos"
            />

          </section>


          {/* PUBLICATION */}

          <section className="admin-publish-section">

            <div className="promotion-publish-options">

              <label className="publish-checkbox">

                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={
                    stay.published
                  }
                />

                <div>

                  <strong>
                    Publier
                  </strong>

                  <span>
                    Visible sur le site
                  </span>

                </div>

              </label>


              <label className="publish-checkbox">

                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={
                    stay.featured
                  }
                />

                <div>

                  <strong>
                    Mettre en avant
                  </strong>

                  <span>
                    Séjour recommandé
                  </span>

                </div>

              </label>

            </div>


            <button
              type="submit"
              className="publish-destination-btn"
            >
              Enregistrer les modifications
            </button>

          </section>

        </form>

      </div>

    </main>
  );
}