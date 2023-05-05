import mongoose from "mongoose";

const appAdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { collection: "appAdmin" }
); // Je dois spécifier le nom de la collection, ici appAdmin

const appAdmin = mongoose.model("AppAdmin", appAdminSchema);

export default appAdmin;
