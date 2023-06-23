import users from "../models/usersModel";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import Session from "../models/sessionsModel";
import passport from "passport";

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
      res.send(200);
    }
  } catch (err) {
    console.error(err);
  }
};

export const login = async (req: Request, res: Response) => {
  let email = req.body.email;
  let password = req.body.password;

  try {
    // Je recherche l'utilisateur dans la base de données par son email
    const user = await users.findOne({ email });

    if (user) {
      // Si je trouve , je vérifie le mot de passe
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Génération d'un id de session unique
        const sessionId = uuidv4();

        // Je stock l'id de session dans la BDD
        const session = new Session({
          sessionId: sessionId,
          userId: user._id,
        });

        await session.save();

        res.json();
      } else {
        // Si mot de passe incorrect
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
