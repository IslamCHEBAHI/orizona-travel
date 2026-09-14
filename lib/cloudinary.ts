import {
  v2 as cloudinary,
  UploadApiResponse,
} from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});


export function uploadCloudinaryImage(
  buffer: Buffer,
  folder: string
): Promise<UploadApiResponse> {

  return new Promise((resolve, reject) => {

    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          unique_filename: true,
          overwrite: false,
          // Optimisation des nouveaux médias dès l'upload : limite la taille
          // des images tout en préservant la qualité visuelle.
          transformation: [
            {
              width: 2200,
              height: 2200,
              crop: "limit",
              quality: "auto:good",
            },
          ],
        },

        (error, result) => {

          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(
              new Error(
                "Cloudinary n'a retourné aucun résultat."
              )
            );
            return;
          }

          resolve(result);
        }
      );

    uploadStream.end(buffer);
  });
}


export async function deleteCloudinaryImage(
  publicId: string
) {
  return cloudinary.uploader.destroy(publicId);
}