"use client";

import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

import {
  Check,
  ImagePlus,
  Images,
  Star,
  Trash2,
} from "lucide-react";


type PhotoItem = {
  id: string;
  file: File;
  url: string;
};


type Props = {
  title?: string;
};


export default function AdminPhotoUpload({
  title = "Ajouter les photos",
}: Props) {

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [photos, setPhotos] =
    useState<PhotoItem[]>([]);

  const [coverId, setCoverId] =
    useState<string | null>(null);


  function updateInputFiles(
    items: PhotoItem[]
  ) {

    if (!inputRef.current) return;

    const dataTransfer =
      new DataTransfer();

    items.forEach((item) => {
      dataTransfer.items.add(item.file);
    });

    inputRef.current.files =
      dataTransfer.files;
  }


  function handleImages(
    event: ChangeEvent<HTMLInputElement>
  ) {

    const selectedFiles =
      Array.from(
        event.target.files ?? []
      );


    const validFiles =
      selectedFiles.filter(
        (file) =>
          [
            "image/jpeg",
            "image/png",
            "image/webp",
          ].includes(file.type)
      );


    if (
      validFiles.length !==
      selectedFiles.length
    ) {
      alert(
        "Seuls les formats JPG, PNG et WEBP sont autorisés."
      );
    }


    const tooLarge =
      validFiles.find(
        (file) =>
          file.size >
          4 * 1024 * 1024
      );


    if (tooLarge) {
      alert(
        `${tooLarge.name} dépasse 4 Mo.`
      );

      event.target.value = "";
      return;
    }


    const newPhotos =
      validFiles.map((file) => ({

        id:
          `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,

        file,

        url:
          URL.createObjectURL(file),

      }));


    const combined = [
      ...photos,
      ...newPhotos,
    ];


    if (combined.length > 8) {

      newPhotos.forEach((photo) => {
        URL.revokeObjectURL(
          photo.url
        );
      });

      alert(
        "Vous pouvez ajouter au maximum 8 photos."
      );

      updateInputFiles(photos);

      return;
    }


    setPhotos(combined);


    if (
      !coverId &&
      combined.length > 0
    ) {
      setCoverId(
        combined[0].id
      );
    }


    updateInputFiles(combined);
  }


  function removePhoto(
    id: string
  ) {

    const removed =
      photos.find(
        (photo) =>
          photo.id === id
      );

    if (removed) {
      URL.revokeObjectURL(
        removed.url
      );
    }

    const remaining =
      photos.filter(
        (photo) =>
          photo.id !== id
      );

    setPhotos(remaining);

    if (coverId === id) {

      setCoverId(
        remaining.length > 0
          ? remaining[0].id
          : null
      );

    }

    updateInputFiles(
      remaining
    );
  }

  const coverIndex =
    photos.findIndex(
      (photo) =>
        photo.id === coverId
    );

  return (

    <div className="admin-photo-upload">

      <label className="admin-upload-box">

        <div className="admin-upload-icon">

          <ImagePlus size={32} />

        </div>

        <strong>
          {title}
        </strong>

        <span>
          Cliquez pour sélectionner
          vos photos
        </span>

        <small>
          JPG, PNG ou WEBP —
          maximum 8 photos —
          4 Mo par photo
        </small>

        <input
          ref={inputRef}
          type="file"
          name="images"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleImages}
        />

      </label>
      <input
        type="hidden"
        name="coverIndex"
        value={
          coverIndex >= 0
            ? coverIndex
            : 0
        }
      />
      {photos.length > 0 && (

        <div className="admin-selected-images">

          <div className="admin-photo-toolbar">
            <div>
              <Images size={18} />
              <strong>
                {photos.length} photo
                {photos.length > 1
                  ? "s"
                  : ""}
              </strong>
            </div>
          </div>
          <div className="admin-photo-preview-grid">
            {photos.map(
              (photo) => {
                const isCover =
                  photo.id === coverId;
                return (

                  <div
                    key={photo.id}
                    className={
                      isCover
                        ? "admin-photo-preview selected-cover"
                        : "admin-photo-preview"
                    }
                  >

                    <img loading="lazy" decoding="async"
                      src={photo.url}
                      alt="Photo sélectionnée"
                    />
                    {isCover && (
                      <span className="cover-badge">
                        <Check size={12} />
                        Photo principale
                      </span>

                    )}
                    <div className="admin-photo-preview-actions">
                      {!isCover && (
                        <button
                          type="button"
                          className="photo-set-cover"
                          onClick={() =>
                            setCoverId(
                              photo.id
                            )
                          }
                        >
                          <Star size={14} />
                          Principale
                        </button>
                      )}
                      <button
                        type="button"
                        className="photo-remove"
                        onClick={() =>
                          removePhoto(
                            photo.id
                          )
                        }
                      >
                        <Trash2 size={14} />
                        Supprimer
                      </button>
                    </div>
                  </div>

                );
              }
            )}
          </div>

          <p className="admin-photo-note">
            Cliquez sur « Principale »
            pour choisir la photo utilisée
            sur les cartes et en couverture.
          </p>
        </div>
      )}
    </div>
  );
}