import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { uploadToCloudinary } from "../helper/uploadToCloudinary.js";

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

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: 'Please upload all files' });
    }

    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null
    });

    await song.save();

    // if song belongs to an album, update the album's song array
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song.id }
      })
    }
    res.status(201).json(song);
  } catch (error) {
    console.log("Error in createSong", error);
    next(error);
  }
};

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

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song.id }
      })
    }

    await Song.findByIdAndDelete(id);
    res.status(200).json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.log('Error in deleteing song', error);
    next(error);
  }
}

export const createAlbum = async (req, res, next) => {
  try {
    if (!req.files || !req.files.imageFile) {
      return res.status(400).json({ message: 'Please upload image album' });
    }

    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;

    const imageUrl = await uploadToCloudinary(imageFile);
    const album = new Album({
      title,
      artist,
      releaseYear,
      imageUrl,
    });
    await album.save();
    res.status(200).json(album);
  } catch (error) {
    console.log('Error in create Album', error);
    next(error);
  }
}

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndUpdate(id);
    res.status(200).json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.log('Error delete album', error);
    next(error);
  }
}

export const updateAlbum = async (req, res, next) => {
  try {
    const { songIds } = req.body;
    const { albumId } = req.params;

    await Album.findByIdAndUpdate({ _id: albumId }, { songs: [...songIds] });
    await Song.updateMany({ _id: { $in: songIds } }, { albumId: albumId });
    res.status(200).json({ message: 'Update successed' });
  } catch (error) {
    next(error)
  }
}

export const checkAdmin = async (req, res, next) => {
  res.status(200).json({ admin: true });
}