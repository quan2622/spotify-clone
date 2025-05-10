import { uploadToCloudinary } from "../helper/uploadToCloudinary.js";
import { Song } from "../models/song.model.js"

export const getAllSong = async (req, res, next) => {
  try {
    let { page } = req.query;
    const limit = 4;
    let number_skip = (+page - 1) * limit

    const songs = await Song.find().sort({ createdAt: "desc" }).skip(number_skip).limit(limit);
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

export const updateSong = async (req, res, next) => {
  try {
    const { songId } = req.params;
    let audioUrl = '';
    let imageUrl = '';
    if (req.files) {
      if (req.files.audioFile) {
        audioUrl = await uploadToCloudinary(req.files.audioFile);
      }
      if (req.files.imageFile) {
        imageUrl = await uploadToCloudinary(req.files.imageFile);
      }
    }

    let data_update = {
      ...req.body,
    }
    if (audioUrl !== '') data_update.audioUrl = audioUrl;
    if (imageUrl !== '') data_update.imageUrl = imageUrl;

    const song = await Song.findByIdAndUpdate({ _id: songId }, { ...data_update }, { new: true });

    res.status(200).json({
      song,
      message: 'Update successed'
    })
  } catch (error) {
    next(error);
  }
}

export const getSongById = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const song = await Song.findById(songId);

    res.status(200).json(song);
  } catch (error) {
    next(error);
  }
}