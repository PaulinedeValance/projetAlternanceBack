import express from "express";
import passport from "passport";
import { categories } from "./models/gamesModel";
import { translate } from "./services/translate";
//import gamesController from "./controllers/gamesController";
import displayGamesController from "./controllers/displayGamesController";

const pageRouter = express.Router();

// Route qui affiche le formulaire de connexion des admins
pageRouter.get("/login/admin", (req: any, res: any) => {
  const messages = req.flash("error");
  res.render("connexionAdmin", { messages });
});

// Route qui affiche un formulaire pour AJOUTER un jeu
pageRouter.get("/game/add", (req: any, res: any) => {
  const tmp: any = [];
  categories.forEach((element: string) => {
    tmp.push({ id: element, name: translate(element) });
  });
  res.render("addGamesForm", { categories: tmp });
});

// Route qui affiche la liste des jeux rentrés dans la BDD
pageRouter.get("/games", displayGamesController.displayGamesList);

export default pageRouter;
