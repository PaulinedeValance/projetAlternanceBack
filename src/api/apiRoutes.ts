import { addGame, deleteGame, editGame2, uploadImages } from './gamesController'
import Game from '../models/gamesModel'
import express, { Request, Response } from 'express'
import multer from 'multer'
import passport from 'passport'
import usersController from '../controllers/usersController'
import UserCollection from '../models/userCollectionModel'

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
  await editGame2(req.body, req.params.idGame)
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

// router.get('/users', (req, res) => {
//   // console.log('this is my id', req.session.userId)
// })

// Route pour récupérer les informations de l'utilisateur en fonction de son ID
router.get('/users/:userId', usersController.getUserById)

router.post('/login/user', usersController.login)

// Route qui gère la déconnexion de l'admin
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err)
    }
    // Détruire la session
    req.session.destroy(err => {
      if (err) {
        return next(err)
      }
      res.redirect('/login/admin')
    })
  })
})

// Route qui gère la déconnexion du user
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err)
    }
    req.session.destroy(err => {
      if (err) {
        return next(err)
      }
      res.redirect('/')
    })
  })
})

////////////
/// MEDIA ///
////////////

// Route pour l'upload d'images
router.post('/upload', upload.single('file'), uploadImages)

////////////
/// USER ///
////////////

// Route pour ajouter un user
router.post('/users', usersController.addUser)

export default router
