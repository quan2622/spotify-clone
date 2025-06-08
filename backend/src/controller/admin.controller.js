import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { uploadToCloudinary } from "../helper/uploadToCloudinary.js";
import albumService from "../services/album.service.js";
import songService from "../services/song.service.js";

// GET /api/admin/songs?page=...
export const getAllSong = async (req, res, next) => {
  try {
    const response = await songService.getAllSong(req.query.page)
    res.status(200).json({ ...response });
  } catch (error) {
    next(error);
  }
}

// POST /api/admin/songs
export const createSong = async (req, res, next) => {
  try {
    const response = await songService.createSong(req.body, req.files)
    res.status(201).json({ ...response });
  } catch (error) {
    console.log("Error in createSong", error);
    next(error);
  }
};

// PUT /api/admin/songs/:songId
export const updateSong = async (req, res, next) => {
  try {
    const response = await songService.updateSong(req.params.songId, req.body, req.files);
    return res.status(200).json({ ...response });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/admin/songs/:id
export const deleteSong = async (req, res, next) => {
  try {
    const response = await songService.deleteSong(req.params.id);
    return res.status(200).json({ ...response });
  } catch (error) {
    next(error);
  }
}

// GET /api/admin/albums/
export const getAllAlbums = async (req, res, next) => {
  try {
    const response = await albumService.getAllAlbums(req.auth.userId, "ADMIN");
    return res.status(200).json({ ...response });
  } catch (error) {
    next(error);
  }
}

// POST /api/admin/albums
export const createAlbum = async (req, res, next) => {
  try {
    const response = await albumService.createAlbumAdmin(req.body, req.files.imageFile);
    return res.status(200).json({ ...response });
  } catch (error) {
    console.log('Error in create Album', error);
    next(error);
  }
}

// DELETE /api/admin/albums/:albumId
export const deleteAlbum = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const response = await albumService.DeleteAlbum(albumId);
    return res.status(200).json({ ...response })
  } catch (error) {
    console.error("Error deleting album:", error);
    next(error);
  }
}

// PUT /api/admin/albums/update/:albumId
export const updateAlbum = async (req, res, next) => {
  try {
    const response = await albumService.UpdateSongAlbumAdmin(req.params.albumId, req.body.songIds)
    return res.status(200).json({ ...response });
  } catch (error) {
    next(error)
  }
}

export const checkAdmin = async (req, res, next) => {
  res.status(200).json({ admin: true });
}