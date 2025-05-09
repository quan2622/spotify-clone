import mongoose from "mongoose";

const ListHistorySchema = new mongoose.Schema({
  songId: { type: mongoose.Schema.ObjectId, ref: 'Song', required: true },
  userId: { type: String, required: true },
}, {
  timestamps: true,
});

// Thêm chỉ mục để tăng tốc truy vấn
ListHistorySchema.index({ songId: 1, userId: 1, createdAt: 1 });

export const ListenHistory = mongoose.model('ListenHistory', ListHistorySchema);