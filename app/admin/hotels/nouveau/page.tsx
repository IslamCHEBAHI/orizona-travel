import Link from "next/link";

import { prisma } from "@/lib/prisma";

import AdminPhotoUpload from "@/components/admin/AdminPhotoUpload";

import { createHotel } from "./actions";


export default async function NewHotelPage() {

  const cities =
    await prisma.hotelCity.findMany({

      where: {
        published: true,
      },

      include: {
        hotelDestination: true,
      },

      orderBy: [
        {
          hotelDestination: {
            name: "asc",
          },
        },
        {
          name: "asc",
        },
      ],

    });


  return (

    <main className="new-destination-page">

      <div className="new-destination-container">


        <div className="new-destination-header">

          <Link
            href="/admin/hotels"
            className="back-admin-link"
          >
            ← Retour aux hôtels
          </Link>


          <span className="admin-small-title">
            ADMINISTRATION
          </span>


          <h1>
            Ajouter un hôtel
          </h1>


          <p>
            Créez un nouvel établissement,
            ajoutez ses photos, ses tarifs
            et sa ville.
          </p>

        </div>



        <form
          action={createHotel}
          className="new-destination-form"
        >

          {/* =====================================
              01 INFORMATIONS
          ===================================== */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>
                01
              </span>


              <div>

                <h2>
                  Informations générales
                </h2>

                <p>
                  Identité, localisation et
                  classement de l'hôtel.
                </p>

              </div>

            </div>



            <label>

              <span>
                Nom de l'hôtel *
              </span>

              <input
                type="text"
                name="name"
                placeholder="Ex : AZ Grand Oran"
                required
              />

            </label>



            <div className="admin-fields-grid">


              <label>

                <span>
                  Ville *
                </span>

                <select
                  name="hotelCityId"
                  required
                  defaultValue=""
                >

                  <option
                    value=""
                    disabled
                  >
                    Sélectionner une ville
                  </option>


                  {cities.map((city) => (

                    <option
                      key={city.id}
                      value={city.id}
                    >
                      {city.hotelDestination.name}
                      {" — "}
                      {city.name}
                    </option>

                  ))}

                </select>

              </label>



              <label>

                <span>
                  Classement *
                </span>

                <select
                  name="stars"
                  defaultValue="4"
                  required
                >

                  <option value="1">
                    ★ 1 étoile
                  </option>

                  <option value="2">
                    ★★ 2 étoiles
                  </option>

                  <option value="3">
                    ★★★ 3 étoiles
                  </option>

                  <option value="4">
                    ★★★★ 4 étoiles
                  </option>

                  <option value="5">
                    ★★★★★ 5 étoiles
                  </option>

                </select>

              </label>

            </div>



            <label>

              <span>
                Description *
              </span>

              <textarea
                name="description"
                rows={8}
                placeholder="Présentez l'hôtel, ses chambres, services, situation..."
                required
              />

            </label>

          </section>



          {/* =====================================
              02 TARIFS
          ===================================== */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>
                02
              </span>


              <div>

                <h2>
                  Tarifs
                </h2>

                <p>
                  Prix affichés par nuit.
                </p>

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
                  placeholder="Ex : 23000"
                />

              </label>



              <label>

                <span>
                  Prix actuel *
                </span>

                <input
                  type="number"
                  name="price"
                  min="1"
                  placeholder="Ex : 18900"
                  required
                />

              </label>

            </div>

          </section>



          {/* =====================================
              03 PHOTOS
          ===================================== */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>
                03
              </span>


              <div>

                <h2>
                  Galerie de l'hôtel
                </h2>

                <p>
                  Ajoutez jusqu'à 8 photos
                  et choisissez la photo principale.
                </p>

              </div>

            </div>


            <AdminPhotoUpload
              title="Ajouter les photos de l'hôtel"
            />

          </section>



          {/* =====================================
              04 PUBLICATION
          ===================================== */}

          <section className="hotel-destination-options">

            <label className="hotel-option-card">

              <input
                type="checkbox"
                name="published"
                defaultChecked
              />


              <div>

                <strong>
                  Hôtel publié
                </strong>

                <span>
                  Visible par les visiteurs.
                </span>

              </div>

            </label>



            <label className="hotel-option-card home">

              <input
                type="checkbox"
                name="monthlyOffer"
              />


              <div>

                <strong>
                  Offre hôtel du mois
                </strong>

                <span>
                  Peut apparaître parmi les
                  3 offres hôtels de l'accueil.
                </span>

              </div>

            </label>

          </section>



          <button
            type="submit"
            className="hotel-destination-submit"
          >
            Créer l'hôtel
          </button>

        </form>


      </div>

    </main>

  );
}