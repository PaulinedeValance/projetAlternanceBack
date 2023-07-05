import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const appAdminSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// Fonction de hachage du mot de passe avant de sauvegarder l'administrateur
appAdminSchema.pre("save", function (next) {
  const admin = this;

  // Vérifier si le mot de passe a été modifié ou si c'est une nouvelle entrée
  if (!admin.isModified("password")) {
    return next();
  }

  // Générer un sel pour le hachage du mot de passe
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }

    // Hacher le mot de passe avec le sel généré
    bcrypt.hash(admin.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }

      // Remplacer le mot de passe en clair par le mot de passe hashé
      admin.password = hash;
      next();
    });
  });
});

const appAdmin = mongoose.model("appAdmin", appAdminSchema);

export default appAdmin;
