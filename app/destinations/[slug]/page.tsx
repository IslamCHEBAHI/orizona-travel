import DestinationGallery from "@/components/DestinationGallery";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const destination = await prisma.destination.findUnique({
    where: {
      slug,
    },

    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!destination || !destination.published) {
    notFound();
  }

  const images =
    destination.images.length > 0
      ? destination.images.map(
          (image) => image.url
        )
      : destination.coverImage
        ? [destination.coverImage]
        : [];

  return (
    <main>

      {/* =====================================
          HERO
      ===================================== */}

      <section
        className="destination-detail-hero"
        style={{
          backgroundImage:
            destination.coverImage
              ? `linear-gradient(
                  90deg,
                  rgba(4, 24, 28, .78),
                  rgba(4, 24, 28, .18)
                ),
                url("${destination.coverImage}")`
              : undefined,
        }}
      >

        <div className="shell">

          {/* BOUTON RETOUR PREMIUM */}

          <Link
            href="/destinations"
            className="public-back-link"
          >
            Toutes les destinations
          </Link>

          <span>
            {destination.country}
          </span>

          <h1>
            {destination.name}
          </h1>

          {destination.tag && (
            <p>
              {destination.tag}
            </p>
          )}

        </div>

      </section>


      {/* =====================================
          CONTENU
      ===================================== */}

      <section className="destination-detail shell">

        <DestinationGallery
          images={images}
          name={destination.name}
        />


        <div className="destination-description">

          <span className="eyebrow">
            Découvrez {destination.name}
          </span>


          <h2>
            Une destination,
            <br />
            mille expériences.
          </h2>


          <p>
            {destination.description ??
              `Découvrez ${destination.name}, une destination sélectionnée par notre agence pour vous offrir une expérience de voyage exceptionnelle.`}
          </p>


          <div className="destination-info">

            <div>

              <small>
                Destination
              </small>

              <strong>
                {destination.name}
              </strong>

            </div>


            <div>

              <small>
                Pays
              </small>

              <strong>
                {destination.country}
              </strong>

            </div>


            <div>

              <small>
                Expérience
              </small>

              <strong>
                {destination.tag || "Voyage"}
              </strong>

            </div>

          </div>


          <div className="destination-actions">

            <Link
              href="/sejours"
              className="primary-btn"
            >
              Voir les séjours
            </Link>


            <Link
              href="/billetterie"
              className="outline-btn"
            >
              Demander un devis
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}