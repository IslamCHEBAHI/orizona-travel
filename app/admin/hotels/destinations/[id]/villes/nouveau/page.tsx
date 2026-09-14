import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import SinglePhotoUpload
  from "@/components/admin/SinglePhotoUpload";

import { createHotelCity } from "./actions";


export default async function NewHotelCityPage({
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

    });


  if (!destination) {
    notFound();
  }


  return (

    <main className="new-destination-page">

      <div className="new-destination-container">


        <div className="new-destination-header">

          <Link
            href={`/admin/hotels/destinations/${destination.id}`}
            className="back-admin-link"
          >
            ← Retour à {destination.name}
          </Link>


          <span className="admin-small-title">
            DESTINATION HÔTELIÈRE
          </span>


          <h1>
            Ajouter une ville
          </h1>


          <p>
            Ajoutez une nouvelle ville à
            {` ${destination.name}`} avec sa
            propre photo de couverture.
          </p>

        </div>



        <form
          action={createHotelCity}
          className="new-destination-form"
        >

          <input
            type="hidden"
            name="hotelDestinationId"
            value={destination.id}
          />



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
                  Présentez la ville aux visiteurs.
                </p>

              </div>

            </div>


            <label>

              <span>
                Nom de la ville *
              </span>

              <input
                type="text"
                name="name"
                placeholder="Ex : Oran"
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
                placeholder="Découvrez notre sélection d'hôtels à Oran..."
              />

            </label>


            <label>

              <span>
                Ordre d'affichage
              </span>

              <input
                type="number"
                name="sortOrder"
                min="0"
                defaultValue="0"
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
                  Photo de la ville
                </h2>

                <p>
                  Choisissez une photo forte et
                  représentative de la destination.
                </p>

              </div>

            </div>


            <SinglePhotoUpload
              name="coverImage"
              title={`Ajouter une photo de ${destination.name}`}
            />

          </section>



          {/* =====================================
              PUBLICATION
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
                  Ville publiée
                </strong>

                <span>
                  Visible sur le site public.
                </span>

              </div>

            </label>


            <label className="hotel-option-card home">

              <input
                type="checkbox"
                name="featured"
              />


              <div>

                <strong>
                  Ville mise en avant
                </strong>

                <span>
                  Utilisable plus tard pour
                  mettre certaines villes en avant.
                </span>

              </div>

            </label>

          </section>



          <button
            type="submit"
            className="hotel-destination-submit"
          >
            Créer la ville
          </button>


        </form>

      </div>

    </main>

  );
}