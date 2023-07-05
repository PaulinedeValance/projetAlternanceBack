export interface Game {
  nom: string;
  editeur: string;
  nbJoueurs: number;
  duréePartie: number;
  cooperatif: boolean;
  categorie: string;
}

export interface User {
  username: string;
  email: string;
  password: string;
  role: string;
}
