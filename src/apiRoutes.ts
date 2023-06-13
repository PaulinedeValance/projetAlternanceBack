import gamesController from "./controllers/gamesController";
import Game from "./models/gamesModel";
import express, { Request, Response, Router } from "express";
import { uploadToS3 } from "../uploadFile";
import multer from "multer";
import passport from "passport";

const apiRouter = express.Router();
const upload = multer({ dest: "uploads/" });

// Route pour supprimer un jeu
apiRouter.delete("/games/:idGame", (req, res) => {
  const idGame = req.params.idGame;
  gamesController.deleteGame(req, res);
  res.json();
});

// Route pour ajouter un jeu dans la BDD
apiRouter.post("/games", gamesController.addGame);

// Route pour modifier un jeu dans la BDD
apiRouter.post("/game/edit/:idGame", gamesController.editGame);

// Route qui gère l'authentification et différentes redirections
apiRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/game/add",
    failureRedirect: "/login/admin",
    failureFlash: true,
  })
);

// Route pour récupérer tous les jeux
apiRouter.get("/games", async (req, res) => {
  const games = await Game.find();
  return res.json(games);
});

// Route pour l'upload
apiRouter.post("/api/upload", upload.single("file"), (req, res) => {
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
});

export default apiRouter;
