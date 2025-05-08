import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { uploadToCloudinary } from "../helper/uploadToCloudinary.js";

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

export const checkAdmin = async (req, res, next) => {
  res.status(200).json({ admin: true });
}