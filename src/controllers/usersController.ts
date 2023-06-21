import users from "../models/usersModel";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

// Ajout d'un user dans la BDD
export const addUser = async (req: Request, res: Response) => {
  const newUser = new users({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const existingUser = await users.findOne({ username: newUser.username });

    if (existingUser) {
      // Si l'utilisateur existe déjà dans la base de données
      console.log("L'utilisateur existe déjà !");
      // res.redirect("/signup");
    } else {
      // Si le user n'existe pas encore dans la base de données
      // Hachage de son mot de passe en BDD
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      newUser.password = hashedPassword;

      await newUser.save();
      console.log("L'utilisateur a été ajouté !");
      // res.redirect("/login"); // Redirection (à determiner)
    }
  } catch (err) {
    console.error(err);
  }
};

export const login = async (req: Request, res: Response) => {
  let email = req.body.email;
  let password = req.body.password;
  console.log("here");

  try {
    // Je recherche l'utilisateur dans la base de données par son email
    const user = await users.findOne({ email });
    console.log("here again");
    if (user) {
      // Si je trouve , je vérifie le mot de passe
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Si les infos match
        return res.status(200).json({ user }); // Réponse HTTP 200 (OK)
      } else {
        // Mot de passe incorrect
        res.sendStatus(401); // Réponse HTTP 401
      }
    } else {
      // User non trouvé
      res.sendStatus(401); // Réponse HTTP 401
    }
  } catch (error) {
    console.log("Erreur lors de la connexion :", error);
    res.sendStatus(500);
  }
};

export default { addUser, login };
