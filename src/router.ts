import express from "express";
import passport from "passport";
import { categories } from "./models/gamesModel";
import { translate } from "./services/translate";

const router = express.Router();

// Route qui affiche le formulaire de connexion des admins
router.get("/login/admin", (req: any, res: any) => {
  const messages = req.flash("error");
  res.render("connexionAdmin", { messages });
});

// Route qui affiche un formulaire pour AJOUTER un jeu
router.get("/game/add", (req: any, res: any) => {
  const tmp: any = [];
  categories.forEach((element: string) => {
    tmp.push({ id: element, name: translate(element) });
  });
  res.render("addGamesForm", { categories: tmp });
});

//Route pour MODIFIER un jeu
// router.get("/game/edit/:id", (req, res) => {
//   const gameId = req.params.id;
//   res.render("editGamesForm", { jeu: editGame });
// });

//Route pour SUPPRIMER un jeu
// router.get("/api/games/:idGame",(req: Request, res: Response) => {
//   const idGame = req.params.idGame;

//   try {
//     await game.findByIdAndRemove(idGame);
//     console.log("Le jeu a été supprimé !");
//     req.flash("success", "Le jeu a été supprimé avec succès !");
//     res.redirect("/api/games");
//   } catch (err) {
//     console.error("error");
//   }
// };);

// router.get("/api/games/:idGame", async (req: Request, res: Response) => {
//   const idGame = req.params.idGame;

// Route qui gère l'authentification et différentes redirections
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/game/add",
    failureRedirect: "/login/admin",
    failureFlash: true,
  })
);

export default router;
