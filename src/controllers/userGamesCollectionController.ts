import UserGamesCollection from '../models/userGamesCollectionModel'
import { Request, Response } from 'express'
import Game from '../models/gamesModel'

export async function addToCollection(req: Request, res: Response) {
  const userId = req.body.userId // ID de l'utilisateur connecté
  const gameId = req.body.gameId // ID du jeu à ajouter dans la ludothèque du User

  try {
    // J'effectue une mise à jour ou une insertion dans la collection UserGamesCollection dans ma BDD
    const userCollection = await UserGamesCollection.findOneAndUpdate(
      { userId },
      // Mise à jour : j'ajoute gameId au tableau games
      { $addToSet: { games: gameId } },
      // Je renvoye le document mis à jour ou je crée un nouveau document si il est introuvable
      { new: true, upsert: true }
    )

    //  La réponse avec le document mis à jour ou le nouveau document créé
    res.status(200).json(userCollection)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la collection utilisateur:', error)
    res.status(500).json({ error: 'La mise à jour a échoué' })
  }
}

// export function getUserCollection(req: Request, res: Response) {
//   const userId = req.params.userId

//   // Je récupère la collection de jeux du user en utilisant le userId
//   const userCollection = UserGamesCollection.findOne({ userId }).populate('games')
//   console.log(userCollection)

//   const gameIds = userCollection.games.map(game => game._id);
//   const games = Game.find({ _id: { $in: gameIds } }).exec();

//   res.status(200).json()
// }

export async function getUserCollection(req: Request, res: Response) {
  const userId = req.params.userId

  try {
    console.log('1')

    // Je récupère la collection de jeux du user en utilisant le userId
    const userCollection = await UserGamesCollection.findOne({ userId }).populate('games')
    console.log('collection user', userCollection)
    console.log('2')

    if (!userCollection) {
      return res.status(404).json({ message: 'collection pas trouvé' })
    }

    // Obtenez les détails complets des jeux en utilisant leurs IDs
    const gameIds = userCollection.games.map((game: any) => game._id)
    console.log('jeux:', gameIds)

    const games = await Game.find({ _id: { $in: gameIds } })

    console.log(games)

    res.status(200).json({ games })
  } catch (error) {
    console.error('Error fetching user collection:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default { addToCollection, getUserCollection }
