import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import AdminPhotoUpload from "@/components/admin/AdminPhotoUpload";

import {
  updatePromotion,
} from "./actions";



export default async function EditPromotionPage({
  params,
}: {
  params: Promise<{
    id:string;
  }>;
}) {


  const { id } =
    await params;


  const promotionId =
    Number(id);



  if(!Number.isInteger(promotionId)){

    notFound();

  }



  const promotion =
    await prisma.promotion.findUnique({

      where:{
        id:promotionId,
      },

      include:{

        destination:true,

        images:true,

      },

    });



  if(!promotion){

    notFound();

  }



  const destinations =
    await prisma.destination.findMany({

      where:{
        published:true,
      },

      orderBy:{
        name:"asc",
      },

    });




  return (

    <main className="new-destination-page">


      <div className="new-destination-container">



        <div className="new-destination-header">


          <Link
            href="/admin/promotions"
            className="back-admin-link"
          >
            ← Retour aux promotions
          </Link>



          <span className="admin-small-title">
            MODIFICATION
          </span>



          <h1>
            Modifier la promotion
          </h1>



          <p>
            Modifiez les informations,
            les prix et les photos de l'offre.
          </p>


        </div>





        <form

          action={updatePromotion}

          className="new-destination-form"

        >



          <input

            type="hidden"

            name="id"

            value={promotion.id}

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

              </div>


            </div>





            <label>

              <span>
                Titre *
              </span>


              <input

                type="text"

                name="title"

                defaultValue={
                  promotion.title
                }

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
                    promotion.destinationId ?? ""
                  }

                  required

                >


                  <option value="">
                    Sélectionner
                  </option>


                  {destinations.map(
                    destination => (

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
                    promotion.duration ?? ""
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
                  promotion.description
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

                  defaultValue={
                    promotion.oldPrice ?? ""
                  }

                />

              </label>





              <label>

                <span>
                  Nouveau prix *
                </span>


                <input

                  type="number"

                  name="price"

                  defaultValue={
                    promotion.price
                  }

                  required

                />

              </label>


            </div>


          </section>






          <section className="admin-form-section">


            <div className="admin-section-heading">

              <span>
                03
              </span>


              <div>

                <h2>
                  Dates promotion
                </h2>


              </div>


            </div>





            <div className="admin-fields-grid">


              <label>

                <span>
                  Date début
                </span>


                <input

                  type="date"

                  name="startDate"

                  defaultValue={
                    promotion.startDate
                    ?
                    promotion.startDate
                    .toISOString()
                    .slice(0,10)
                    :
                    ""
                  }

                />

              </label>





              <label>

                <span>
                  Date fin
                </span>


                <input

                  type="date"

                  name="endDate"

                  defaultValue={
                    promotion.endDate
                    ?
                    promotion.endDate
                    .toISOString()
                    .slice(0,10)
                    :
                    ""
                  }

                />


              </label>


            </div>


          </section>






          <section className="admin-form-section">


            <div className="admin-section-heading">

              <span>
                04
              </span>


              <div>

                <h2>
                  Photos
                </h2>


              </div>


            </div>




            <AdminPhotoUpload

              title="Ajouter des photos"

            />


          </section>






          <section className="admin-publish-section">


            <label className="publish-checkbox">


              <input

                type="checkbox"

                name="published"

                defaultChecked={
                  promotion.published
                }

              />


              <div>

                <strong>
                  Publier
                </strong>

              </div>


            </label>





            <label className="publish-checkbox">


              <input

                type="checkbox"

                name="featured"

                defaultChecked={
                  promotion.featured
                }

              />


              <div>

                <strong>
                  Afficher accueil
                </strong>

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



      </div>


    </main>

  );

}