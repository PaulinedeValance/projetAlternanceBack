import Jeu from "../models/gamesModel";
import { Request, Response } from "express";

// Mon controlleur affiche la liste des jeux rentrés dans ma BDD
export const afficherListeJeux = (req: Request, res: Response) => {
  // Récupération des jeux
  Jeu.find()
    .then((jeux) => {
      // rendus des jeux par listGames (ma vue)
      res.render("listGames", { jeux: jeux });
    })
    .catch((err) => {
      console.error(err);
    });
};

export default { afficherListeJeux };
