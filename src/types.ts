import { ObjectId } from 'mongodb'

export interface Game {
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

declare global {
  namespace Express {
    interface User {
      _id: ObjectId
      username: string
      email: string
      password: string
      role: string
    }
  }
}
