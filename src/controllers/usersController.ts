import users from '../models/usersModel'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

// Ajout d'un user dans la BDD
export const addUser = async (req: Request, res: Response) => {
  const newUser = new users({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })

  try {
    const existingUser = await users.findOne({ username: newUser.username })

    if (existingUser) {
      // Si l'utilisateur existe déjà dans la base de données
      console.log("L'utilisateur existe déjà !")
      // res.redirect("/signup");
    } else {
      // Si le user n'existe pas encore dans la base de données
      // Hachage de son mot de passe en BDD
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      newUser.password = hashedPassword

      await newUser.save()
      //res.send(200);
      res.sendStatus(200)
      console.log("L'utilisateur a été ajouté !")
    }
  } catch (err) {
    console.error(err)
  }
}

export const login = async (req: Request, res: Response) => {
  let email = req.body.email
  let password = req.body.password

  try {
    // Je recherche l'utilisateur dans la base de données par son email
    const user = await users.findOne({ email })

    if (user) {
      // Si je trouve , je vérifie le mot de passe
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (passwordMatch) {
        req.session.userId = user.id
        req.session.save()
        console.log('login', req.session)
        res.json(user)
      } else {
        // Si mot de passe incorrect
        res.sendStatus(401) // Réponse HTTP 401
      }
    } else {
      // User non trouvé
      res.sendStatus(401) // Réponse HTTP 401
    }
  } catch (error) {
    console.log('Erreur lors de la connexion :', error)
    res.sendStatus(500)
  }
}

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId

  try {
    const user = await users.findById(userId)

    if (user) {
      // Si l'utilisateur est trouvé, on renvoi ses infos
      res.json({
        id: user._id,
        username: user.username,
        email: user.email,
      })
    } else {
      // Si l'utilisateur n'est pas trouvé, renvoyez une erreur 404
      res.status(404).json({ message: 'Utilisateur non trouvé' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erreur lors de la récupération des informations de l'utilisateur" })
  }
}

export default { addUser, login, getUserById }
