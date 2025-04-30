import { Album } from '../models/album.model.js'

export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (error) {
    next(error);
  }
}

export const getAllAlbumById = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.albumId).populate("songs");
    // populate -> specific path and return document in model had been ref
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    res.status(200).json(album);
  } catch (error) {
    next(error);
  }
}