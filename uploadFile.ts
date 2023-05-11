import * as fs from "fs";
import * as AWS from "aws-sdk";
import * as path from "path";

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
  // Création d'une string aléatoire avec des chiffres et lettres de 8 caractères
  const randomString = Math.random().toString(36).slice(2, 10);
  // Création d'un flux de lecture à partir du fichier local
  const readStream = fs.createReadStream(fileName);

  // J'obtient l'extension du fichier
  const fileExtension = path.extname(originalFileName);
  // J'obtient le nom du fichier sans l'extension
  const fileNameWithoutExtension = path.basename(
    originalFileName,
    fileExtension
  );
  // concaténation pour obtenir le nom du fichier puis la string aléatoire et enfin l'extension de mon fichier
  const newFileName = `${fileNameWithoutExtension}-${randomString}${fileExtension}`;

  // Définition des paramètres pour l'opération d'upload
  const params = {
    Bucket: "ludostockage",
    Key: `imagesJeu/${newFileName}`,
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
