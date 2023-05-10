import mongoose from "mongoose";

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
      enum: [
        "stratégie",
        "famille",
        "partyGame",
        "enfant",
        "coopératif",
        "deck-building",
        "cartes",
        "roll&write",
      ],
      default: "stratégie",
      required: true,
    },
  },
  { collection: "jeux" }
);

const Game = mongoose.model("Jeu", gameSchema);

export default Game;
