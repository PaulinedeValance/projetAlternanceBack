import { addGame, deleteGame, editGame, uploadImages } from './gamesController'
import Game from '../models/gamesModel'
import express, { Request, Response } from 'express'
import multer from 'multer'
import passport from 'passport'
import usersController from '../controllers/usersController'
import userGamesCollectionController from '../controllers/userGamesCollectionController'
import userGamesWishlistController from '../controllers/userGamesWishlistController'
import logoutController from './logoutController'
import User from '../models/usersModel'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

////////////
/// GAME ///
////////////

// Route pour récupérer tous les jeux
router.get('/games', async (req, res) => {
  const games = await Game.find().select(['nom', 'imageURL'])
  return res.json(games)
})

router.get('/games/:id', async (req, res) => {
  const games = await Game.find({ _id: req.params.id })
  return res.json(games[0])
})

// Route pour ajouter un jeu dans la BDD
router.post('/games', async (req: Request, res: Response) => {
  const isNewGame = await addGame(req.body)
  if (isNewGame) {
    res.redirect('/game/add')
  } else {
    res.redirect('/games')
  }
})

// Route pour modifier un jeu dans la BDD

router.put('/game/:idGame', async (req: Request, res: Response) => {
  await editGame(req.body, req.params.idGame)
  return res.json()
})

// Route pour supprimer un jeu dans la BDD
router.delete('/games/:idGame', async (req: Request, res: Response) => {
  await deleteGame(req.params.idGame)
  res.json()
})

////////////
/// AUTH ///
////////////

// Route qui gère l'authentification et différentes redirections
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/game/add',
    failureRedirect: '/login/admin',
    failureFlash: true,
  })
)

// Route qui gère la connexion du USER
router.post('/login/user', usersController.login)

// Route pour l'authentification des utilisateurs normaux avec PASSPORT --- échec pour le moment
// router.post(
//   '/login/user',
//   passport.authenticate('local', {
//     successRedirect: '/dashboard', // Rediriger vers le tableau de bord de l'utilisateur
//     failureRedirect: '/login/user', // Rediriger vers la page de connexion en cas d'échec
//     failureFlash: true,
//   })
// )

// Route qui gère la déconnexion de l'admin
router.get('/logout', logoutController.logout)

////////////
/// MEDIA ///
////////////

// Route pour l'upload d'images
router.post('/upload', upload.single('file'), uploadImages)

////////////
/// USER ///
////////////

// Route pour récupérer les informations de l'utilisateur en fonction de son ID
router.get('/users/:userId', usersController.getUserById)

// Route pour ajouter un user
router.post('/users', usersController.addUser)

// router.get('/userdata/:userId', async (req, res) => {
//   const userId = req.params.userId // Récupérez l'ID de l'utilisateur depuis les paramètres de l'URL

//   try {
//     const userData = await User.findById(userId).select(['username', 'email', 'id']) // Récupérez les données de l'utilisateur par son ID

//     if (!userData) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' })
//     }

//     res.json(userData) // Renvoyez les données de l'utilisateur au format JSON
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ message: "Erreur lors de la récupération des informations de l'utilisateur" })
//   }
// })

router.get('/userdata', async (req, res) => {
  const userId = req.session.userId
  console.log('test :', userId)

  if (!userId) {
    return res.status(401).json({ message: 'Utilisateur non authentifié' })
  }

  try {
    // Chargement des données de l'utilisateur depuis la base de données
    const userData = await User.findById(userId)

    if (!userData) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' })
    }

    // Réponse avec les données de l'utilisateur
    res.json(userData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erreur lors de la récupération des données de l'utilisateur" })
  }
})

//////////////////
/// COLLECTION ///
/////////////////

// Route pour obtenir la collection de jeux d'un utilisateur
router.get('/user/collection/:userId', userGamesCollectionController.getUserCollection)

// Route pour ajouter un jeu dans la ludothèque d'un user
router.post('/collection', userGamesCollectionController.addToCollection)

// Route pour supprimer un jeu dans la ludothèque d'un user
router.delete('/user/collection/:userId/:gameId', userGamesCollectionController.removeFromCollection)

////////////////
/// WISHLIST ///
///////////////

// Route pour obtenir la wishlist de jeux d'un utilisateur
router.get('/user/wishlist/:userId', userGamesWishlistController.getUserWishlist)

// Route pour ajouter un jeu dans la wishlist d'un user
router.post('/wishlist', userGamesWishlistController.addToWishlist)

// Route pour supprimer un jeu dans la wishlist d'un user
router.delete('/user/wishlist/:userId/:gameId', userGamesWishlistController.removeFromWishlist)

export default router
