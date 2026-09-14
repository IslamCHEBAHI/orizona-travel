import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminPhotoUpload from "@/components/admin/AdminPhotoUpload";
import { createPromotion } from "./actions";

export default async function NewPromotionPage() {

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


        {/* HEADER */}

        <div className="new-destination-header">

          <Link
            href="/admin/promotions"
            className="back-admin-link"
          >
            ← Retour aux promotions
          </Link>

          <span className="admin-small-title">
            ADMINISTRATION
          </span>

          <h1>
            Nouvelle promotion
          </h1>

          <p>
            Créez une offre promotionnelle et
            choisissez sa destination, ses prix,
            ses dates et ses photos.
          </p>

        </div>


        <form
          action={createPromotion}
          className="new-destination-form"
        >


          {/* 01 INFORMATIONS */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>01</span>

              <div>

                <h2>
                  Informations générales
                </h2>

                <p>
                  Présentation principale de
                  votre offre.
                </p>

              </div>

            </div>


            <label>

              <span>
                Titre de la promotion *
              </span>

              <input
                type="text"
                name="title"
                placeholder="Ex. Istanbul - Offre spéciale septembre"
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
                  required
                >

                  <option value="">
                    Sélectionner une destination
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
                  Durée du séjour
                </span>

                <input
                  type="text"
                  name="duration"
                  placeholder="Ex. 8 jours / 7 nuits"
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
                placeholder="Décrivez le contenu de l'offre, l'hôtel, les prestations incluses..."
                required
              />

            </label>

          </section>


          {/* 02 TARIFICATION */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>02</span>

              <div>

                <h2>
                  Tarification
                </h2>

                <p>
                  Indiquez le prix normal et
                  le nouveau prix promotionnel.
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
                  step="1"
                  placeholder="Ex. 145000"
                />

              </label>


              <label>

                <span>
                  Prix promotionnel *
                </span>

                <input
                  type="number"
                  name="price"
                  min="1"
                  step="1"
                  placeholder="Ex. 119000"
                  required
                />

              </label>


            </div>

            <p className="admin-price-note">
              Le pourcentage de réduction sera
              calculé automatiquement.
            </p>

          </section>


          {/* 03 DATES */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>03</span>

              <div>

                <h2>
                  Période de promotion
                </h2>

                <p>
                  Définissez éventuellement
                  une date de début et de fin.
                </p>

              </div>

            </div>


            <div className="admin-fields-grid">


              <label>

                <span>
                  Date de début
                </span>

                <input
                  type="date"
                  name="startDate"
                />

              </label>


              <label>

                <span>
                  Date de fin
                </span>

                <input
                  type="date"
                  name="endDate"
                />

              </label>


            </div>

          </section>


          {/* 04 PHOTOS */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>04</span>

              <div>

                <h2>
                  Galerie photos
                </h2>

                <p>
                  Ajoutez les photos de cette
                  offre promotionnelle.
                </p>

              </div>

            </div>


            <AdminPhotoUpload
              title="Ajouter les photos de la promotion"
            />


          </section>


          {/* PUBLICATION */}

          <section className="admin-publish-section">


            <div className="promotion-publish-options">


              <label className="publish-checkbox">

                <input
                  type="checkbox"
                  name="published"
                  defaultChecked
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
                  defaultChecked
                />

                <div>

                  <strong>
                    Afficher sur l'accueil
                  </strong>

                  <span>
                    Ajouter aux promotions du moment
                  </span>

                </div>

              </label>


            </div>


            <button
              type="submit"
              className="publish-destination-btn"
            >
              Publier la promotion
            </button>


          </section>


        </form>

      </div>

    </main>
  );
}