//import mongoose from 'mongoose'

export interface Game {
  //_id: mongoose.Types.ObjectId
  nom: string
  editeur: string
  nbJoueurs: number
  duréePartie: number
  cooperatif: boolean
  categorie: string
}

export interface User {
  id: string
  username: string
  email: string
  password: string
  role: string
}
