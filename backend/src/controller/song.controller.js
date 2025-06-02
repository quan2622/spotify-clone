import { uploadToCloudinary } from "../helper/uploadToCloudinary.js";
import { ListenHistory } from "../models/History.model.js";
import { Song } from "../models/song.model.js"

export const getFeatureSong = async (req, res, next) => {
  try {
    // fetch random 6 songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      }, {
        $lookup: {
          from: 'artists',
          let: { artistIds: "$artistId" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$artistIds"] } } },
            {
              $project: {
                _id: 1,
                name: 1
              }
            }
          ],
          as: 'artistId',
        }
      }, {
        $project: {
          _id: 1,
          title: 1,
          artistId: 1,
          imageUrl: 1,
          audioUrl: 1,
          createdAt: 1,
          duration: 1,
        }
      }
    ]);
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
}

export const getMadeForYou = async (req, res, next) => {
  try {
    // fetch random 4 songs using mongodb's aggregation pipeline
    const userId = req.auth.userId;

    const songs = await ListenHistory.aggregate([
      { $match: { userId }, },
      {
        $group: {
          _id: '$songId',
          totalListens: { $sum: '$count' },
        }
      },
      { $sort: { totalListens: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'songs',
          localField: '_id',
          foreignField: '_id',
          as: 'song_info'
        }
      },
      { $unwind: '$song_info' },
      {
        $lookup: {
          from: 'artists',
          let: { artistIds: "$song_info.artistId" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$artistIds"] } } },
            {
              $project: {
                _id: 1,
                name: 1
              }
            }
          ],
          as: 'artistId',
        }
      }, {
        $project: {
          _id: 1,
          totalListens: 1,
          artistId: 1,
          title: '$song_info.title',
          imageUrl: '$song_info.imageUrl',
          audioUrl: '$song_info.audioUrl',
          duration: '$song_info.duration',
          createdAt: '$song_info.createdAt',
        }
      }
    ]);

    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
}

export const getTrending = async (req, res, next) => {
  try {
    // fetch random 4 songs using mongodb's aggregation pipeline
    const songs = await Song.find().sort({ totalListens: -1 }).limit(20).populate({ path: "artistId", select: "name" });
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
}

export const getSongById = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const song = await Song.findById(songId).populate({ path: 'artistId', select: 'name' });

    res.status(200).json(song);
  } catch (error) {
    next(error);
  }
}

export const getAllSong = async (req, res, next) => {
  try {
    const data = await Song.find().populate({ path: 'artistId', select: 'name' });
    if (data) {
      return res.status(200).json({
        songs: data,
        EC: 0
      });
    } else {
      return res.status(404).json({
        EM: 'Not found data music',
        EC: 1,
      })
    }
  } catch (error) {
    next(error);
  }
}