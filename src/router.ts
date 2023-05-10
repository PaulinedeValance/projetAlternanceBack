import express from "express";
import passport from "passport";
import gamesController, { deleteGame } from "./controllers/gamesController";
import displayGamesController from "./controllers/displayGamesController";
import { categories } from "./models/gamesModel";
import { translate } from "./services/translate";

const router = express.Router();

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

export default router;
