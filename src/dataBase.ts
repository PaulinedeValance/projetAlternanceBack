import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const uri = process.env.URI_MONGODB

if (!uri) {
  console.error('MongoDB URI is undefined')
  process.exit(1)
}

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      connectTimeoutMS: 3000,
      socketTimeoutMS: 20000,
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    })
  } catch (err) {
    console.error(`Error while connecting to MongoDB: ${err}`)
    process.exit(1)
  }
}

export default connectDB
