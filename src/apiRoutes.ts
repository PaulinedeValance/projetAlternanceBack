import gamesController, { uploadImages } from "./controllers/gamesController";
import Game from "./models/gamesModel";
import express, { Request, Response, Router } from "express";
//import { uploadToS3 } from "../uploadFile";
import multer from "multer";
import passport from "passport";
import usersController from "./controllers/usersController";

const apiRouter = express.Router();
const upload = multer({ dest: "uploads/" });

apiRouter.delete("/games/:idGame", gamesController.deleteGame);

// Route pour ajouter un jeu dans la BDD
apiRouter.post("/games", gamesController.addGame);

// Route pour modifier un jeu dans la BDD
apiRouter.put("/game/:idGame", gamesController.editGame);

// Route qui gère l'authentification et différentes redirections
apiRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/game/add",
    failureRedirect: "/login/admin",
    failureFlash: true,
  })
);

// Route pour récupérer tous les jeux
apiRouter.get("/games", async (req, res) => {
  // console.log("games", req.session.userId);
  // if (!req.session.userId) {
  // }
  const games = await Game.find();
  return res.json(games);
});

// Route pour l'upload d'images
apiRouter.post("/upload", upload.single("file"), uploadImages);

// Route pour ajouter un user
apiRouter.post("/users", usersController.addUser);

apiRouter.post("/login/user", usersController.login);

export default apiRouter;
