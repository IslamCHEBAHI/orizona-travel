import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  CalendarDays,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Tag,
  Images,
} from "lucide-react";

export default async function AdminPromotionsPage() {
  const promotions = await prisma.promotion.findMany({
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
            GESTION COMMERCIALE
          </span>

          <h1>Promotions</h1>

          <p>
            Créez et gérez les offres promotionnelles
            visibles sur votre site.
          </p>

        </div>

        <Link
          href="/admin/promotions/nouveau"
          className="admin-add-promotion"
        >
          <Plus size={18} />
          Ajouter une promotion
        </Link>

      </div>


      {promotions.length === 0 ? (

        <div className="admin-promotion-empty">

          <div className="empty-promotion-icon">
            <Tag size={28} />
          </div>

          <h2>Aucune promotion</h2>

          <p>
            Aucune offre promotionnelle n'a encore
            été créée.
          </p>

          <Link
            href="/admin/promotions/nouveau"
            className="admin-add-promotion"
          >
            <Plus size={17} />
            Ajouter une promotion
          </Link>

        </div>

      ) : (

        <div className="admin-promotion-grid">

          {promotions.map((promotion) => (

            <article
              key={promotion.id}
              className="admin-promotion-card"
            >

              <div className="admin-promotion-image">

                {promotion.coverImage ? (

                  <img loading="lazy" decoding="async"
                    src={promotion.coverImage}
                    alt={promotion.title}
                  />

                ) : (

                  <div className="admin-promotion-no-photo">
                    <Images size={30} />
                    <span>Aucune photo</span>
                  </div>

                )}


                <span
                  className={
                    promotion.published
                      ? "admin-status published"
                      : "admin-status draft"
                  }
                >
                  {promotion.published
                    ? "Publié"
                    : "Brouillon"}
                </span>


                {promotion.discount && (
                  <span className="admin-promotion-discount">
                    -{promotion.discount}%
                  </span>
                )}

              </div>


              <div className="admin-promotion-content">

                {promotion.destination && (

                  <div className="admin-promotion-destination">
                    <MapPin size={14} />
                    {promotion.destination.name}
                  </div>

                )}


                <h2>
                  {promotion.title}
                </h2>


                {promotion.duration && (

                  <div className="admin-promotion-duration">
                    <CalendarDays size={14} />
                    {promotion.duration}
                  </div>

                )}


                <div className="admin-promotion-prices">

                  {promotion.oldPrice && (
                    <span>
                      {promotion.oldPrice.toLocaleString("fr-FR")} DA
                    </span>
                  )}

                  <strong>
                    {promotion.price.toLocaleString("fr-FR")} DA
                  </strong>

                </div>


                <div className="admin-destination-meta">

                  <span>
                    <Images size={15} />

                    {promotion.images.length}

                    {promotion.images.length > 1
                      ? " photos"
                      : " photo"}
                  </span>


                  {promotion.published && (

                    <Link
                      href={`/promotions/${promotion.slug}`}
                      target="_blank"
                    >
                      <Eye size={15} />
                      Voir sur le site
                    </Link>

                  )}

                </div>


                <div className="admin-destination-actions">

                  <Link
                    href={`/admin/promotions/${promotion.id}/modifier`}
                    className="admin-destination-edit"
                  >
                    <Pencil size={16} />
                    Modifier
                  </Link>

                  <button
                    type="button"
                    className="admin-destination-delete"
                    disabled
                  >
                    Supprimer
                  </button>

                </div>

              </div>

            </article>

          ))}

        </div>

      )}

    </main>
  );
}