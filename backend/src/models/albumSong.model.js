import mongoose from "mongoose";

const albumSongSchema = new mongoose.Schema({
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
  songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
}, { timestamps: true });

albumSongSchema.index({ albumId: 1, songId: 1 }, { unique: true });

export const albumSong = mongoose.model('albumSong', albumSongSchema);