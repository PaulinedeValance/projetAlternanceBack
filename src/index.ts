import express from 'express'
import dotenv from 'dotenv'
import pageRouter from './pageRouter'
import flash from 'connect-flash'
import session from 'express-session'
import connectDB from './dataBase'
import serveStatic from 'serve-static'
import apiRouter from './api/apiRoutes'
import requireAdmin from './middleware/requireAdmin'
import methodOverride from 'method-override'
import cors from 'cors'
import passport from './passport'
import cookieParser from 'cookie-parser'

dotenv.config()

// Création de l'instance d'Express
const app = express()
// Définition du port d'écoute en utilisant une variable d'environnement
const port = process.env.PORT

// Définition du dossier public comme répertoire pour les fichiers statiques
app.use(serveStatic('public'))

app.use(
  cors({
    // origin: 'https://la-ruche-ludique.web.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin: 'http://localhost:5173',
    credentials: true,
  })
)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

declare module 'express-session' {
  interface SessionData {
    id: string
    userId: string
  }
}

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY || '',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
)

app.use(cookieParser())

// Initialisation de passport.js
app.use(passport.initialize())
app.use(passport.session())

// Appel de connectDB()
connectDB()

app.use(flash())

app.use('/', pageRouter) // utilisation du routeur
app.use('/api', apiRouter)
app.use('/admin', requireAdmin)

app.set('view engine', 'ejs')
// Utilisation de method
app.use(methodOverride('_method'))
// Création d'un route
app.get('/', (req: any, res: any) => {
  res.send('La ruche Ludique')
})

// Lancement de mon serveur sur le port 5000
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
