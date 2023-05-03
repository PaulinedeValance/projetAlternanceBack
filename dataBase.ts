const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.URI_MONGODB, {
  connectTimeoutMS: 3000,
  socketTimeoutMS: 20000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log(`Cool, la connexion marche !`);
});
