import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import User from './models/usersModel'
import * as bcrypt from 'bcrypt'
import mongoose from 'mongoose'

passport.use(
  new LocalStrategy(async function (usernameOrEmail, password, done) {
    try {
      // Recherche de l'utilisateur dans la bdd en utilisant email ou username
      const user = await User.findOne({
        $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
      })

      // Si l'utilisateur n'existe pas, renvoie une erreur
      if (!user) {
        return done(null, false, { message: "Nom d'utilisateur ou email incorrect" })
      }

      // Comparaison du mot de passe entré dans le formulaire avec le mot de passe haché stocké dans la base de données
      const match = await bcrypt.compare(password, user.password)

      if (!match) {
        return done(null, false, { message: 'Mot de passe incorrect' })
      }

      // Si tout est ok, retourne l'utilisateur
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)

passport.serializeUser(function (user: any, done) {
  // L'ID de l'utilisateur est stocké en tant que chaîne dans la session
  done(null, user['_id'].toString())
})

passport.deserializeUser(async (id: unknown, done) => {
  try {
    if (typeof id === 'string') {
      console.log('session serializer', id)

      // On convertit l'ID de la session en ObjectId avant de rechercher l'utilisateur
      const userId = new mongoose.Types.ObjectId(id)
      const user = await User.findById(userId).lean()
      done(null, user)
    } else {
      throw new Error('Invalid user ID')
    }
  } catch (err) {
    done(err)
  }
})

export default passport
