import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import _ from "lodash"

const getAllAlbums = async (clerkId, option) => { // ADMIN || USER
  try {
    let albums = [];
    if (option === "ADMIN") {
      albums = await Album.find({ type: 'admin' }).populate({ path: "artistId", select: 'name' });
    } else if (option === "USER") {
      albums = await Album.find({
        type: 'user',
        $or: [
          { owner: clerkId },
          { sharedWith: { $in: [clerkId] } }
        ],
      }).populate({ path: "artistId", select: 'name' });
    }
    return ({
      EC: 0,
      EM: `Albums ${option}`,
      albums
    })
  } catch (error) {
    throw error
  }
}

const getAllAlbumById = async (albumId) => {
  try {
    if (!albumId) return ({ EC: 1, EM: "Missing required params" });

    const album_data = await Album.findById(albumId).populate(
      [
        { path: "songs", populate: { path: "artistId", select: ['name'] } },
        { path: "artistId", select: "name" }
      ]
    );

    if (!album_data) throw new AppError("Cannot find album", 404);
    return ({
      EC: 0,
      EM: "OK",
      album_data
    })
  } catch (error) {
    throw error
  }
}

const createAlbumUser = async (clerkId) => {
  try {
    const user = await User.findOne({ clerkId });
    if (!user) throw new AppError("Cannot find user", 404);

    const count = await Album.countDocuments({ owner: clerkId });
    const data_new = await Album.create({
      title: count === 0 ? "Liked Songs" : `Album new ${count + 1}`,
      artist: user.fullName,
      description: count === 0 ? "Liked Songs" : `Album new ${count + 1}`,
      releaseYear: new Date().getFullYear(),
      owner: clerkId,
      type: 'user',
    })

    return ({
      EC: 0,
      EM: "Create new album success",
      data_new
    })
  } catch (error) {
    throw error
  }
}

const UpdateInfoAlbum = async (albumId, payload, image = null) => {
  try {
    const dataUpdate = {};
    if (payload.title) dataUpdate.title = payload.title;
    if (payload.description) dataUpdate.description = payload.description;
    if (image) {
      const imageUrl = await uploadToCloudinary(image);
      dataUpdate.imageUrl = imageUrl;
    }

    if (!dataUpdate && _.isEmpty(dataUpdate)) {
      return ({ EC: 1, EM: "Data update error" });
    }
    const updatedAlbum = await Album.findByIdAndUpdate(albumId, dataUpdate, { new: true });

    if (!updatedAlbum) {
      throw new AppError("Album not found", 404);
    }

    return ({
      EM: "Album updated successfully",
      EC: updatedAlbum,
    });
  } catch (error) {
    throw error;
  }
}

const DeleteAlbum = async (albumId) => {
  try {
    if (!albumId)
      return { EC: 1, EM: "Missing required params" }

    await Song.updateMany({ albumId }, { $set: { albumId: null } });
    const deletedAlbum = await Album.findByIdAndDelete(albumId);

    if (!deletedAlbum)
      throw new AppError("Cannot find Album", 404)

    return {
      EC: 0,
      EM: "Delete album success"
    };
  } catch (error) {
    throw error;
  }
}

const UpdateSongAlbum = async (song, albumId, style) => { //style: ADD || REMOVE
  try {
    if (!song && !albumId)
      return ({ EC: 1, EM: "Missing required params", })

    const configOption = style === "ADD" ? { $addToSet: { songs: song._id } } : { $pull: { songs: song._id } }

    const new_data = await Album.findOneAndUpdate({ _id: albumId }, configOption, { new: true })

    return ({
      EC: 0,
      new_data
    })
  } catch (error) {
    throw error;
  }
}

export default {
  getAllAlbums,
  getAllAlbumById,
  createAlbumUser,
  UpdateInfoAlbum,
  DeleteAlbum,
  UpdateSongAlbum,
}