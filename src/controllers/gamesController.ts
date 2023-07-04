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
      // Si le jeu existe déjà dans la base de données
      console.log("Le jeu existe déjà !");
      res.redirect("/game/add"); // Rediriger vers le formulaire d'ajout de jeu
    } else {
      // Le jeu n'existe pas encore dans la base de données
      await newGame.save();
      console.log("Le jeu a été ajouté !");
      res.redirect("/games"); // Rediriger l'utilisateur vers la liste des jeux
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

    res.json();
  } catch (err) {
    console.error("error suppression");
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
      return res.redirect("/api/games");
    }

    jeu.nom = req.body.nom;
    jeu.editeur = req.body.editeur;
    // jeu.nbJoueurs = req.body.nbJoueurs;
    // jeu.dureePartie = req.body.dureePartie;
    // jeu.cooperatif = req.body.cooperatif;
    jeu.categorie = req.body.categorie;

    await jeu.save();

    console.log("Le jeu a été modifié !");
    return res.status(200).send("");
  } catch (err) {
    console.error(err);
    res.redirect("/api/games");
  }
};

// Rechercher un jeu
export const searchGames = async (req: Request, res: Response) => {
  const searchQuery = req.query.query;

  try {
    const games = await game.find({
      $or: [
        { nom: { $regex: searchQuery, $options: "i" } }, // Recherche par nom (insensible à la casse)
        { editeur: { $regex: searchQuery, $options: "i" } }, // Recherche par éditeur
      ],
    });

    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Une erreur s'est produite lors de la recherche des jeux.",
    });
  }
};

export default { addGame, deleteGame, editGame, searchGames };
