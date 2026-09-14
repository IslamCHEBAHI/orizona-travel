import Link from "next/link";
import AdminPhotoUpload from "@/components/admin/AdminPhotoUpload";
import { createDestination } from "./actions";

export default function NewDestinationPage() {
  return (
    <main className="new-destination-page">

      <div className="new-destination-container">

        <div className="new-destination-header">

          <Link
            href="/admin/destinations"
            className="back-admin-link"
          >
            ← Retour aux destinations
          </Link>

          <span className="admin-small-title">
            ADMINISTRATION
          </span>

          <h1>
            Ajouter une destination
          </h1>

          <p>
            Créez une nouvelle destination avec ses
            informations et sa galerie de photos.
          </p>

        </div>


        <form
          action={createDestination}
          className="new-destination-form"
        >

          {/* INFORMATIONS */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>01</span>

              <div>
                <h2>
                  Informations générales
                </h2>

                <p>
                  Informations qui apparaîtront
                  sur la page de la destination.
                </p>
              </div>

            </div>


            <div className="admin-fields-grid">

              <label>
                <span>
                  Nom de la destination *
                </span>

                <input
                  type="text"
                  name="name"
                  placeholder="Ex. Istanbul"
                  required
                />
              </label>


              <label>
                <span>
                  Pays *
                </span>

                <input
                  type="text"
                  name="country"
                  placeholder="Ex. Turquie"
                  required
                />
              </label>

            </div>


            <label>
              <span>
                Catégorie / expérience
              </span>

              <input
                type="text"
                name="tag"
                placeholder="Ex. Culture, shopping & découverte"
              />
            </label>


            <label>
              <span>
                Description *
              </span>

              <textarea
                name="description"
                rows={8}
                placeholder="Présentez la destination, ses principaux attraits, son ambiance..."
                required
              />
            </label>

          </section>


          {/* PHOTOS */}

          <section className="admin-form-section">

            <div className="admin-section-heading">

              <span>02</span>

              <div>
                <h2>
                  Galerie photos
                </h2>

                <p>
                  Sélectionnez plusieurs photos
                  de la destination.
                </p>
              </div>

            </div>

            <AdminPhotoUpload
              title="Ajouter les photos de la destination"
            />

          </section>


          {/* PUBLICATION */}

          <section className="admin-publish-section">

            <label className="publish-checkbox">

              <input
                type="checkbox"
                name="published"
                defaultChecked
              />

              <div>
                <strong>
                  Publier immédiatement
                </strong>

                <span>
                  La destination sera visible
                  sur le site.
                </span>
              </div>

            </label>


            <button
              type="submit"
              className="publish-destination-btn"
            >
              Publier la destination
            </button>

          </section>

        </form>

      </div>

    </main>
  );
}