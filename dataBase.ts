import mongoose from "mongoose";
import dotenv from "dotenv";
import jeuxModel from "./models/jeuxModel";
import appAdmin from "./models/appAdminModel";
dotenv.config();

const uri =
  "mongodb+srv://paulinedev:Qq3MyPFgwmTQZjvX@cluster0.n5lptmq.mongodb.net/ludoprojet?retryWrites=true&w=majority";

if (!uri) {
  console.error("MongoDB URI is undefined");
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      connectTimeoutMS: 3000,
      socketTimeoutMS: 20000,
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });
    console.log(`Cool, la connexion marche !`);
    //console.log(mongoose.connection.readyState);

    //Ajouter un nouvel utilisateur dans la collection appAdmin
    const newUser = new appAdmin({
      username: "monUsername",
      password: "monPassword",
    });

    const count = await appAdmin.countDocuments({ username: "monUsername" });
    if (count === 0) {
      await newUser.save();
      console.log("New user added to appAdmin collection");
    } else {
      console.log("User already exists in appAdmin collection");
    }

    // await jeuxModel.create({
    //   nom: "Monopoly",
    //   description: "Jeu de société de négociation immobilière",
    //   prix: 25,
    // });

    // console.log("Données de test insérées avec succès");
  } catch (err) {
    console.error(`Error while connecting to MongoDB: ${err}`);
    process.exit(1);
  }
};

export default connectDB;
