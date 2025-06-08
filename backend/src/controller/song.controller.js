import songService from "../services/song.service.js";

// GET /api/songs/featured
export const getFeatureSong = async (req, res, next) => {
  try {
    const response = await songService.getFeatureSong();
    return res.status(200).json({ ...response });
  } catch (error) {
    next(error);
  }
}

// GET /api/songs/made-for-you
export const getMadeForYou = async (req, res, next) => {
  try {
    const response = await songService.getMadeForYouSong(req.auth.userId)
    return res.status(200).json({ ...response });
  } catch (error) {
    next(error);
  }
}

// GET /api/songs/trending
export const getTrending = async (req, res, next) => {
  try {
    const response = await songService.getTrendingSong();
    res.status(200).json({ ...response });
  } catch (error) {
    next(error);
  }
}

// GET /api/songs/:songId
export const getSongById = async (req, res, next) => {
  try {
    const response = await songService.getSongById(req.params.songId);
    return res.status(200).json({ ...response });
  } catch (error) {
    next(error);
  }
}

// GET /api/songs/all
export const getAllSong = async (req, res, next) => {
  try {
    const response = await songService.getAllSong();
    return res.status(200).json({ ...response });
  } catch (error) {
    next(error);
  }
}