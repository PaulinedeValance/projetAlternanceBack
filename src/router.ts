import express from "express";
import passport from "passport";
import jeuxController from "./controllers/jeuxController";
import { supprimerJeu } from "./controllers/jeuxController";
import displayJeuxController from "./controllers/displayJeuxController";
const router = express.Router();

// Route qui affiche le formulaire de connexion des admins
router.get("/login/admin", (req: any, res: any) => {
  const messages = req.flash("error");
  res.render("connexionAdmin", { messages });
});

// Route qui affiche un formulaire pour AJOUTER un jeu
router.get("/game/add", (req: any, res: any) => {
  res.render("addGamesForm");
});

// Route qui affiche un formulaire pour MODIFIER un jeu
router.get("/game/modify", (req: any, res: any) => {
  res.render("modifyGamesForm");
});

// Route pour SUPPRIMER un jeu
router.get("/game/delete/:jeuId", supprimerJeu);

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
router.post("/ajouter-jeu", jeuxController.ajouterJeu);

// Route pour modifier un jeu dans la BDD
//router.post("/modifier-jeu", jeuxController.modifierJeu);

// Route qui affiche la liste des jeux rentrées dans la BDD
router.get("/jeux", displayJeuxController.afficherListeJeux);

export default router;
