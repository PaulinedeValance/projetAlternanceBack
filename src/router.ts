import express from "express";
import passport from "passport";
import gamesController, { deleteGame } from "./controllers/gamesController";
import displayGamesController from "./controllers/displayGamesController";
import { uploadToS3 } from "../uploadFile";
import { categories } from "./models/gamesModel";
import { translate } from "./services/translate";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Route qui affiche le formulaire de connexion des admins
router.get("/login/admin", (req: any, res: any) => {
  const messages = req.flash("error");
  res.render("connexionAdmin", { messages });
});

// Route qui affiche un formulaire pour AJOUTER un jeu
router.get("/game/add", (req: any, res: any) => {
  const tmp: any = [];
  categories.forEach((element: string) => {
    tmp.push({ id: element, name: translate(element) });
  });
  res.render("addGamesForm", { categories: tmp });
});

// Route qui affiche un formulaire pour MODIFIER un jeu
router.get("/game/modify", (req: any, res: any) => {
  res.render("modifyGamesForm");
});

// Route pour SUPPRIMER un jeu
// router.get("/game/delete/:idGame", deleteGame);
router.get("/api/games/:idGame", deleteGame);

// Route qui gère l'authentification et différentes redirections
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/game/add",
    failureRedirect: "/login/admin",
    failureFlash: true,
  })
);

// Route pour ajouter un jeu dans la BDD
router.post("/api/games", gamesController.addGame);

// Route pour modifier un jeu dans la BDD
//router.post("/api/games", jeuxController.modifierJeu);

// Route qui affiche la liste des jeux rentrées dans la BDD
router.get("/api/games", displayGamesController.displayGamesList);

// Route pour l'upload
router.post("/api/upload", upload.single("file"), (req, res) => {
  // Vérification si req.file existe et est défini
  if (req.file) {
    // Accéder au fichier téléchargé via req.file
    const file = req.file;

    // Utilisation de la fonction uploadToS3 pour envoyer le fichier vers S3
    uploadToS3(file.path, req.file.originalname)
      .then((result) => {
        // Gestion de la réussite de l'upload
        res.send("Upload réussi !");
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

export default router;
