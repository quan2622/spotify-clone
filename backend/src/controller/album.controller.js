import { Album } from '../models/album.model.js'
import { User } from "../models/user.model.js";

export const getAllAlbums = async (req, res, next) => {
  try {
    const adminAlbums = await Album.find({ type: 'admin' });

    const userAlbums = await Album.find({
      $or: [
        { owner: req.auth.userId },
        { sharedWith: { $in: [req.auth.userId] } }
      ],
      type: 'user',
    })

    res.status(200).json({
      adminAlbums, userAlbums
    });
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

export const createAlbumUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });

    const count = await Album.countDocuments({
      owner: req.auth.userId,
    })

    const dataNew = await Album.create({
      title: `Album new ${count + 1}`,
      artist: user.fullName,
      releaseYear: new Date().getFullYear(),
      owner: req.auth.userId,
      type: 'user',
    });

    res.status(201).json(
      {
        success: true,
        dataNew,
      }
    )
  } catch (error) {
    next(error.message);
  }
}

export const AddSongToAlbum = async (req, res, next) => {
  try {
    const { songs, albumId } = req.body;
    const new_data = await Album.findOneAndUpdate(
      { _id: albumId },
      { $addToSet: { songs: { $each: songs } } },
      { new: true }
    )
    console.log("check songs add album: ", new_data);
    res.status(200).json({
      success: true,
      new_data
    })
  } catch (error) {
    next(error.message);
  }
}