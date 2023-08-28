import mongoose from 'mongoose'

const userGamesCollectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true },
    games: [{ type: mongoose.Types.ObjectId, ref: 'Jeu' }],
  },
  { collection: 'userCollection' }
)

const UserGamesCollection = mongoose.model('UserCollection', userGamesCollectionSchema)

export default UserGamesCollection
