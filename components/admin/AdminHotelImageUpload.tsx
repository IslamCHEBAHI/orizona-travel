"use client";

import {
  ChangeEvent,
  useState,
} from "react";

import {
  ImagePlus,
  Loader2,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

type Props = {
  hotelId: number;
  currentImageCount: number;
};

export default function AdminHotelImageUpload({
  hotelId,
  currentImageCount,
}: Props) {
  const router =
    useRouter();

  const [files, setFiles] =
    useState<File[]>([]);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  function handleChange(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    const selected =
      Array.from(
        event.target.files ?? []
      );

    const remaining =
      8 - currentImageCount;

    if (
      selected.length >
      remaining
    ) {
      alert(
        `Vous pouvez encore ajouter ${remaining} photo(s).`
      );

      event.target.value = "";
      return;
    }

    const invalid =
      selected.find(
        (file) =>
          ![
            "image/jpeg",
            "image/png",
            "image/webp",
          ].includes(file.type)
      );

    if (invalid) {
      alert(
        "JPEG, PNG ou WEBP uniquement."
      );

      event.target.value = "";
      return;
    }

    const tooLarge =
      selected.find(
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

    setFiles(selected);
    setMessage("");
  }

  async function uploadImages() {
    if (files.length === 0) {
      setMessage(
        "Sélectionnez au moins une photo."
      );

      return;
    }

    setUploading(true);
    setMessage("");

    try {
      /*
       * IMPORTANT :
       * une photo = une requête.
       *
       * On évite ainsi les gros formulaires
       * multipart qui provoquaient
       * "Unexpected end of form".
       */
      for (const file of files) {
        const formData =
          new FormData();

        formData.append(
          "image",
          file
        );

        const response =
          await fetch(
            `/api/admin/hotels/${hotelId}/images`,
            {
              method: "POST",
              body: formData,
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ??
              "Erreur d'envoi."
          );
        }
      }

      setFiles([]);

      setMessage(
        "Photo(s) ajoutée(s) avec succès."
      );

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'envoi."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-photo-upload">

      <label className="admin-upload-box">

        <div className="admin-upload-icon">
          <ImagePlus size={32} />
        </div>

        <strong>
          Ajouter de nouvelles photos
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
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={uploading}
          onChange={handleChange}
        />
      </label>

      {files.length > 0 && (
        <div className="admin-photo-toolbar">
          <strong>
            {files.length} photo
            {files.length > 1
              ? "s"
              : ""}
            {" "}
            sélectionnée
            {files.length > 1
              ? "s"
              : ""}
          </strong>
        </div>
      )}

      {message && (
        <p className="admin-photo-info">
          {message}
        </p>
      )}

      <button
        type="button"
        className="hotel-destination-submit"
        disabled={
          uploading ||
          files.length === 0
        }
        onClick={uploadImages}
      >
        {uploading ? (
          <>
            <Loader2
              size={18}
              className="admin-upload-spinner"
            />

            Envoi en cours...
          </>
        ) : (
          "Ajouter les photos"
        )}
      </button>

    </div>
  );
}