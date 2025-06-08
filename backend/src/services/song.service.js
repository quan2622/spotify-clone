import _ from "lodash";
import { uploadToCloudinary } from "../helper/uploadToCloudinary.js";
import { Album } from "../models/album.model.js";
import { ListenHistory } from "../models/History.model.js";
import { Song } from "../models/song.model.js"
import AppError from "../utils/AppError.js";
import { albumSong } from "../models/albumSong.model.js";

const getAllSong = async (page = 0) => {
  try {
    let songs = [], totalSong = 0;
    const SONG_PER_PAGE = 10;

    if (page !== 0) {
      const validPage = Math.max(1, +page);
      const number_skip = (validPage - 1) * SONG_PER_PAGE;
      songs = await Song.find()
        .populate({ path: "artistId", select: "name" })
        .sort({ createdAt: "desc" })
        .skip(number_skip)
        .limit(SONG_PER_PAGE);
      totalSong = await Song.countDocuments();
    } else {
      songs = await Song.find().populate({ path: "artistId", select: "name" });
    }
    return ({ EC: 0, songs, totalSong });
  } catch (error) {
    throw error
  }
}

const getSongById = async (songId) => {
  try {
    if (!songId) return ({ EC: 1, EM: "Missing required params" });
    const song = await Song.findById(songId).populate({ path: 'artistId', select: 'name' });
    return ({ EC: 0, song });
  } catch (error) {
    throw error
  }
}

const getTrendingSong = async () => {
  try {
    const songs = await Song.find().sort({ totalListens: -1 }).limit(20).populate({ path: "artistId", select: "name" });
    return ({ EC: 0, songs });
  } catch (error) {
    throw error
  }
}

const getMadeForYouSong = async (userId) => {
  try {
    const songs = await ListenHistory.aggregate([
      { $match: { userId } },
      { $group: { _id: '$songId', totalListens: { $sum: '$count' } } },
      { $sort: { totalListens: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'songs',
          localField: '_id',
          foreignField: '_id',
          as: 'song_info',
        }
      },
      { $unwind: '$song_info' },
      {
        $lookup: {
          from: 'artists',
          let: { artistIds: '$song_info.artistId' },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$artistIds'] } } },
            { $project: { _id: 1, name: 1 } }
          ],
          as: 'artistId'
        }
      },
      {
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
    ])

    return ({ EC: 0, songs });
  } catch (error) {
    throw error
  }
}

const getFeatureSong = async () => {
  try {
    const songs = await Song.aggregate([
      { $sample: { size: 6 } },
      {
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
    ])

    return ({ EC: 0, songs });
  } catch (error) {
    throw error
  }
}

const createSong = async (payload, files) => {
  try {
    if (!files || !files.audioFile || !files.imageFile)
      return ({ EC: 1, EM: 'Not found image or audio file!' });

    const { title, artistId, duration } = payload;
    if (!payload || !title || !artistId || !duration)
      return ({ EC: 2, EM: "Missing required params" })

    const data_create = {
      audioUrl: await uploadToCloudinary(files.audioFile),
      imageUrl: await uploadToCloudinary(files.imageFile),
      title,
      artistId: JSON.parse(artistId),
      duration,
    };

    const newSong = new Song({ ...data_create })
    await newSong.save()

    return ({ EC: 0, EM: "Create new song successed", newSong })
  } catch (error) {
    throw error
  }
}

const updateSong = async (songId, payload, files) => {
  try {
    let data_update = {};
    if (files) {
      if (files.audioFile) data_update.audioUrl = await uploadToCloudinary(files.audioFile);
      if (files.imageFile) data_update.imageUrl = await uploadToCloudinary(files.imageFile);
    }

    if (payload) {
      Object.keys(payload).forEach(key => {
        if (payload[key] !== undefined && payload[key] !== null) {
          data_update[key] = key === 'artistId' ? JSON.parse(payload[key]) : payload[key];
        }
      });
    }
    if (_.isEmpty(data_update))
      return ({ EC: 1, EM: "Data update is null!" });

    const song = await Song.findByIdAndUpdate(songId, { ...data_update }, { new: true });
    if (!song) throw new AppError("Cannot found song", 404);

    return ({ EC: 0, EM: "Update successed", song });
  } catch (error) {
    throw error
  }
}

const deleteSong = async (songId) => {
  try {
    const res = await Song.findByIdAndDelete(songId);
    if (!res) throw AppError("Cannot found song", 404);

    await albumSong.deleteMany({ songId: songId })
    return ({ EC: 0, EM: "Delete song successed" });
  } catch (error) {
    throw error
  }
}

export default {
  getAllSong,
  getSongById,
  getTrendingSong,
  getMadeForYouSong,
  getFeatureSong,
  createSong,
  updateSong,
  deleteSong,
}