import UserGamesWishlist from '../models/userGamesWishlistModel'
import { Request, Response } from 'express'
import Game from '../models/gamesModel'

export async function addToWishlist(req: Request, res: Response) {
  // const userId = req.body.userId // ID de l'utilisateur connecté
  // const gameId = req.body.gameId // ID du jeu à ajouter dans la ludothèque du User
  const { userId, gameId } = req.body

  try {
    // J'effectue une mise à jour ou une insertion dans la collection UserGamesWishlist dans ma BDD
    const userWishlist = await UserGamesWishlist.findOneAndUpdate(
      { userId },
      // Mise à jour : j'ajoute gameId au tableau games
      { $addToSet: { games: gameId } },
      // Je renvoye le document mis à jour ou je crée un nouveau document si il est introuvable
      { new: true, upsert: true }
    )

    //  La réponse avec le document mis à jour ou le nouveau document créé
    res.status(200).json(userWishlist)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la wishlist utilisateur:', error)
    res.status(500).json({ error: 'La mise à jour a échoué' })
  }
}

export async function getUserWishlist(req: Request, res: Response) {
  const userId = req.params.userId

  try {
    // Je récupère la wishlist de jeux du user en utilisant le userId
    const userWishlist = await UserGamesWishlist.findOne({ userId }).populate('games')

    if (!userWishlist) {
      return res.status(404).json({ message: 'wishlist pas trouvé' })
    }

    // Obtenez les détails complets des jeux en utilisant leurs IDs
    const gameIds = userWishlist.games.map((game: any) => game._id)

    const games = await Game.find({ _id: { $in: gameIds } })

    res.status(200).json({ games })
  } catch (error) {
    console.error('Error fetching user wishlist:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function removeFromWishlist(req: Request, res: Response) {
  // const userId = req.params.userId
  // const gameId = req.params.gameId
  const { userId, gameId } = req.params

  try {
    // Je retire le jeu de la ludothèque du user avec $pull
    const userWishlist = await UserGamesWishlist.findOneAndUpdate(
      { userId },
      { $pull: { games: gameId } },
      { new: true }
    )

    if (!userWishlist) {
      return res.status(404).json({ message: 'Wishlist introuvable' })
    }

    // wishlist du user mise à jour
    res.status(200).json(userWishlist)
  } catch (error) {
    console.error('Erreur lors de la suppression du jeu de la wishlist', error)
    res.status(500).json({ error: 'La suppression a échoué' })
  }
}

export default { addToWishlist, getUserWishlist, removeFromWishlist }
