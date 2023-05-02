const express = require('express')
const dotenv = require('dotenv')
//const router = require('router')
dotenv.config();

// Création de l'instance d'Express
const app = express();
// Définition du port d'écoute en utilisant une variable d'environnement
const port = process.env.PORT;

//console.log(process.env.URI_MONGODB)


//app.use('/', router); // utilisez votre routeur

app.set('view engine', 'ejs');

// Création d'un route 
app.get("/", (req: any, res: any) => {
  res.send("Hello la famille");
});

app.get('/ajouter-jeu', (req:any, res:any) => {
  res.render('formGames');
});



// Lancement de mon serveur sur le port 5000
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
