import albumService from "../services/album.service.js";

// GET /api/albums/
export const getAllAlbums = async (req, res, next) => {
  try {
    const response = await albumService.getAllAlbums(req.auth.userId, "USER");
    return res.status(200).json({ ...response });
  } catch (error) {
    next(error);
  }
}

// GET /api/albums/:albumId
export const getAllAlbumById = async (req, res, next) => {
  try {
    const response = await albumService.getAllAlbumById(req.params.albumId);
    return res.status(200).json({ ...response });
  } catch (error) {
    next(error);
  }
}

// POST /api/albums/createAlbum
export const createAlbumUser = async (req, res, next) => {
  try {
    const response = await albumService.createAlbumUser(req.auth.userId);
    return res.status(201).json({ ...response })
  } catch (error) {
    next(error);
  }
}

// POST /api/albums/addnew
export const AddSongToAlbum = async (req, res, next) => {
  try {
    const { song, albumId } = req.body;
    const response = await albumService.UpdateSongAlbum(song, albumId, "ADD");
    return res.status(200).json({ ...response });
  } catch (error) {
    next(error);
  }
}

// POST /api/albums/deleteSong
export const DeleteSongAlbum = async (req, res, next) => {
  try {
    const { song, albumId } = req.body;
    const response = await albumService.UpdateSongAlbum(song, albumId, "REMOVE");
    return res.status(200).json({ ...response });
  } catch (error) {
    next(error);
  }
}

// PUT /api/albums/update/:albumId
export const UpdateInfoAlbum = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const image = req.files?.image;

    const response = albumService.UpdateInfoAlbum(albumId, req.body, image)

    return res.status(200).json({ ...response });
  } catch (error) {
    console.error("Error updating album:", error);
    next(error);
  }
};

// DELETE /api/albums/delete/:albumId
export const DeleteAlbumUser = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const response = await albumService.DeleteAlbum(albumId);

    return res.status(200).json({ ...response })
  } catch (error) {
    console.error("Error deleting album:", error);
    next(error);
  }
}