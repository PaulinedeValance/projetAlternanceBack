import jeu from "../models/jeuxModel";
import { Request, Response } from "express";

export const ajouterJeu = async (req: Request, res: Response) => {
  console.log(req.body);
  const nouveauJeu = new jeu({
    nom: req.body.nom,
    editeur: req.body.editeur,
    nbJoueurs: req.body.nbJoueurs,
    // dureePartie: req.body.dureePartie,
    // cooperatif: req.body.cooperatif,
    // categorie: req.body.categorie,
  });

  try {
    const jeuExistant = await jeu.findOne({ nom: nouveauJeu.nom });

    if (jeuExistant) {
      // Le jeu existe déjà dans la base de données
      console.log("Le jeu existe déjà !");
      req.flash("error", "Le jeu existe déjà !"); // message flashbag
      res.redirect("/game/add"); // Rediriger vers le formulaire d'ajout de jeu
    } else {
      // Le jeu n'existe pas encore dans la base de données
      await nouveauJeu.save();
      console.log("Le jeu a été ajouté !");
      req.flash("success", "Le jeu a été ajouté avec succès !"); // message flashbag
      res.redirect("/jeux"); // Rediriger l'utilisateur vers la liste des jeux (pas encore créée)
    }
  } catch (err) {
    console.error(err);
  }
};

export default { ajouterJeu };
