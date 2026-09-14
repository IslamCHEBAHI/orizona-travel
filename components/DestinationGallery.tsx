"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  name: string;
};

export default function DestinationGallery({ images, name }: Props) {
  const [index, setIndex] = useState(0);

  const previous = () => {
    setIndex((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const next = () => {
    setIndex((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((current) =>
        current === images.length - 1 ? 0 : current + 1
      );
    }, 4500);

    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="destination-gallery-empty">
        Aucune photo disponible pour cette destination.
      </div>
    );
  }

  return (
    <div className="destination-gallery">

      <div className="destination-gallery-main">

        <img loading="lazy" decoding="async"
          key={images[index]}
          src={images[index]}
          alt={`${name} - photo ${index + 1}`}
        />

        {images.length > 1 && (
          <>
            <button
              className="gallery-arrow gallery-prev"
              onClick={previous}
              aria-label="Photo précédente"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              className="gallery-arrow gallery-next"
              onClick={next}
              aria-label="Photo suivante"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        <div className="gallery-counter">
          {index + 1} / {images.length}
        </div>

      </div>

      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((image, i) => (
            <button
              key={image}
              className={i === index ? "active" : ""}
              onClick={() => setIndex(i)}
            >
              <img loading="lazy" decoding="async" src={image} alt="" />
            </button>
          ))}
        </div>
      )}

    </div>
  );
}