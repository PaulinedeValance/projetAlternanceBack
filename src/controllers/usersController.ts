import users from "../models/usersModel";
import { Request, Response } from "express";

// Ajout d'un user dans la BDD
export const addUser = async (req: Request, res: Response) => {
  console.log("Nouvel utilisateur");
  const newUser = new users({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  console.log(req.body);

  try {
    const existingUser = await users.findOne({ username: newUser.username });

    if (existingUser) {
      // Si l'utilisateur existe déjà dans la base de données
      console.log("L'utilisateur existe déjà !");
      res.redirect("/signup");
    } else {
      // Si le user n'existe pas encore dans la base de données
      await newUser.save();
      console.log("L'utilisateur a été ajouté !");
      res.redirect("/login"); // Redirection (à determiner)
    }
  } catch (err) {
    console.error(err);
  }
};

export default { addUser };
