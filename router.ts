import express from "express";
import passport from "passport";
import jeuxController from "./controllers/jeuxController";
import displayJeuxController from "./controllers/displayJeuxController";
const router = express.Router();

// Route qui affiche un formulaire pour ajouter un jeu
router.get("/game/add", (req: any, res: any) => {
  res.render("formGames");
});

// Route qui affiche le formulaire de connexion des admins
router.get("/login/admin", (req: any, res: any) => {
  const messages = req.flash("error");
  res.render("connexionAdmin", { messages });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/game/add",
    failureRedirect: "/login/admin",
    failureFlash: true,
  })
);

router.post("/ajouter-jeu", jeuxController.ajouterJeu);

// Route qui affiche la liste des jeux rentrées dans la BDD
router.get("/jeux", displayJeuxController.afficherListeJeux);

export default router;
