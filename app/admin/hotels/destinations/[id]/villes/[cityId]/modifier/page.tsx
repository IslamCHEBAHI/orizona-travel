import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import SinglePhotoUpload
  from "@/components/admin/SinglePhotoUpload";

import {
  updateHotelCity,
} from "./actions";


export default async function EditHotelCityPage({
  params,
}: {
  params: Promise<{
    id: string;
    cityId: string;
  }>;
}) {
  const {
    id,
    cityId,
  } = await params;

  const destinationId =
    Number(id);

  const hotelCityId =
    Number(cityId);

  if (
    !Number.isInteger(destinationId) ||
    !Number.isInteger(hotelCityId)
  ) {
    notFound();
  }

  const city =
    await prisma.hotelCity.findFirst({
      where: {
        id: hotelCityId,
        hotelDestinationId:
          destinationId,
      },

      include: {
        hotelDestination: true,
      },
    });

  if (!city) {
    notFound();
  }

  return (
    <main className="new-destination-page">

      <div className="new-destination-container">

        <div className="new-destination-header">

          <Link
            href={`/admin/hotels/destinations/${destinationId}`}
            className="back-admin-link"
          >
            ← Retour à {city.hotelDestination.name}
          </Link>

          <span className="admin-small-title">
            MODIFICATION
          </span>

          <h1>
            Modifier {city.name}
          </h1>

          <p>
            Modifiez les informations de la ville.
          </p>

        </div>

        <form
          action={updateHotelCity}
          className="new-destination-form"
        >

          <input
            type="hidden"
            name="cityId"
            value={city.id}
          />

          <input
            type="hidden"
            name="hotelDestinationId"
            value={destinationId}
          />

          {/* INFORMATIONS */}

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
                  Modifiez le nom, la description
                  et l&apos;ordre d&apos;affichage.
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
                defaultValue={city.name}
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
                defaultValue={
                  city.description ?? ""
                }
              />

            </label>

            <label>

              <span>
                Ordre d&apos;affichage
              </span>

              <input
                type="number"
                name="sortOrder"
                min="0"
                defaultValue={
                  city.sortOrder
                }
              />

            </label>

          </section>

          {/* PHOTO */}

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
                  Laissez vide pour conserver
                  la photo actuelle.
                </p>

              </div>

            </div>

            {city.coverImage && (
              <div className="admin-city-current-cover">

                <img loading="lazy" decoding="async"
                  src={city.coverImage}
                  alt={city.name}
                />

                <span>
                  Photo actuelle
                </span>

              </div>
            )}

            <SinglePhotoUpload
              name="coverImage"
              title="Remplacer la photo de la ville"
            />

          </section>

          {/* PUBLICATION */}

          <section className="hotel-destination-options">

            <label className="hotel-option-card">

              <input
                type="checkbox"
                name="published"
                defaultChecked={
                  city.published
                }
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
                defaultChecked={
                  city.featured
                }
              />

              <div>

                <strong>
                  Ville mise en avant
                </strong>

                <span>
                  Activez ou désactivez
                  sa mise en avant.
                </span>

              </div>

            </label>

          </section>

          <button
            type="submit"
            className="hotel-destination-submit"
          >
            Enregistrer les modifications
          </button>

        </form>

      </div>

    </main>
  );
}