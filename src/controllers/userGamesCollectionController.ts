import UserGamesCollection from '../models/userGamesCollectionModel'
import { Request, Response } from 'express'
import Game from '../models/gamesModel'

export async function addToCollection(req: Request, res: Response) {
  // const userId = req.body.userId // ID de l'utilisateur connecté
  // const gameId = req.body.gameId // ID du jeu à ajouter dans la ludothèque du User
  const { userId, gameId } = req.body

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

export async function getUserCollection(req: Request, res: Response) {
  const userId = req.params.userId

  try {
    // Je récupère la collection de jeux du user en utilisant le userId
    const userCollection = await UserGamesCollection.findOne({ userId }).populate('games')

    if (!userCollection) {
      return res.status(404).json({ message: 'collection pas trouvé' })
    }

    // Obtenez les détails complets des jeux en utilisant leurs IDs
    const gameIds = userCollection.games.map((game: any) => game._id)

    const games = await Game.find({ _id: { $in: gameIds } })

    res.status(200).json({ games })
  } catch (error) {
    console.error('Error fetching user collection:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function removeFromCollection(req: Request, res: Response) {
  // const userId = req.params.userId
  // const gameId = req.params.gameId
  const { userId, gameId } = req.params

  try {
    // Je retire le jeu de la ludothèque du user avec $pull
    const userCollection = await UserGamesCollection.findOneAndUpdate(
      { userId },
      { $pull: { games: gameId } },
      { new: true }
    )

    if (!userCollection) {
      return res.status(404).json({ message: 'Collection introuvable' })
    }

    // Collection du user mise à jour
    res.status(200).json(userCollection)
  } catch (error) {
    console.error('Erreur lors de la suppression du jeu de la collection', error)
    res.status(500).json({ error: 'La suppression a échoué' })
  }
}

export default { addToCollection, getUserCollection, removeFromCollection }
