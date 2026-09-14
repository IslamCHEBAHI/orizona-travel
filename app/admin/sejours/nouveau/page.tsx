import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminPhotoUpload from "@/components/admin/AdminPhotoUpload";
import { createStay } from "./actions";

export default async function NewStayPage() {

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
            href="/admin/sejours"
            className="back-admin-link"
          >
            ← Retour aux séjours
          </Link>

          <span className="admin-small-title">
            ADMINISTRATION
          </span>

          <h1>
            Nouveau séjour
          </h1>

          <p>
            Créez une nouvelle offre de séjour
            avec hébergement, transport, dates,
            tarifs et prestations.
          </p>

        </div>


        <form
          action={createStay}
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
                  Présentation principale du séjour.
                </p>

              </div>

            </div>


            <label>

              <span>
                Titre du séjour *
              </span>

              <input
                type="text"
                name="title"
                placeholder="Ex. Istanbul en famille - 8 jours"
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
                  Durée
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
                placeholder="Décrivez le séjour, l'hôtel, les prestations et l'expérience proposée..."
                required
              />

            </label>

          </section>


          {/* 02 DATES ET DÉPART */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>02</span>

              <div>

                <h2>
                  Dates et départ
                </h2>

                <p>
                  Informations concernant le voyage.
                </p>

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
                  placeholder="Ex. Alger"
                />

              </label>


              <label>

                <span>
                  Date de départ
                </span>

                <input
                  type="date"
                  name="departureDate"
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
                  placeholder="Ex. 20"
                />

              </label>

            </div>

          </section>


          {/* 03 HÉBERGEMENT */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>03</span>

              <div>

                <h2>
                  Hébergement
                </h2>

                <p>
                  Hôtel et formule proposée.
                </p>

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
                  placeholder="Ex. Hilton Istanbul"
                />

              </label>


              <label>

                <span>
                  Catégorie de l'hôtel
                </span>

                <select name="hotelStars">

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

              <select name="boardType">

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


          {/* 04 TRANSPORT */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>04</span>

              <div>

                <h2>
                  Transport
                </h2>

                <p>
                  Informations liées au transport.
                </p>

              </div>

            </div>


            <div className="admin-fields-grid">

              <label>

                <span>
                  Transport
                </span>

                <select name="transport">

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
                  Bagage inclus
                </span>

                <input
                  type="text"
                  name="baggage"
                  placeholder="Ex. 23 kg + bagage cabine"
                />

              </label>

            </div>

          </section>


          {/* 05 TARIFICATION */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>05</span>

              <div>

                <h2>
                  Tarification
                </h2>

                <p>
                  Prix du séjour par personne.
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
                  Prix du séjour *
                </span>

                <input
                  type="number"
                  name="price"
                  min="1"
                  step="1"
                  placeholder="Ex. 129000"
                  required
                />

              </label>

            </div>

          </section>


          {/* 06 CONTENU */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>06</span>

              <div>

                <h2>
                  Prestations
                </h2>

                <p>
                  Détaillez le contenu du séjour.
                </p>

              </div>

            </div>


            <label>

              <span>
                Programme
              </span>

              <textarea
                name="program"
                rows={8}
                placeholder={`Jour 1 : arrivée et transfert
Jour 2 : visite de la ville
Jour 3 : excursion...`}
              />

            </label>


            <label>

              <span>
                Inclus dans le prix
              </span>

              <textarea
                name="included"
                rows={6}
                placeholder={`Vol aller-retour
7 nuits d'hôtel
Petit-déjeuner
Transfert aéroport`}
              />

            </label>


            <label>

              <span>
                Non inclus
              </span>

              <textarea
                name="excluded"
                rows={5}
                placeholder={`Assurance
Dépenses personnelles
Excursions facultatives`}
              />

            </label>

          </section>


          {/* 07 PHOTOS */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>07</span>

              <div>

                <h2>
                  Galerie photos
                </h2>

                <p>
                  Ajoutez jusqu'à 8 photos du séjour.
                </p>

              </div>

            </div>


            <AdminPhotoUpload
              title="Ajouter les photos du séjour"
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
              Publier le séjour
            </button>

          </section>

        </form>

      </div>

    </main>
  );
}