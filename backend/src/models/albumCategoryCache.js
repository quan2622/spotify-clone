import mongoose from "mongoose";

const albumCategoryCache = new mongoose.Schema({
  userId: { type: String, required: true },
  categoryKey: { type: String, required: true },
  albumIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
  generatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

albumCategoryCache.index({ userId: 1, categoryKey: 1 });
albumCategoryCache.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AlbumCategoryCache = mongoose.model('AlbumCategoryCache', albumCategoryCache);