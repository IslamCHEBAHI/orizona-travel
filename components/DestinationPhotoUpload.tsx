"use client";

import { ChangeEvent, useRef, useState } from "react";
import { ImagePlus, X, Images } from "lucide-react";

type Preview = {
  name: string;
  url: string;
};

export default function DestinationPhotoUpload() {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length > 8) {
      alert("Vous pouvez sélectionner au maximum 8 photos.");
      event.target.value = "";
      return;
    }

    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      alert("Seuls les formats JPG, PNG et WEBP sont autorisés.");
    }

    previews.forEach((preview) => {
      URL.revokeObjectURL(preview.url);
    });

    setPreviews(
      validFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }))
    );
  }

  function clearImages() {
    previews.forEach((preview) => {
      URL.revokeObjectURL(preview.url);
    });

    setPreviews([]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="admin-photo-upload">

      <label className="admin-upload-box">

        <div className="admin-upload-icon">
          <ImagePlus size={32} />
        </div>

        <strong>Ajouter les photos de la destination</strong>

        <span>
          Cliquez pour sélectionner plusieurs photos
        </span>

        <small>
          JPG, PNG ou WEBP — maximum 8 photos
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

      {previews.length > 0 && (
        <div className="admin-selected-images">

          <div className="admin-photo-toolbar">

            <div>
              <Images size={18} />

              <strong>
                {previews.length} photo
                {previews.length > 1 ? "s" : ""} sélectionnée
                {previews.length > 1 ? "s" : ""}
              </strong>
            </div>

            <button
              type="button"
              onClick={clearImages}
            >
              <X size={16} />
              Tout retirer
            </button>

          </div>

          <div className="admin-photo-preview-grid">

            {previews.map((preview, index) => (
              <div
                className="admin-photo-preview"
                key={`${preview.name}-${index}`}
              >

                <img loading="lazy" decoding="async"
                  src={preview.url}
                  alt={`Photo ${index + 1}`}
                />

                <span className="preview-number">
                  {index + 1}
                </span>

                {index === 0 && (
                  <span className="cover-badge">
                    Photo principale
                  </span>
                )}

              </div>
            ))}

          </div>

          <p className="admin-photo-note">
            La première photo sera utilisée comme image principale de la destination.
          </p>

        </div>
      )}

    </div>
  );
}