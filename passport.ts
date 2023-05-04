import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import appAdmin from "./models/appAdminModel";

// passport.use(
//   new LocalStrategy(async function (username, password, done) {
//     try {
//       // Recherche de l'admin dans la bdd
//       console.log(username, password);
//       const admin = await Admin.findOne({
//         username: username,
//         password: password,
//       });
//       console.log(admin);
//       // Si l'admin n'existe pas, renvoie une erreur
//       if (!admin) {
//         return done(null, false, { message: "Nom d'utilisateur incorrect" });
//       }
//       // Si le mot de passe n'a pas été défini, renvoie une erreur
//       if (admin.password === undefined) {
//         return done(null, false, { message: "Mot de passe incorrect" });
//       }
//       // Comparaison du mot de passe entré dans la base de données et le mot de passe fourni
//       const match = await bcrypt.compare(password, admin.password);
//       if (!match) {
//         return done(null, false, { message: "Mot de passe incorrect" });
//       }
//       if (admin) {
//         // Vérifier si admin est défini avant d'appeler done()
//         return done(null, admin);
//       }

//       return done(null, admin);
//     } catch (err) {
//       return done(err);
//     }
//   })
// );

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
      const match = await bcrypt.compare(password, user.password);
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
