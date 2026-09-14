import Link from "next/link";

import SinglePhotoUpload from "@/components/admin/SinglePhotoUpload";

import { createHotelDestination } from "./actions";


export default function NewHotelDestinationPage() {

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
            Nouvelle destination hôtelière
          </h1>


          <p>
            Créez un pays ou une destination
            qui regroupera les hôtels proposés
            par votre agence.
          </p>

        </div>



        <form
          action={createHotelDestination}
          className="new-destination-form"
        >


          {/* =====================================
              INFORMATIONS
          ===================================== */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>
                01
              </span>


              <div>

                <h2>
                  Informations
                </h2>

                <p>
                  Nom et présentation de la
                  destination hôtelière.
                </p>

              </div>

            </div>


            <label>

              <span>
                Nom de la destination *
              </span>

              <input
                type="text"
                name="name"
                placeholder="Ex : Algérie"
                required
              />

            </label>


            <label>

              <span>
                Description
              </span>

              <textarea
                name="description"
                rows={6}
                placeholder="Découvrez notre sélection d'hôtels en Algérie..."
              />

            </label>

          </section>



          {/* =====================================
              PHOTO
          ===================================== */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>
                02
              </span>


              <div>

                <h2>
                  Photo de couverture
                </h2>

                <p>
                  Cette photo représentera
                  la destination sur le site.
                </p>

              </div>

            </div>


            <SinglePhotoUpload
              name="coverImage"
              title="Ajouter la photo de la destination"
            />

          </section>



          {/* =====================================
              AFFICHAGE
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
                  Destination publiée
                </strong>

                <span>
                  Visible pour les visiteurs
                  du site.
                </span>

              </div>

            </label>



            <label className="hotel-option-card home">

              <input
                type="checkbox"
                name="featuredHome"
              />


              <div>

                <strong>
                  Afficher sur l'accueil
                </strong>

                <span>
                  Cette destination pourra
                  faire partie des 3 destinations
                  présentées sur l'accueil.
                </span>

              </div>

            </label>

          </section>



          <button
            type="submit"
            className="hotel-destination-submit"
          >
            Créer la destination
          </button>


        </form>


      </div>

    </main>

  );
}