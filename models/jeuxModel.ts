import mongoose from "mongoose";

const jeuSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    prix: {
      type: Number,
      required: true,
    },
  },
  { collection: "jeux" }
);

const Jeu = mongoose.model("Jeu", jeuSchema);

export default Jeu;
