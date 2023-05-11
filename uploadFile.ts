import * as fs from "fs";
import * as AWS from "aws-sdk";

// Récupération des clés d'accès de l'utilisateur
const IAM_USER_KEY = process.env.AWS_ACCESS_KEY_ID;
const IAM_USER_SECRET = process.env.AWS_SECRET_ACCESS_KEY;

// Création d'une instance de service S3 avec mes clés d'accès
const s3bucket = new AWS.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
});

// Fonction pour transmettre un fichier vers S3
export function uploadToS3(
  fileName: string,
  originalFileName: string
): Promise<any> {
  // Création d'un flux de lecture à partir du fichier local
  const readStream = fs.createReadStream(fileName);

  // Définition des paramètres pour l'opération d'upload
  const params = {
    Bucket: "ludostockage",
    Key: "imagesJeu/" + originalFileName,
    Body: readStream,
  };

  // Retourner une nouvelle promesse pour l'opération d'upload
  return new Promise((resolve, reject) => {
    // Appeler la méthode d'upload de S3 avec les paramètres définis
    s3bucket.upload(params, function (err: any, data: any) {
      // Fermer une fois l'opération terminée
      readStream.destroy();

      if (err) {
        // En cas d'erreur, rejeter la promesse avec l'erreur
        return reject(err);
      }

      // En cas de succès, résoudre la promesse avec les données de réponse
      return resolve(data);
    });
  });
}
