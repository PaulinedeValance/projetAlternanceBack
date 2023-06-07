import gamesController from "./controllers/gamesController";
import displayGamesController from "./controllers/displayGamesController";
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

// Route qui affiche un formulaire pour MODIFIER un jeu
apiRouter.get("/game/edit/:idGame", async (req, res) => {
  const gameId = req.params.idGame;

  try {
    const jeu = await Game.findById(gameId);
    console.log(jeu);

    if (!jeu) {
      req.flash("error", "Le jeu n'a pas été trouvé !");
      return res.redirect("/api/games");
    }
    console.log("ID du jeu :", jeu._id);

    res.render("editGamesForm", { jeu });
  } catch (error) {
    console.error(error);
    req.flash("error", "Une erreur s'est produite lors du chargement du jeu !");
    res.redirect("/api/games");
  }
});

// Route pour modifier un jeu dans la BDD
apiRouter.post("/game/edit/edit-game", gamesController.editGame);

// Route qui gère l'authentification et différentes redirections
apiRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/game/add",
    failureRedirect: "/login/admin",
    failureFlash: true,
  })
);

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
