import game from "../models/gamesModel";
import { Request, Response } from "express";

// Ajout d'un jeu
export const addGame = async (req: Request, res: Response) => {
  //console.log(req.body);
  const newGame = new game({
    nom: req.body.nom,
    editeur: req.body.editeur,
    nbJoueurs: req.body.nbJoueurs,
    dureePartie: req.body.dureePartie,
    cooperatif: req.body.cooperatif,
    categorie: req.body.categorie,
  });

  try {
    const existingGame = await game.findOne({ nom: newGame.nom });

    if (existingGame) {
      // Le jeu existe déjà dans la base de données
      console.log("Le jeu existe déjà !");
      req.flash("error", "Le jeu existe déjà !"); // message flashbag
      res.redirect("/game/add"); // Rediriger vers le formulaire d'ajout de jeu
    } else {
      // Le jeu n'existe pas encore dans la base de données
      await newGame.save();
      console.log("Le jeu a été ajouté !");
      req.flash("success", "Le jeu a été ajouté avec succès !"); // message flashbag
      res.redirect("/api/games"); // Rediriger l'utilisateur vers la liste des jeux
    }
  } catch (err) {
    console.error(err);
  }
};

// Suppresion d'un jeu
export const deleteGame = async (req: Request, res: Response) => {
  const idGame = req.params.idGame;

  try {
    await game.findByIdAndRemove(idGame);
    console.log("Le jeu a été supprimé !");
    req.flash("success", "Le jeu a été supprimé avec succès !");
    res.redirect("/api/games");
  } catch (err) {
    console.error("error");
  }
};

export default { addGame, deleteGame };
