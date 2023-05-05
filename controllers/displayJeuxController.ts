import Jeu from "../models/jeuxModel";
import { Request, Response } from "express";

export const afficherListeJeux = (req: Request, res: Response) => {
  Jeu.find()
    .then((jeux) => {
      res.render("listGames", { jeux: jeux });
    })
    .catch((err) => {
      console.error(err);
    });
};

export default { afficherListeJeux };
