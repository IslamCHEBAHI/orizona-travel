import Link from "next/link";
import { notFound } from "next/navigation";
import { Images } from "lucide-react";

import { prisma } from "@/lib/prisma";

import AdminPhotoUpload from "@/components/admin/AdminPhotoUpload";
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
            Modifiez les informations et
            ajoutez de nouvelles photos.
          </p>

        </div>



        <form
          action={updateDestination}
          className="new-destination-form"
        >


          <input
            type="hidden"
            name="id"
            value={destination.id}
          />



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
                  Informations affichées sur le site.
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
                  defaultValue={
                    destination.name
                  }
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
                  defaultValue={
                    destination.country
                  }
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
                defaultValue={
                  destination.tag ?? ""
                }
              />

            </label>




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





          <section className="admin-form-section">


            <div className="admin-section-heading">

              <span>
                02
              </span>


              <div>

                <h2>
                  Ajouter des photos
                </h2>

                <p>
                  Les nouvelles photos seront
                  ajoutées à la galerie.
                </p>

              </div>


            </div>



            <AdminPhotoUpload
              title="Ajouter de nouvelles photos"
            />


          </section>





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
                  Visible par les visiteurs.
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





        <section
          className="
          admin-form-section
          existing-photo-management-section
          "
        >



          <div className="admin-section-heading">


            <span>
              04
            </span>



            <div>

              <h2>
                Galerie actuelle
              </h2>


              <p>
                Gestion des photos existantes.
              </p>


            </div>


          </div>





          {destination.images.length === 0 ? (

            <div className="edit-no-images">

              <Images size={30}/>

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