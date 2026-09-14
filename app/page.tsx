import Link from "next/link";
import { ArrowRight, BadgeCheck, Headphones, Hotel, Plane, ShieldCheck, Sparkles, Star } from "lucide-react";
import SearchPanel from "@/components/SearchPanel";
import { hotels } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const homeDestinations = await prisma.destination.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });
  const homePromotions = await prisma.promotion.findMany({
    where: {
      published: true,
      featured: true,
    },

    include: {
      destination: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 3,
  });
  const homeHotelDestinations =
    await prisma.hotelDestination.findMany({
      where: {
        published: true,
        featuredHome: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 3,
    });
  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-overlay" />
          <div className="shell hero-content">
            <span className="eyebrow light"><Sparkles size={15}/> Des voyages pensés pour vous</span>
            <h1>Le monde est grand.<br/><em>Partez le vivre.</em></h1>
            <p>Des séjours inspirants, des hôtels sélectionnés et un accompagnement de proximité depuis l’Algérie.</p>
            <SearchPanel />
            <div className="hero-trust"><span><BadgeCheck size={17}/> Agence de confiance</span><span><Headphones size={17}/> Assistance dédiée</span><span><ShieldCheck size={17}/> Paiement sécurisé</span></div>
          </div>
        </section>

        <section className="section shell">
          <div className="section-head"><div><span className="eyebrow">Offres limitées</span><h2>Promotions du moment</h2></div><Link href="/promotions" className="text-link">Voir toutes les offres <ArrowRight size={16}/></Link></div>
          <div className="promo-grid">
            {homePromotions.map((item) => (
              <Link
                href={`/promotions/${item.slug}`}
                className="promo-card"
                key={item.id}
              >
                {item.coverImage ? (
                  <img loading="lazy" decoding="async"
                    src={item.coverImage}
                    alt={item.title}
                  />
                ) : (
                  <div className="promotion-no-image">Aucune photo</div>
                )}
                <div className="dark-fade" />
                {item.discount && (
                  <span className="discount">-{item.discount}%</span>
                )}
                <div className="promo-copy">
                  <span>
                    {item.destination
                      ? item.destination.name
                      : "Offre spéciale"}
                  </span>
                  <h3>{item.title}</h3>

                  {item.duration && (
                    <p>
                      {item.duration}
                    </p>
                  )}
                  <div className="price-line">
                    <div>
                      {item.oldPrice && (
                        <small>
                          {item.oldPrice.toLocaleString("fr-FR")} DA
                        </small>
                      )}
                      <strong>{item.price.toLocaleString("fr-FR")} DA</strong>

                    </div>
                    <span className="promo-arrow">
                      <ArrowRight />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section section-soft">
          <div className="shell">
            <div className="section-head"><div><span className="eyebrow">Inspirez-vous</span><h2>Destinations incontournables</h2></div><Link href="/destinations" className="text-link">Explorer les destinations <ArrowRight size={16}/></Link></div>
            <div className="destination-grid">
              {homeDestinations.map((d) => (
                <Link
                  href={`/destinations/${d.slug}`}
                  className="destination-card"
                  key={d.id}
                >
                  {d.coverImage ? (
                    <img loading="lazy" decoding="async"
                      src={d.coverImage}
                      alt={d.name}
                    />
                  ) : (
                    <div className="destination-no-image">
                      Aucune photo
                    </div>
                  )}

                  <div className="dark-fade" />
                  <div className="destination-copy">
                    <span>
                      {d.country}
                    </span>
                    <h3>{d.name}</h3>
                    <p>{d.tag || "Découvrez cette destination"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section shell split-feature">
          <div className="split-image"><img loading="lazy" decoding="async" src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=85" alt="Voyage en avion"/><span className="floating-note"><Plane size={18}/><b>Billetterie</b><small>Simple, rapide, accompagnée</small></span></div>
          <div className="split-copy"><span className="eyebrow">Billetterie aérienne</span><h2>Votre prochain départ commence ici.</h2><p>Envoyez votre demande de vol en quelques instants. L’agence vous accompagne pour trouver une proposition adaptée à vos dates, votre budget et votre destination.</p><Link href="/billetterie" className="primary-btn">Demander un billet <ArrowRight size={17}/></Link></div>
        </section>

        <section className="section home-hotel-destinations">
          <div className="shell">
            <div className="section-head">
              <div>
                <span className="eyebrow">
                  HÔTELS
                </span>
                <h2>
                  Choisissez votre destination
                </h2>

                <p className="home-hotel-intro">
                  Découvrez notre sélection d'hôtels
                  dans les destinations les plus demandées.
                </p>

              </div>
              <Link
                href="/hotels"
                className="home-hotels-view-all"
              >
                <span>
                  Voir tous les hôtels
                </span>

                <span className="home-hotels-view-all-arrow">
                  →
                </span>
              </Link>

            </div>
            <div className="home-hotel-destination-grid">
              {homeHotelDestinations.map((destination) => (
                <Link
                  key={destination.id}
                  href={`/hotels/${destination.slug}`}
                  className="home-hotel-destination-card"
                >
                  {destination.coverImage ? (
                    <img loading="lazy" decoding="async"
                      src={destination.coverImage}
                      alt={destination.name}
                    />

                  ) : (
                    <div className="home-hotel-destination-placeholder">
                      {destination.name}
                    </div>

                  )}
                  <div className="home-hotel-destination-overlay" />
                  <div className="home-hotel-destination-copy">

                    <span>
                      DESTINATION HÔTELIÈRE
                    </span>
                    <h3>
                      {destination.name}
                    </h3>
                    <div>

                      <span>
                        Découvrir les hôtels
                      </span>
                      <span className="home-hotel-arrow">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section shell"><div className="benefits"><article><span><Headphones/></span><h3>Conseil humain</h3><p>Un interlocuteur dédié avant, pendant et après votre voyage.</p></article><article><span><Hotel/></span><h3>Sélection exigeante</h3><p>Des séjours et hôtels choisis selon la qualité de l’expérience.</p></article><article><span><ShieldCheck/></span><h3>Voyage serein</h3><p>Des informations claires et un suivi de votre demande de réservation.</p></article></div></section>

      </main>
    </>
  );
}
