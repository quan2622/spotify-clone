import { Song } from "../models/song.model.js"
import { Album } from "../models/album.model.js"
import { User } from "../models/user.model.js"
import { ListenHistory } from "../models/ListenHistory.model.js";

export const getAllStat = async (req, res, next) => {
  try {
    const [totalSong, totalAlbum, totalUser, uniqueArtists] = await Promise.all([
      Song.countDocuments(),
      Album.countDocuments(),
      User.countDocuments(),

      Song.aggregate([
        {
          $unionWith: {
            coll: 'albums',
            pipeline: [],
          },
        },
        {
          $group: { _id: '$artist' },
          // group by artist field
        },
        {
          $count: 'count',
        },
      ]),
    ]);

    res.status(200).json({
      totalAlbum,
      totalSong,
      totalUser,
      uniqueArtists: uniqueArtists[0]?.count || 0,
    });
  } catch (error) {
    next(error);
  }
}

export const recordListen = async (req, res, next) => {
  try {
    const { songId, userId, timestamp } = req.body;
    console.log(songId, userId, timestamp);
    if (!songId || !userId || !timestamp) {
      return res.status(400).json({
        success: false,
        message: "Miss songId, userId or timestamp",
      });
    }

    // KT giới hạn nghe
    const startOfDay = new Date(timestamp);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const countListenToday = await ListenHistory.countDocuments({
      songId,
      userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (countListenToday >= 20) {
      return res.json({
        success: false,
        message: "Vượt quá giới hạn 3 lượt nghe/ngày",
      })
    };

    const song = await Song.findOneAndUpdate(
      { _id: songId },
      { $inc: { totalListens: 1 } },
      { new: true, upsert: true }
    );

    // Lưu lịch sử nghe
    await ListenHistory.create({
      songId,
      userId,
      timestamp: new Date(timestamp),
    });

    res.status(200).json({
      success: true,
      totalListens: song.totalListens,
      message: "Lượt nghe đã được ghi nhận",
    });
  } catch (error) {
    next(error.message);
  }
}