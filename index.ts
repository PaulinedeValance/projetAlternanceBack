import express from "express";
import dotenv from "dotenv";
import router from "./router";
import passport from "./passport";
import flash from "connect-flash";
import session from "express-session";
import connectDB from "./dataBase";

dotenv.config();

// Création de l'instance d'Express
const app = express();
// Définition du port d'écoute en utilisant une variable d'environnement
const port = process.env.PORT;

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

app.use("/", router); // utilisation du routeur

app.use(passport.initialize()); // initialisation de la librairie Passport.js

app.set("view engine", "ejs");

// Création d'un route
app.get("/", (req: any, res: any) => {
  res.send("Hello la famille");
});

// Lancement de mon serveur sur le port 5000
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
