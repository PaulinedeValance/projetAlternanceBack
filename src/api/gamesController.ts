import { uploadToS3 } from "../../uploadFile";
import game from "../models/gamesModel";
import { Request, Response } from "express";

export const addGame = async (gameObject: any): Promise<Boolean> => {
  const newGame = new game(gameObject);

  try {
    const existingGame = await game.findOne({ nom: newGame.nom });
    if (existingGame) {
      return true;
    } else {
      await newGame.save();
      return false;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Supprime un jeu de la base de données
 * @param gameId
 */
export const deleteGame = async (gameId: string) => {
  try {
    await game.findByIdAndRemove(gameId);
  } catch (err) {
    console.error("error suppression");
    throw err;
  }
};

export const editGame = async (req: Request, res: Response) => {
  const idGame = req.params.idGame;

  try {
    const newGame = await game.findById(idGame);

    if (!newGame) {
      return res.redirect("/api/games");
    }

    newGame.nom = req.body.nom;
    newGame.editeur = req.body.editeur;
    // jeu.nbJoueurs = req.body.nbJoueurs;
    // jeu.dureePartie = req.body.dureePartie;
    // jeu.cooperatif = req.body.cooperatif;
    newGame.categorie = req.body.categorie;

    await newGame.save();
    return res.status(200).send("");
  } catch (err) {
    console.error(err);
    res.redirect("/api/games");
  }
};

// Rechercher un jeu
export const searchGames = async (req: Request, res: Response) => {
  const searchQuery = req.query.query;

  try {
    const games = await game.find({
      $or: [
        { nom: { $regex: searchQuery, $options: "i" } }, // Recherche par nom (insensible à la casse)
        { editeur: { $regex: searchQuery, $options: "i" } }, // Recherche par éditeur
      ],
    });

    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Une erreur s'est produite lors de la recherche des jeux.",
    });
  }
};

export function uploadImages(req: Request, res: Response) {
  console.log(req);
  // Vérification si req.file existe et est défini
  if (req.file) {
    // Accéder au fichier téléchargé via req.file
    const file = req.file;

    // Utilisation de la fonction uploadToS3 pour envoyer le fichier vers S3
    uploadToS3(file.path, req.file.originalname)
      .then((result) => {
        // Je récupère l'URL du fichier téléchargé depuis le résultat
        const fileUrl = result.Location;
        // Envoi un objet Json avec la propriété fileUrl
        res.json({ fileUrl });
      })
      .catch((error) => {
        // Gestion des erreurs lors de l'upload
        res.status(500).send("Erreur lors de l'upload : " + error);
      });
  } else {
    // Aucun fichier téléchargé, gestion de l'erreur
    res.status(400).send("Aucun fichier téléchargé !");
  }
}

export default { deleteGame, editGame, searchGames };
