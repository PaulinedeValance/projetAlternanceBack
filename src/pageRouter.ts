import express from "express";
import passport from "passport";
import { categories } from "./models/gamesModel";
import { translate } from "./services/translate";
import displayGamesController from "./controllers/displayGamesController";
import gamesController from "./api/gamesController";
import requireAdmin from "./middleware/requireAdmin";

const pageRouter = express.Router();

// Route qui affiche le formulaire de connexion des admins
pageRouter.get("/login/admin", (req: any, res: any) => {
  const messages = req.flash("error");
  res.render("connexionAdmin", { messages });
}); 

// Route qui affiche un formulaire pour AJOUTER un jeu
pageRouter.get("/game/add", requireAdmin, (req: any, res: any) => {
  const tmp: any = [];
  categories.forEach((element: string) => {
    tmp.push({ id: element, name: translate(element) });
  });
  res.render("addGamesForm", { categories: tmp });
});

pageRouter.get("/games/search", gamesController.searchGames);

// Route qui affiche la liste des jeux rentrés dans la BDD
pageRouter.get("/games", requireAdmin, displayGamesController.displayGamesList);

export default pageRouter;
