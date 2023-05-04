import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import appAdmin from "./models/appAdminModel";

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      // Recherche de l'utilisateur dans la bdd
      const user = await appAdmin.findOne({
        username: username,
      });

      // Si l'utilisateur n'existe pas, renvoie une erreur
      if (!user) {
        return done(null, false, { message: "Nom d'utilisateur incorrect" });
      }
      // Comparaison du mot de passe entré dans la base de données et le mot de passe fourni
      if (password !== user.password) {
        return done(null, false, { message: "Mot de passe incorrect" });
      }

      const match = password === user.password;
      //console.log("match:", match);
      if (!match) {
        return done(null, false, { message: "Mot de passe incorrect" });
      }

      // Si tout est ok, retourne l'utilisateur
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, JSON.stringify(user));
});

passport.deserializeUser(async (id, done) => {
  try {
    const admin = await appAdmin.findById(id);
    done(null, admin);
  } catch (err) {
    done(err);
  }
});

export default passport;
