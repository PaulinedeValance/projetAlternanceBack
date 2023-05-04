import express from "express";
import passport from "passport";
import appAdmin from "./models/appAdminModel";
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
    successRedirect: "/game/add",
    failureRedirect: "/login/admin",
    failureFlash: true,
  }),
  (req, res, next) => {
    res.locals.flash = req.flash();
    next();
  }
);

// Nouvelle route qui vérifie l'authentification des admins
// router.post("/login/admin", async (req: any, res: any, next: any) => {
//   passport.authenticate("local", async (err: any, admin: any) => {
//     try {
//       // Récupération des informations de l'admin en base de données
//       const adminFromDB = await appAdmin.findOne({
//         username: req.body.username,
//         password: req.body.password,
//       });

//       // Si l'admin est introuvable ou si le mot de passe est incorrect, renvoyer vers la page de connexion avec un message d'erreur
//       if (!adminFromDB || !admin) {
//         req.flash("failure", "Nom d'utilisateur ou mot de passe incorrect");
//         return res.redirect("/login/admin");
//       }

//       // Si les informations d'authentification sont valides, rediriger vers la page du formulaire de jeux
//       return res.redirect("/game/add");
//     } catch (error) {
//       next(error);
//     }
//   })(req, res, next);
// });

export default router;
