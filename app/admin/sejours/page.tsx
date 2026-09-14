import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { deleteStay } from "./actions";

import {
  CalendarDays,
  Eye,
  Images,
  MapPin,
  Pencil,
  Plane,
  Plus,
  Users,
} from "lucide-react";


export default async function AdminSejoursPage() {

  const sejours =
    await prisma.promotion.findMany({

      include: {
        destination: true,
        images: true,
      },

      orderBy: {
        createdAt: "desc",
      },

    });


  return (
    <main className="admin-promotions-page">

      <div className="admin-promotions-header">

        <div>

          <Link
            href="/admin"
            className="admin-destination-back"
          >
            ← Retour au tableau de bord
          </Link>

          <span className="admin-small-title">
            GESTION DES VOYAGES
          </span>

          <h1>
            Séjours
          </h1>

          <p>
            Créez et gérez les séjours proposés
            par votre agence.
          </p>

        </div>


        <Link
          href="/admin/sejours/nouveau"
          className="admin-add-promotion"
        >
          <Plus size={18} />
          Ajouter un séjour
        </Link>

      </div>


      {sejours.length === 0 ? (

        <div className="admin-promotion-empty">

          <div className="empty-promotion-icon">
            <Plane size={28} />
          </div>

          <h2>
            Aucun séjour
          </h2>

          <p>
            Aucun séjour n&apos;a encore été créé.
          </p>

          <Link
            href="/admin/sejours/nouveau"
            className="admin-add-promotion"
          >
            <Plus size={17} />
            Ajouter un séjour
          </Link>

        </div>

      ) : (

        <div className="admin-promotion-grid">

          {sejours.map((sejour) => (

            <article
              key={sejour.id}
              className="admin-promotion-card"
            >

              {/* PHOTO */}

              <div className="admin-promotion-image">

                {sejour.coverImage ? (

                  <img loading="lazy" decoding="async"
                    src={sejour.coverImage}
                    alt={sejour.title}
                  />

                ) : (

                  <div className="admin-promotion-no-photo">

                    <Images size={30} />

                    <span>
                      Aucune photo
                    </span>

                  </div>

                )}


                <span
                  className={
                    sejour.published
                      ? "admin-status published"
                      : "admin-status draft"
                  }
                >
                  {sejour.published
                    ? "Publié"
                    : "Brouillon"}
                </span>


                {sejour.discount && (
                  <span className="admin-promotion-discount">
                    -{sejour.discount}%
                  </span>
                )}

              </div>


              {/* CONTENU */}

              <div className="admin-promotion-content">

                {sejour.destination && (

                  <div className="admin-promotion-destination">

                    <MapPin size={14} />

                    {sejour.destination.name}

                    {sejour.destination.country
                      ? ` — ${sejour.destination.country}`
                      : ""}

                  </div>

                )}


                <h2>
                  {sejour.title}
                </h2>


                {sejour.duration && (

                  <div className="admin-promotion-duration">

                    <CalendarDays size={14} />

                    {sejour.duration}

                  </div>

                )}


                {sejour.departureCity && (

                  <div className="admin-promotion-duration">

                    <Plane size={14} />

                    Départ de {sejour.departureCity}

                  </div>

                )}


                {sejour.availableSeats !== null &&
                  sejour.availableSeats !== undefined && (

                    <div className="admin-promotion-duration">

                      <Users size={14} />

                      {sejour.availableSeats} places disponibles

                    </div>

                  )}


                {/* PRIX */}

                <div className="admin-promotion-prices">

                  {sejour.oldPrice && (
                    <span>
                      {sejour.oldPrice.toLocaleString("fr-FR")} DA
                    </span>
                  )}

                  <strong>
                    {sejour.price.toLocaleString("fr-FR")} DA
                  </strong>

                </div>


                {/* MÉTA */}

                <div className="admin-destination-meta">

                  <span>

                    <Images size={15} />

                    {sejour.images.length}

                    {sejour.images.length > 1
                      ? " photos"
                      : " photo"}

                  </span>


                  {sejour.published && (

                    <Link
                      href={`/sejours/${sejour.slug}`}
                      target="_blank"
                    >
                      <Eye size={15} />
                      Voir sur le site
                    </Link>

                  )}

                </div>


                {/* ACTIONS */}

                <div className="admin-destination-actions">

                  <Link
                    href={`/admin/sejours/${sejour.id}/modifier`}
                    className="admin-destination-edit"
                  >
                    <Pencil size={16} />
                    Modifier
                  </Link>


                  <form action={deleteStay}>

                    <input
                        type="hidden"
                        name="id"
                        value={sejour.id}
                    />

                    <button
                        type="submit"
                        className="admin-destination-delete"
                    >
                        Supprimer
                    </button>

                    </form>

                </div>

              </div>

            </article>

          ))}

        </div>

      )}

    </main>
  );
}