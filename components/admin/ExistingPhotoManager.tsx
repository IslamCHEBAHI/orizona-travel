"use client";

import {
  Check,
  Star,
  Trash2,
} from "lucide-react";

type Photo = {
  id: number;
  url: string;
};

type Props = {
  images: Photo[];

  coverImage: string | null;

  parentId: number;

  parentFieldName:
    | "destinationId"
    | "promotionId";

  setCoverAction:
    (formData: FormData) => Promise<void>;

  deletePhotoAction:
    (formData: FormData) => Promise<void>;
};

export default function ExistingPhotoManager({
  images,
  coverImage,
  parentId,
  parentFieldName,
  setCoverAction,
  deletePhotoAction,
}: Props) {

  if (images.length === 0) {
    return (
      <div className="existing-photos-empty">
        Aucune photo enregistrée.
      </div>
    );
  }

  return (
    <div className="existing-photo-grid">

      {images.map((image) => {

        const isCover =
          coverImage === image.url;

        return (
          <div
            key={image.id}
            className={
              isCover
                ? "existing-photo-card current-cover"
                : "existing-photo-card"
            }
          >

            <img loading="lazy" decoding="async"
              src={image.url}
              alt="Photo de la destination"
            />

            {isCover && (
              <span className="existing-cover-badge">
                <Check size={12} />
                Photo principale
              </span>
            )}

            <div className="existing-photo-actions">

              {!isCover && (
                <form action={setCoverAction}>

                  <input
                    type="hidden"
                    name={parentFieldName}
                    value={parentId}
                  />

                  <input
                    type="hidden"
                    name="imageId"
                    value={image.id}
                  />

                  <button
                    type="submit"
                    className="existing-set-cover"
                  >
                    <Star size={14} />
                    Principale
                  </button>

                </form>
              )}

              <form
                action={deletePhotoAction}
                onSubmit={(event) => {

                  const confirmation =
                    window.confirm(
                      isCover
                        ? "Cette photo est la photo principale. Voulez-vous vraiment la supprimer ? Une autre photo sera automatiquement choisie."
                        : "Voulez-vous vraiment supprimer définitivement cette photo ?"
                    );

                  if (!confirmation) {
                    event.preventDefault();
                  }
                }}
              >

                <input
                  type="hidden"
                  name={parentFieldName}
                  value={parentId}
                />

                <input
                  type="hidden"
                  name="imageId"
                  value={image.id}
                />

                <button
                  type="submit"
                  className="existing-delete-photo"
                >
                  <Trash2 size={14} />
                  Supprimer
                </button>

              </form>

            </div>

          </div>
        );
      })}

    </div>
  );
}