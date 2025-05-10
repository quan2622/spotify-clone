import mongoose from "mongoose";

const ListHistorySchema = new mongoose.Schema({
  songId: { type: mongoose.Schema.ObjectId, ref: 'Song', required: true },
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  count: { type: Number, default: 1 },
});

// Thêm chỉ mục để tăng tốc truy vấn
ListHistorySchema.index({ songId: 1, userId: 1, date: 1, count: 1 });

export const ListenHistory = mongoose.model('ListenHistory', ListHistorySchema);

const loginHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  count: { type: Number, default: 1 },
});

export const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);