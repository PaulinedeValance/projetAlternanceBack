import mongoose from 'mongoose'

export const categories = [
  'stratégie',
  'famille',
  'party game',
  'enfant',
  'deck-building',
  'cartes',
  'roll&write',
]

const gameSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: false,
    },
    editeur: {
      type: String,
      required: false,
    },
    nbJoueurs: {
      type: mongoose.Schema.Types.Mixed, // nbJoueurs peut stocker des nombres et des strings
      required: false,
    },
    dureePartie: {
      type: Number,
      required: false,
    },
    cooperatif: {
      type: String,
      enum: ['oui', 'non'],
      default: 'oui',
      required: false,
    },
    categorie: {
      type: String,
      enum: categories,
      default: categories[0],
      required: false,
    },
    imageURL: String,

    description: {
      type: String,
      required: false,
    },
  },
  { collection: 'jeux' }
)

const Game = mongoose.model('Jeu', gameSchema)

export default Game
