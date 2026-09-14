import Link from "next/link";
import { notFound } from "next/navigation";

import {
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Tag,
} from "lucide-react";

import DestinationGallery from "@/components/DestinationGallery";

import { prisma } from "@/lib/prisma";


export default async function PromotionDetailPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {

  const { slug } =
    await params;


  const promotion =
    await prisma.promotion.findUnique({

      where: {
        slug,
      },

      include: {

        destination: true,

        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },

      },

    });


  if (
    !promotion ||
    !promotion.published
  ) {
    notFound();
  }


  const images =
    promotion.images.length > 0
      ? promotion.images.map(
          (image) => image.url
        )
      : promotion.coverImage
        ? [promotion.coverImage]
        : [];


  return (

    <main>


      {/* =====================================
          HERO
      ===================================== */}

      <section
        className="promotion-detail-hero"
        style={{
          backgroundImage:
            promotion.coverImage
              ? `linear-gradient(
                  90deg,
                  rgba(6,31,32,.88),
                  rgba(6,31,32,.30)
                ),
                url("${promotion.coverImage}")`
              : undefined,
        }}
      >

        <div className="shell">


          {/* BOUTON RETOUR PREMIUM */}

          <Link
            href="/promotions"
            className="public-back-link"
          >
            Toutes les promotions
          </Link>


          {promotion.discount && (

            <span className="promotion-detail-discount">

              <Tag size={15} />

              Économisez {promotion.discount}%

            </span>

          )}


          <h1>
            {promotion.title}
          </h1>


          <div className="promotion-detail-meta">

            {promotion.destination && (

              <span>

                <MapPin size={16} />

                {promotion.destination.name},
                {" "}
                {promotion.destination.country}

              </span>

            )}


            {promotion.duration && (

              <span>

                <Clock3 size={16} />

                {promotion.duration}

              </span>

            )}

          </div>

        </div>

      </section>



      {/* =====================================
          CONTENU
      ===================================== */}

      <section className="section shell promotion-detail-layout">


        <div className="promotion-detail-main">


          {/* GALERIE */}

          {images.length > 0 && (

            <DestinationGallery
              images={images}
              name={promotion.title}
            />

          )}


          {/* DESCRIPTION */}

          <div className="promotion-detail-description">

            <span className="eyebrow">
              Votre séjour
            </span>

            <h2>
              À propos de cette offre
            </h2>

            <p>
              {promotion.description}
            </p>

          </div>


          {/* DATES */}

          {(promotion.startDate ||
            promotion.endDate) && (

            <div className="promotion-validity">

              <CalendarDays size={21} />

              <div>

                <strong>
                  Période de validité
                </strong>

                <p>

                  {promotion.startDate
                    ? new Intl.DateTimeFormat(
                        "fr-FR"
                      ).format(
                        promotion.startDate
                      )
                    : "À partir de maintenant"}

                  {" — "}

                  {promotion.endDate
                    ? new Intl.DateTimeFormat(
                        "fr-FR"
                      ).format(
                        promotion.endDate
                      )
                    : "Sans date de fin"}

                </p>

              </div>

            </div>

          )}

        </div>



        {/* =====================================
            CARTE PRIX
        ===================================== */}

        <aside className="promotion-booking-card">

          <span className="promotion-booking-label">
            Offre spéciale
          </span>


          {promotion.oldPrice && (

            <div className="promotion-old-price">

              <span>
                Prix initial
              </span>

              <del>
                {promotion.oldPrice.toLocaleString(
                  "fr-FR"
                )} DA
              </del>

            </div>

          )}


          <div className="promotion-main-price">

            <small>
              À partir de
            </small>

            <strong>
              {promotion.price.toLocaleString(
                "fr-FR"
              )}

              <span>
                {" "}
                DA
              </span>
            </strong>

          </div>


          {promotion.discount && (

            <div className="promotion-saving">

              <Check size={16} />

              Vous économisez {promotion.discount}%

            </div>

          )}


          {promotion.duration && (

            <div className="promotion-booking-info">

              <Clock3 size={17} />

              <div>

                <small>
                  Durée
                </small>

                <strong>
                  {promotion.duration}
                </strong>

              </div>

            </div>

          )}


          {promotion.destination && (

            <div className="promotion-booking-info">

              <MapPin size={17} />

              <div>

                <small>
                  Destination
                </small>

                <strong>
                  {promotion.destination.name}
                </strong>

              </div>

            </div>

          )}


          <Link
            href="/contact"
            className="promotion-book-button"
          >
            Demander cette offre
          </Link>


          <p className="promotion-booking-note">
            Envoyez-nous votre demande et notre
            équipe vous contactera pour finaliser
            votre séjour.
          </p>

        </aside>

      </section>

    </main>
  );
}