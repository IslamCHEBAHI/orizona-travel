import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Eye,
  Images,
  MapPin,
  Pencil,
  Plus,
} from "lucide-react";

import DeleteDestinationButton from "@/components/admin/DeleteDestinationButton";

export default async function AdminDestinationsPage() {
  const destinations = await prisma.destination.findMany({
    include: {
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="admin-destinations-page">
      <div className="admin-destinations-header">

        <div>

          <Link
            href="/admin"
            className="admin-destination-back"
          >
            ← Retour au tableau de bord
          </Link>

          <span className="admin-small-title">
            GESTION DU CONTENU
          </span>

          <h1>Destinations</h1>

          <p>
            Ajoutez, modifiez et gérez les destinations
            proposées sur votre site.
          </p>

        </div>

        <Link
          href="/admin/destinations/nouveau"
          className="admin-add-destination"
        >
          <Plus size={18} />
          Ajouter une destination
        </Link>

      </div>

      {destinations.length === 0 ? (
        <div className="admin-destination-empty">

          <div className="empty-destination-icon">
            <MapPin size={28} />
          </div>

          <h2>Aucune destination</h2>

          <p>
            Vous n'avez encore ajouté aucune destination.
            Commencez par créer la première.
          </p>

          <Link
            href="/admin/destinations/nouveau"
            className="admin-add-destination"
          >
            <Plus size={17} />
            Ajouter une destination
          </Link>

        </div>
      ) : (
        <div className="admin-destination-grid">

          {destinations.map((destination) => (

            <article
              key={destination.id}
              className="admin-destination-card"
            >

              {/* IMAGE */}

              <div className="admin-destination-card-image">

                {destination.coverImage ? (
                  <img loading="lazy" decoding="async"
                    src={destination.coverImage}
                    alt={destination.name}
                  />
                ) : (
                  <div className="admin-destination-no-photo">
                    <Images size={30} />
                    <span>Aucune photo</span>
                  </div>
                )}


                {/* STATUT */}

                <span
                  className={
                    destination.published
                      ? "admin-status published"
                      : "admin-status draft"
                  }
                >
                  {destination.published
                    ? "Publié"
                    : "Brouillon"}
                </span>

              </div>


              {/* CONTENU */}

              <div className="admin-destination-card-content">

                <div className="admin-destination-country">
                  <MapPin size={14} />
                  {destination.country}
                </div>

                <h2>
                  {destination.name}
                </h2>

                <p className="admin-destination-tag">
                  {destination.tag ||
                    "Destination touristique"}
                </p>


                {/* INFORMATIONS */}

                <div className="admin-destination-meta">

                  <span>
                    <Images size={15} />

                    {destination.images.length}

                    {destination.images.length > 1
                      ? " photos"
                      : " photo"}
                  </span>


                  {destination.published && (

                    <Link
                      href={`/destinations/${destination.slug}`}
                      target="_blank"
                    >
                      <Eye size={15} />
                      Voir sur le site
                    </Link>

                  )}

                </div>


                {/* BOUTONS */}

                <div className="admin-destination-actions">

                  <Link
                    href={`/admin/destinations/${destination.id}/modifier`}
                    className="admin-destination-edit"
                  >
                    <Pencil size={16} />
                    Modifier
                  </Link>


                  <DeleteDestinationButton
                    id={destination.id}
                    name={destination.name}
                  />

                </div>

              </div>

            </article>

          ))}

        </div>
      )}
    </main>
  );
}