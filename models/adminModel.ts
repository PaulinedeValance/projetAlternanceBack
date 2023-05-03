import mongoose from "mongoose";

// Création du schéma pour la collection admin
const adminSchema = new mongoose.Schema({
  username: { type: String, require: true },
  password: { type: String, require: true },
});

// Exportation du modèle correspondant au schéma
export const Admin = mongoose.model("adminModel", adminSchema);
