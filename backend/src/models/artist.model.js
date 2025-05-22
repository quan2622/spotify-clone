import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  realName: { type: String },
  genres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
  country: { type: String, required: true },
  imageUrl: { type: String },
  followerCount: { type: Number, default: 0 },
}, { timestamps: true });

export const Artist = mongoose.model('Artist', artistSchema);