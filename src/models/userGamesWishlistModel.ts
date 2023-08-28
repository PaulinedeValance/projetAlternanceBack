import mongoose from 'mongoose'

const userGamesWishlistchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true },
    games: [{ type: mongoose.Types.ObjectId, ref: 'Jeu' }],
  },
  { collection: 'userWishlist' }
)

const UserGamesWishlist = mongoose.model('UserWishlist', userGamesWishlistchema)

export default UserGamesWishlist
