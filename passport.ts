import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { Admin } from "./models/adminModel";

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      // Recherche de l'admin dans la bdd
      const admin = await Admin.findOne({ username: username });
      // Si l'admin n'existe pas, renvoie une erreur
      if (!admin) {
        return done(null, false, { message: "Nom d'utilisateur incorrect" });
      }
      // Si le mot de passe n'a pas été défini, renvoie une erreur
      if (admin.password === undefined) {
        return done(null, false, { message: "Mot de passe incorrect" });
      }
      // Comparaison du mot de passe entré dans la base de données et le mot de passe fourni
      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        return done(null, false, { message: "Mot de passe incorrect" });
      }
      if (admin) {
        // Vérifier si admin est défini avant d'appeler done()
        return done(null, admin);
      }

      return done(null, admin);
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
    const admin = await Admin.findById(id);
    done(null, admin);
  } catch (err) {
    done(err);
  }
});

export default passport;
