import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  userId: { type: String, required: true },
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;
