"use client";

import {
  ImagePlus,
  Trash2,
} from "lucide-react";

import {
  ChangeEvent,
  useState,
} from "react";


type Props = {
  name?: string;
  title?: string;
};


export default function SinglePhotoUpload({
  name = "coverImage",
  title = "Photo principale",
}: Props) {

  const [preview, setPreview] =
    useState<string | null>(null);


  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {

      alert(
        "Format non accepté. Utilisez JPEG, PNG ou WEBP."
      );

      event.target.value = "";

      return;
    }


    if (
      file.size >
      4 * 1024 * 1024
    ) {

      alert(
        "La photo ne doit pas dépasser 4 Mo."
      );

      event.target.value = "";

      return;
    }


    if (preview) {
      URL.revokeObjectURL(preview);
    }


    setPreview(
      URL.createObjectURL(file)
    );

  };


  const removePhoto = () => {

    const input =
      document.querySelector<HTMLInputElement>(
        `input[name="${name}"]`
      );


    if (input) {
      input.value = "";
    }


    if (preview) {
      URL.revokeObjectURL(preview);
    }


    setPreview(null);

  };


  return (

    <div className="single-photo-upload">

      <label className="single-photo-upload-box">

        <input
          type="file"
          name={name}
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
        />


        {!preview ? (

          <>

            <div className="single-photo-icon">

              <ImagePlus size={27} />

            </div>


            <strong>
              {title}
            </strong>


            <span>
              Cliquez pour sélectionner
              une photo
            </span>


            <small>
              JPEG, PNG ou WEBP · 4 Mo maximum
            </small>

          </>

        ) : (

          <div className="single-photo-preview">

            <img loading="lazy" decoding="async"
              src={preview}
              alt="Aperçu"
            />


            <span>
              Photo sélectionnée
            </span>

          </div>

        )}

      </label>


      {preview && (

        <button
          type="button"
          className="single-photo-remove"
          onClick={removePhoto}
        >
          <Trash2 size={15} />

          Supprimer la photo
        </button>

      )}

    </div>

  );
}