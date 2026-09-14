import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Check,
  ImageIcon,
  Star,
  Trash2,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

import AdminHotelImageUpload from "@/components/admin/AdminHotelImageUpload";
import {
  deleteHotelImage,
  setHotelCover,
  updateHotel,
} from "./actions";

export default async function EditHotelPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const hotelId = Number(id);

  if (!Number.isInteger(hotelId)) {
    notFound();
  }

  const hotel =
    await prisma.hotel.findUnique({
      where: {
        id: hotelId,
      },

      include: {
        hotelCity: {
          include: {
            hotelDestination: true,
          },
        },

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

  if (!hotel) {
    notFound();
  }

  const cities =
    await prisma.hotelCity.findMany({
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

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="new-destination-header">
          <Link
            href="/admin/hotels"
            className="back-admin-link"
          >
            ← Retour aux hôtels
          </Link>

          <span className="admin-small-title">
            MODIFICATION
          </span>

          <h1>
            {hotel.name}
          </h1>

          <p>
            {hotel.hotelCity.name}
            {" · "}
            {hotel.hotelCity.hotelDestination.name}
          </p>
        </div>

        {/* =====================================
            FORMULAIRE PRINCIPAL
        ===================================== */}

        <form
          action={updateHotel}
          className="new-destination-form"
        >
          <input
            type="hidden"
            name="hotelId"
            value={hotel.id}
          />

          {/* INFORMATIONS */}

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
                  Modifiez l&apos;identité et la
                  localisation de l&apos;établissement.
                </p>
              </div>
            </div>

            <label>
              <span>
                Nom de l&apos;hôtel
              </span>

              <input
                type="text"
                name="name"
                defaultValue={hotel.name}
                required
              />
            </label>

            <div className="admin-fields-grid">
              <label>
                <span>
                  Ville
                </span>

                <select
                  name="hotelCityId"
                  defaultValue={hotel.hotelCityId}
                  required
                >
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
                  Classement
                </span>

                <select
                  name="stars"
                  defaultValue={hotel.stars}
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
                Description
              </span>

              <textarea
                name="description"
                rows={8}
                defaultValue={hotel.description}
                required
              />
            </label>
          </section>

          {/* =====================================
              TARIFS
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
                  Gérez le prix public de l&apos;hôtel.
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
                  defaultValue={
                    hotel.oldPrice ?? ""
                  }
                />
              </label>

              <label>
                <span>
                  Prix actuel
                </span>

                <input
                  type="number"
                  name="price"
                  min="1"
                  defaultValue={hotel.price}
                  required
                />
              </label>
            </div>
          </section>

          {/* =====================================
              PUBLICATION
          ===================================== */}

          <section className="hotel-destination-options">
            <label className="hotel-option-card">
              <input
                type="checkbox"
                name="published"
                defaultChecked={hotel.published}
              />

              <div>
                <strong>
                  Hôtel publié
                </strong>

                <span>
                  Visible sur le site.
                </span>
              </div>
            </label>

            <label className="hotel-option-card home">
              <input
                type="checkbox"
                name="monthlyOffer"
                defaultChecked={hotel.monthlyOffer}
              />

              <div>
                <strong>
                  Offre hôtel du mois
                </strong>

                <span>
                  Éligible à la mise en avant
                  sur l&apos;accueil.
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

        {/* =====================================
            AJOUT DE NOUVELLES PHOTOS
        ===================================== */}

        <section className="admin-form-section">
          <div className="admin-section-heading">
            <span>
              03
            </span>

            <div>
              <h2>
                Ajouter des photos
              </h2>

              <p>
                Complétez la galerie de l&apos;hôtel.
                Maximum 8 photos au total.
              </p>
            </div>
          </div>

          <AdminHotelImageUpload
            hotelId={hotel.id}
            currentImageCount={
              hotel.images.length
            }
          />
        </section>

        {/* =====================================
            GALERIE EXISTANTE
        ===================================== */}

        <section className="admin-hotel-existing-gallery">
          <div className="admin-section-heading">
            <span>
              04
            </span>

            <div>
              <h2>
                Galerie actuelle
              </h2>

              <p>
                Choisissez la photo principale
                ou supprimez une image.
              </p>
            </div>
          </div>

          {hotel.images.length === 0 ? (
            <div className="admin-hotel-gallery-empty">
              <ImageIcon size={25} />

              Aucune photo
            </div>
          ) : (
            <div className="admin-hotel-existing-grid">
              {hotel.images.map((image) => {
                const isCover =
                  hotel.coverImage ===
                  image.url;

                return (
                  <article
                    key={image.id}
                    className="admin-hotel-existing-photo"
                  >
                    <div className="admin-hotel-existing-photo-image">
                      <img loading="lazy" decoding="async"
                        src={image.url}
                        alt={hotel.name}
                      />

                      {isCover && (
                        <span className="admin-hotel-cover-badge">
                          <Check size={13} />
                          Principale
                        </span>
                      )}
                    </div>

                    <div className="admin-hotel-existing-photo-actions">
                      {!isCover && (
                        <form
                          action={setHotelCover}
                        >
                          <input
                            type="hidden"
                            name="hotelId"
                            value={hotel.id}
                          />

                          <input
                            type="hidden"
                            name="imageId"
                            value={image.id}
                          />

                          <button type="submit">
                            <Star size={14} />
                            Principale
                          </button>
                        </form>
                      )}

                      <form
                        action={deleteHotelImage}
                      >
                        <input
                          type="hidden"
                          name="hotelId"
                          value={hotel.id}
                        />

                        <input
                          type="hidden"
                          name="imageId"
                          value={image.id}
                        />

                        <button
                          type="submit"
                          className="danger"
                        >
                          <Trash2 size={14} />
                          Supprimer
                        </button>
                      </form>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}