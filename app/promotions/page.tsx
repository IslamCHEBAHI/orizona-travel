import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Tag,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function PromotionsPage() {

  const promotions = await prisma.promotion.findMany({

    where: {
      published: true,
    },

    include: {
      destination: true,
    },

    orderBy: {
      createdAt: "desc",
    },

  });

  return (
    <>

      <main>

        {/* HERO */}

        <section className="promotions-list-hero">

          <div className="shell">

            <span className="eyebrow light">
              <Tag size={15} />
              Nos meilleures offres
            </span>

            <h1>
              Promotions & offres spéciales
            </h1>

            <p>
              Découvrez nos offres de voyage sélectionnées
              et profitez de tarifs préférentiels pour
              votre prochain départ.
            </p>

          </div>

        </section>


        {/* LISTE */}

        <section className="section shell">

          <div className="promotions-page-heading">

            <div>

              <span className="eyebrow">
                Offres disponibles
              </span>

              <h2>
                Choisissez votre prochaine expérience
              </h2>

            </div>

            <span className="promotion-count">
              {promotions.length} offre
              {promotions.length > 1 ? "s" : ""}
            </span>

          </div>


          {promotions.length === 0 ? (

            <div className="public-promotions-empty">

              <Tag size={30} />

              <h3>
                Aucune promotion disponible
              </h3>

              <p>
                De nouvelles offres seront prochainement
                disponibles.
              </p>

            </div>

          ) : (

            <div className="public-promotion-grid">

              {promotions.map((promotion) => (

                <Link
                  key={promotion.id}
                  href={`/promotions/${promotion.slug}`}
                  className="public-promotion-card"
                >

                  <div className="public-promotion-image">

                    {promotion.coverImage ? (

                      <img loading="lazy" decoding="async"
                        src={promotion.coverImage}
                        alt={promotion.title}
                      />

                    ) : (

                      <div className="public-promotion-no-image">
                        <Tag size={28} />
                        <span>Aucune photo</span>
                      </div>

                    )}


                    {promotion.discount && (

                      <span className="public-promotion-discount">
                        -{promotion.discount}%
                      </span>

                    )}

                  </div>


                  <div className="public-promotion-content">

                    {promotion.destination && (

                      <div className="public-promotion-location">

                        <MapPin size={14} />

                        <span>
                          {promotion.destination.name}
                          {" · "}
                          {promotion.destination.country}
                        </span>

                      </div>

                    )}


                    <h3>
                      {promotion.title}
                    </h3>


                    {promotion.duration && (

                      <div className="public-promotion-duration">

                        <CalendarDays size={15} />

                        <span>
                          {promotion.duration}
                        </span>

                      </div>

                    )}


                    <div className="public-promotion-footer">

                      <div className="public-promotion-prices">

                        {promotion.oldPrice && (

                          <small>
                            {promotion.oldPrice.toLocaleString("fr-FR")} DA
                          </small>

                        )}

                        <strong>
                          {promotion.price.toLocaleString("fr-FR")} DA
                        </strong>

                      </div>


                      <span className="public-promotion-arrow">
                        <ArrowRight size={18} />
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          )}

        </section>

      </main>
    </>
  );
}