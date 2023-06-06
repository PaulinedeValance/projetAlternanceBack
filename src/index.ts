import express from "express";
import dotenv from "dotenv";
import pageRouter from "./pageRouter";
import passport from "./passport";
import flash from "connect-flash";
import session from "express-session";
import connectDB from "./dataBase";
import serveStatic from "serve-static";
import apiRouter from "./apiRoutes";
import methodOverride from "method-override";

dotenv.config();

// Création de l'instance d'Express
const app = express();
// Définition du port d'écoute en utilisant une variable d'environnement
const port = process.env.PORT;

// Définir le dossier public comme répertoire pour les fichiers statiques
app.use(serveStatic("public"));

// app.use(
//   cors({
//     origin: "*",
//   })
// );

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "mysecretkey",
    resave: true,
    saveUninitialized: true,
  })
);

// Appel de connectDB()
connectDB();

app.use(flash());

app.use("/", pageRouter); // utilisation du routeur
app.use("/api", apiRouter);

app.use(passport.initialize()); // initialisation de la librairie Passport.js

app.set("view engine", "ejs");
// Utilisation de method
app.use(methodOverride("_method"));
// Création d'un route
app.get("/", (req: any, res: any) => {
  res.send("Hello la famille");
});

// Lancement de mon serveur sur le port 5000
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
