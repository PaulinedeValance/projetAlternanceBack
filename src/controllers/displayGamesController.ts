import Game from '../models/gamesModel'
import { Request, Response } from 'express'

// Le controlleur affiche la liste des jeux rentrés dans ma BDD
export const displayGamesList = (req: Request, res: Response) => {
  // Récupération des jeux
  Game.find()
    .then(jeux => {
      // rendus des jeux par listGames (ma vue)
      res.render('listGames', { jeux: jeux })
    })
    .catch(err => {
      console.error(err)
    })
}

export default { displayGamesList }
