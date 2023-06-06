import game from "../models/gamesModel";
import { Request, Response } from "express";

// Ajout d'un jeu
export const addGame = async (req: Request, res: Response) => {
  const newGame = new game({
    nom: req.body.nom,
    editeur: req.body.editeur,
    nbJoueurs: req.body.nbJoueurs,
    dureePartie: req.body.dureePartie,
    cooperatif: req.body.cooperatif,
    categorie: req.body.categorie,
    imageURL: req.body.imageURL,
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
  //console.log("ID du jeu à supprimer :", idGame);

  try {
    await game.findByIdAndRemove(idGame);
    req.flash("success", "Le jeu a été supprimé avec succès !");
    res.redirect("/api/games");
  } catch (err) {
    console.error("error");
  }
};

// Modifier un jeu
export const editGame = async (req: Request, res: Response) => {
  const idGame = req.params.idGame;

  try {
    const jeu = await game.findById(idGame);
    console.log(idGame);

    if (!jeu) {
      console.log("Le jeu n'a pas été trouvé !");
      req.flash("error", "Le jeu n'a pas été trouvé !");
      return res.redirect("/api/games");
    }

    jeu.nom = req.body.nom;
    jeu.editeur = req.body.editeur;
    jeu.nbJoueurs = req.body.nbJoueurs;
    jeu.dureePartie = req.body.dureePartie;
    jeu.cooperatif = req.body.cooperatif;
    jeu.categorie = req.body.categorie;

    await jeu.save();

    console.log("Le jeu a été modifié !");
    req.flash("success", "Le jeu a été modifié avec succès !");
    res.redirect("/api/games");
  } catch (err) {
    console.error(err);
    req.flash(
      "error",
      "Une erreur s'est produite lors de la modification du jeu !"
    );
    res.redirect("/api/games");
  }
};

export default { addGame, deleteGame, editGame };
