import { uploadToCloudinary } from "../helper/uploadToCloudinary.js";
import { Album } from '../models/album.model.js'
import { User } from "../models/user.model.js";

export const getAllAlbums = async (req, res, next) => {
  try {
    const adminAlbums = await Album.find({ type: 'admin' }).populate({ path: "artistId", select: 'name' });
    let userAlbums = [];
    if (req.auth.userId) {
      userAlbums = await Album.find({
        $or: [
          { owner: req.auth.userId },
          { sharedWith: { $in: [req.auth.userId] } }
        ],
        type: 'user',
      }).populate({ path: "artistId", select: 'name' });
    }
    res.status(200).json({
      adminAlbums, userAlbums
    });
  } catch (error) {
    next(error);
  }
}

export const getAllAlbumById = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.albumId).populate([
      {
        path: "songs",
        populate: {
          path: "artistId",
          select: ['name']
        },
      },
      { path: "artistId", select: "name" }
    ]
    );
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
    if (!user) {
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
    } else return res.status(404).json({ EC: 1, EM: "Cannot find user" });
  } catch (error) {
    next(error.message);
  }
}

export const AddSongToAlbum = async (req, res, next) => {
  try {
    const { song, albumId } = req.body;

    const new_data = await Album.findOneAndUpdate(
      { _id: albumId },
      { $push: { songs: song._id } },
      { new: true }
    )

    res.status(200).json({
      success: true,
      new_data
    })
  } catch (error) {
    next(error.message);
  }
}

export const DeleteSongAlbum = async (req, res, next) => {

  try {
    const { song, albumId } = req.body;
    if (!song || !albumId) {
      return res.status(200).json({
        success: false,
        errMess: "Missing required params",
      })
    }
    const new_data = await Album.findOneAndUpdate(
      { _id: albumId },
      { $pull: { songs: song._id } },
      { new: true }
    )

    res.status(200).json({
      success: true,
      new_data
    })
  } catch (error) {
    next(error.message);
  }
}

export const UpdateInfoAlbum = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const { title, description } = req.body;
    const image = req.files?.image;

    const dataUpdate = {};
    if (title) dataUpdate.title = title;
    if (description) dataUpdate.description = description;

    if (image) {
      const imageUrl = await uploadToCloudinary(image);
      dataUpdate.imageUrl = imageUrl;
    }

    const updatedAlbum = await Album.findByIdAndUpdate(albumId, dataUpdate, { new: true });

    if (!updatedAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    return res.status(200).json({
      message: "Album updated successfully",
      newData: updatedAlbum,
    });
  } catch (error) {
    console.error("Error updating album:", error);
    next(error);
  }
};

export const DeleteAlbumUser = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    await Album.findByIdAndDelete(albumId);
    res.status(200).json({
      success: true,
      message: "Delete album success"
    })
  } catch (error) {
    next(error);
  }
}