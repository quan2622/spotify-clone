import { Song } from "../models/song.model.js"

export const getAllSong = async (req, res, next) => {
  try {
    const songs = await Song.find({}).sort({ createdAt: desc });
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
}

export const getFeatureSong = async (req, res, next) => {
  try {
    // fetch random 6 songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
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
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
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
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        }
      }
    ]);
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
}