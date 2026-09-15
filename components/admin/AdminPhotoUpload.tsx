"use client";

import {
  ChangeEvent,
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
  url: string;
  publicId: string;
};


type Props = {
  title?: string;

  initialPhotos?: PhotoItem[];
};



export default function AdminPhotoUpload({

  title = "Ajouter les photos",

  initialPhotos = [],

}: Props) {


  const [photos, setPhotos] =
    useState<PhotoItem[]>(
      initialPhotos
    );


  const [coverId, setCoverId] =
    useState<string | null>(
      initialPhotos.length > 0
        ? initialPhotos[0].id
        : null
    );


  const [uploading, setUploading] =
    useState(false);



  async function uploadFile(
    file: File
  ) {


    const formData =
      new FormData();


    formData.append(
      "file",
      file
    );


    const response =
      await fetch(
        "/api/admin/upload",
        {
          method:"POST",
          body:formData,
        }
      );


    const data =
      await response.json();


    if(!response.ok){

      throw new Error(
        data.error ||
        "Upload impossible."
      );

    }


    return data as {
      url:string;
      publicId:string;
    };

  }





  async function handleImages(
    event: ChangeEvent<HTMLInputElement>
  ){


    const files =
      Array.from(
        event.target.files ?? []
      );



    const validFiles =
      files.filter(
        file =>
          [
            "image/jpeg",
            "image/png",
            "image/webp",
          ].includes(file.type)
      );



    const tooLarge =
      validFiles.find(
        file =>
          file.size >
          4 * 1024 * 1024
      );



    if(tooLarge){

      alert(
        `${tooLarge.name} dépasse 4 Mo.`
      );

      event.target.value="";

      return;

    }



    if(
      photos.length +
      validFiles.length >
      8
    ){

      alert(
        "Maximum 8 photos."
      );

      event.target.value="";

      return;

    }




    try{


      setUploading(true);



      const uploaded =
        await Promise.all(

          validFiles.map(
            file =>
              uploadFile(file)
          )

        );



      const newPhotos =
        uploaded.map(
          image => ({

            id:
              `${image.publicId}-${Date.now()}-${Math.random()}`,

            url:
              image.url,

            publicId:
              image.publicId,

          })

        );



      const combined = [

        ...photos,

        ...newPhotos,

      ];



      setPhotos(
        combined
      );



      if(!coverId && combined.length){

        setCoverId(
          combined[0].id
        );

      }



    }
    catch(error){


      alert(

        error instanceof Error

        ? error.message

        : "Erreur upload"

      );


    }
    finally{


      setUploading(false);

      event.target.value="";

    }


  }





  function removePhoto(
    id:string
  ){


    setPhotos(

      photos.filter(
        photo =>
          photo.id !== id
      )

    );



    if(
      coverId === id
    ){

      const remaining =
        photos.filter(
          photo =>
            photo.id !== id
        );


      setCoverId(

        remaining.length

        ? remaining[0].id

        : null

      );

    }


  }





  const coverIndex =
    photos.findIndex(

      photo =>
        photo.id === coverId

    );





  return (

    <div className="admin-photo-upload">



      <label className="admin-upload-box">


        <div className="admin-upload-icon">

          <ImagePlus size={32}/>

        </div>



        <strong>

          {uploading

          ? "Upload en cours..."

          : title}

        </strong>



        <span>

          Cliquez pour sélectionner vos photos

        </span>



        <small>

          JPG, PNG ou WEBP —
          maximum 8 photos

        </small>



        <input

          type="file"

          accept="image/jpeg,image/png,image/webp"

          multiple

          disabled={uploading}

          onChange={handleImages}

        />


      </label>



      <input

        type="hidden"

        name="images"

        value={
          JSON.stringify(
            photos
          )
        }

        readOnly

      />



      <input

        type="hidden"

        name="coverIndex"

        value={
          coverIndex >= 0
          ? coverIndex
          : 0
        }

        readOnly

      />





      {photos.length > 0 && (


        <div className="admin-selected-images">



          <div className="admin-photo-toolbar">

            <Images size={18}/>


            <strong>

              {photos.length} photo
              {photos.length > 1 ? "s":""}

            </strong>


          </div>




          <div className="admin-photo-preview-grid">


            {photos.map(photo => {


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


                  <img

                    src={photo.url}

                    alt="Photo"

                  />



                  {isCover && (

                    <span className="cover-badge">

                      <Check size={12}/>

                      Photo principale

                    </span>

                  )}




                  <div className="admin-photo-preview-actions">



                    {!isCover && (

                      <button

                        type="button"

                        onClick={() =>
                          setCoverId(photo.id)
                        }

                      >

                        <Star size={14}/>

                        Principale

                      </button>

                    )}




                    <button

                      type="button"

                      onClick={() =>
                        removePhoto(photo.id)
                      }

                    >

                      <Trash2 size={14}/>

                      Supprimer

                    </button>



                  </div>


                </div>


              );


            })}


          </div>


        </div>


      )}



    </div>

  );

}