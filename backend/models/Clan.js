import mongoose from "mongoose";

const clanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  bannerImage: String, // optional banner/logo

  leader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coLeaders: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // Group chat support (uses Message model)
  chatRoomId: { type: String, unique: true },

  clanPoints: { type: Number, default: 0 },
  rank: { type: String, default: "Bronze" },

  createdAt: { type: Date, default: Date.now }
});

const Clan = mongoose.model("Clan", clanSchema);
export default Clan;
