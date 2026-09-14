import { prisma } from "@/lib/prisma";
import Link from "next/link";
export const dynamic = "force-dynamic";
export default async function DestinationsPage(){
    const destinations = await prisma.destination.findMany({
        where: {
            published: true,
        },
        include: {
            images: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        });
    return <>
    <main>
        <section className="page-hero">
            <div className="shell">
                <span className="eyebrow light">Explorez</span>
                    <h1>Destinations</h1>
                    <p>Des idées de voyage pour chaque envie.</p>
                    </div>
        </section>
        <section className="section shell">
            <div className="listing-grid">{destinations.map((d) => (
                <Link
                    href={`/destinations/${d.slug}`}
                    className="listing-card"
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

                    <div>
                    <span>{d.country}</span>
                    <h2>{d.name}</h2>
                    <p>{d.tag}</p>

                    <span className="destination-link">
                        Découvrir la destination →
                    </span>
                    </div>
                </Link>
                ))}
            </div>
        </section>
    </main>
    </>
}
