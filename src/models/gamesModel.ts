import mongoose from "mongoose";

export const categories = [
  "stratégie",
  "famille",
  "party game",
  "enfant",
  "coopératif",
  "deck-building",
  "cartes",
  "roll&write",
];

const gameSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    editeur: {
      type: String,
      required: true,
    },
    nbJoueurs: {
      type: Number,
      required: true,
    },
    dureePartie: {
      type: Number,
      required: true,
    },
    cooperatif: {
      type: String,
      enum: ["oui", "non"],
      default: "oui",
      required: true,
    },
    categorie: {
      type: String,
      enum: categories,
      default: categories[0],
      required: true,
    },
    imageURL: String,
  },
  { collection: "jeux" }
);

const Game = mongoose.model("Jeu", gameSchema);

export default Game;
