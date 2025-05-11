import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  imageUrl: { type: String },
  description: { type: String },
  releaseYear: { type: Number, required: true },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  owner: { type: String },
  type: { type: String, enum: ['admin', 'user'], default: 'user' },
  sharedWith: [{ type: String }]
}, {
  timestamps: true,
});

export const Album = mongoose.model('Album', albumSchema);