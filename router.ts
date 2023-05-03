import express from "express";
import passport from "passport";
const router = express.Router();

// Route qui affiche un formulaire pour ajouter un jeu
router.get("/game/add", (req: any, res: any) => {
  res.render("formGames");
});

// Route qui affiche le formulaire de connexion des admins
router.get("/login/admin", (req: any, res: any) => {
  res.render("connexionAdmin");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

export default router;
