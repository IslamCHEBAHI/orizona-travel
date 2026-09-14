import Link from "next/link";
import { notFound } from "next/navigation";
import { Images } from "lucide-react";

import { prisma } from "@/lib/prisma";
import ExistingPhotoManager from "@/components/admin/ExistingPhotoManager";

import {
  updateDestination,
  setDestinationCover,
  deleteDestinationImage,
} from "./actions";


export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const destinationId = Number(id);


  if (!Number.isInteger(destinationId)) {
    notFound();
  }


  const destination =
    await prisma.destination.findUnique({

      where: {
        id: destinationId,
      },

      include: {

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },

      },

    });


  if (!destination) {
    notFound();
  }


  return (

    <main className="new-destination-page">

      <div className="new-destination-container">


        {/* =====================================
            HEADER
        ===================================== */}

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
            Modifier {destination.name}
          </h1>


          <p>
            Modifiez les informations,
            la visibilité et les photos
            de cette destination.
          </p>

        </div>



        {/* =====================================
            FORMULAIRE INFORMATIONS
        ===================================== */}

        <form
          action={updateDestination}
          className="new-destination-form"
        >


          <input
            type="hidden"
            name="id"
            value={destination.id}
          />



          {/* =====================================
              01 - INFORMATIONS
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
                  Modifiez les informations
                  affichées sur le site.
                </p>

              </div>

            </div>



            <div className="admin-fields-grid">


              {/* NOM */}

              <label>

                <span>
                  Nom de la destination *
                </span>

                <input
                  type="text"
                  name="name"
                  defaultValue={
                    destination.name
                  }
                  required
                />

              </label>



              {/* PAYS */}

              <label>

                <span>
                  Pays *
                </span>

                <input
                  type="text"
                  name="country"
                  defaultValue={
                    destination.country
                  }
                  required
                />

              </label>


            </div>



            {/* CATEGORIE */}

            <label>

              <span>
                Catégorie / expérience
              </span>

              <input
                type="text"
                name="tag"
                defaultValue={
                  destination.tag ?? ""
                }
                placeholder="Culture, plage, shopping..."
              />

            </label>



            {/* DESCRIPTION */}

            <label>

              <span>
                Description *
              </span>

              <textarea
                name="description"
                rows={9}
                defaultValue={
                  destination.description
                }
                required
              />

            </label>


          </section>



          {/* =====================================
              02 - PUBLICATION
          ===================================== */}

          <section className="admin-publish-section">


            <label className="publish-checkbox">

              <input
                type="checkbox"
                name="published"
                defaultChecked={
                  destination.published
                }
              />


              <div>

                <strong>
                  Destination publiée
                </strong>

                <span>
                  Décochez pour masquer cette
                  destination du site.
                </span>

              </div>

            </label>



            <button
              type="submit"
              className="publish-destination-btn"
            >
              Enregistrer les modifications
            </button>


          </section>


        </form>



        {/* =====================================
            03 - GESTION DES PHOTOS
            IMPORTANT :
            CETTE SECTION EST EN DEHORS DU FORM
        ===================================== */}

        <section
          className="
            admin-form-section
            existing-photo-management-section
          "
        >

          <div className="admin-section-heading">

            <span>
              03
            </span>


            <div>

              <h2>
                Galerie actuelle
              </h2>

              <p>
                Choisissez la photo principale
                ou supprimez individuellement
                une photo incorrecte.
              </p>

            </div>

          </div>



          {destination.images.length === 0 ? (

            <div className="edit-no-images">

              <Images size={30} />

              <p>
                Aucune photo enregistrée.
              </p>

            </div>

          ) : (

            <ExistingPhotoManager

              images={
                destination.images
              }

              coverImage={
                destination.coverImage
              }

              parentId={
                destination.id
              }

              parentFieldName="destinationId"

              setCoverAction={
                setDestinationCover
              }

              deletePhotoAction={
                deleteDestinationImage
              }

            />

          )}


        </section>


      </div>

    </main>

  );
}