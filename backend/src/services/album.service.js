import mongoose from "mongoose";
import { uploadToCloudinary } from "../helper/uploadToCloudinary.js";
import { Album } from "../models/album.model.js";
import { albumSong } from "../models/albumSong.model.js";
import { User } from "../models/user.model.js";
import { Artist } from "../models/artist.model.js";
import AppError from "../utils/AppError.js";
import _ from "lodash";
import { startOfDay, startOfMonth, startOfToday, subDays } from "date-fns";
import { ListenHistory } from "../models/History.model.js";

const getAllAlbums = async (clerkId, option) => {
  // ADMIN || USER
  try {
    let albums = [];
    let dataSongCount = [];
    if (option === "ADMIN") {
      albums = await Album.find({ type: "admin" }).populate({
        path: "artistId",
        select: "name",
      });

      const albumIds = albums.map((item) => item._id);
      const songCount = await Promise.all(
        albumIds.map(async (albumId) => {
          const data = await albumSong.aggregate([
            { $match: { albumId: albumId } },
            { $group: { _id: "$albumId", count: { $sum: 1 } } },
            { $project: { _id: 0, count: 1 } },
          ]);
          return data[0] === undefined ? { count: 0 } : data[0];
        })
      );

      const songCountMap = albumIds.reduce((map, id, index) => {
        map.set(id.toString(), songCount[index].count);
        return map;
      }, new Map());

      dataSongCount = JSON.stringify([...songCountMap.entries()]);
    } else if (option === "USER") {
      albums = await Album.find({
        type: "user",
        $or: [{ owner: clerkId }, { sharedWith: { $in: [clerkId] } }],
      }).populate({ path: "artistId", select: "name" });
    }
    return {
      EC: 0,
      EM: `Albums ${option}`,
      albums,
      dataSongCount,
    };
  } catch (error) {
    throw error;
  }
};

const getAllAlbumById = async (albumId) => {
  try {
    if (!albumId) return { EC: 1, EM: "Missing required params" };

    const album_data = await Album.findById(albumId).populate({
      path: "artistId",
      select: "name",
    });
    const resDB = await albumSong.aggregate([
      { $match: { albumId: new mongoose.Types.ObjectId(albumId) } },
      {
        $lookup: {
          from: "songs",
          localField: "songId",
          foreignField: "_id",
          as: "songData",
        },
      },
      { $unwind: "$songData" },
      {
        $lookup: {
          from: "artists",
          let: { artistIds: "$songData.artistId" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$artistIds"] } } },
            { $project: { _id: 1, name: 1 } },
          ],
          as: "artistData",
        },
      },
      {
        $addFields: { "songData.artistId": "$artistData" },
      },
      {
        $group: {
          _id: "$albumId",
          songs: { $push: "$songData" },
        },
      },
      {
        $project: {
          _id: 0,
          albumId: "$_id",
          songs: 1,
        },
      },
    ]);

    if (!album_data) throw new AppError("Cannot find album", 404);
    return {
      EC: 0,
      EM: "OK",
      album_data,
      songs: resDB.length > 0 ? resDB[0].songs : [],
    };
  } catch (error) {
    throw error;
  }
};

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
      type: "user",
    });

    return {
      EC: 0,
      EM: "Create new album success",
      data_new,
    };
  } catch (error) {
    throw error;
  }
};

const createAlbumAdmin = async (payload, imageFile) => {
  try {
    if (!imageFile) return { EC: 1, EM: "Please upload image album" };
    const imageUrl = await uploadToCloudinary(imageFile);

    const { title, artistId, genreId, releaseYear, type, description } =
      payload;
    if (!payload || !title || !releaseYear || !type)
      return { EC: 2, EM: "Missing required params" };
    const data_update = {
      title: title,
      description: description,
      releaseYear: +releaseYear,
      type: type,
      imageUrl: imageUrl,
    };
    if (artistId !== 'no_artist') {
      const dataArtist = await Artist.findOne({ _id: artistId });
      data_update.artistId = artistId;
      if (!dataArtist) throw new AppError("Cannot find data artist", 404);
      data_update.owner = dataArtist.name;
    }
    if (genreId !== 'no_genre') data_update.genreId = genreId;

    const newAlbum = new Album({ ...data_update });
    await newAlbum.save();

    return { EC: 0, EM: "OK", newAlbum };
  } catch (error) {
    throw error;
  }
};

const UpdateInfoAlbum = async (albumId, payload, image = null) => {
  try {
    const dataUpdate = {};
    if (payload.title) dataUpdate.title = payload.title;
    if (payload.description) dataUpdate.description = payload.description;
    if (image) {
      const imageUrl = await uploadToCloudinary(image);
      dataUpdate.imageUrl = imageUrl;
    }

    if (!dataUpdate || _.isEmpty(dataUpdate)) {
      return { EC: 1, EM: "Data update error" };
    }
    const updatedAlbum = await Album.findByIdAndUpdate(albumId, dataUpdate, {
      new: true,
    });

    if (!updatedAlbum) {
      throw new AppError("Album not found", 404);
    }

    return {
      EM: "Album updated successfully",
      EC: 0,
    };
  } catch (error) {
    throw error;
  }
};

const UpdateSongAlbumAdmin = async (albumId, songs) => {
  try {
    if (!albumId || !songs) return { EC: 1, EM: "Missing required params" };

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const data = await albumSong.find({ albumId: albumId }).session(session);
      const associateExists = new Set(
        data.map((link) => link.songId.toString())
      );

      const songsUpdate = new Set(songs.map((id) => id.toString()));

      // song need add
      const song_add = songs.filter(
        (songId) => !associateExists.has(songId.toString())
      );
      // song need delete
      const song_remove = data.filter(
        (link) => !songsUpdate.has(link.songId.toString())
      );


      await Promise.all(
        song_add.map(async (songId) => {
          await albumSong.create([{ albumId: albumId, songId: songId }], {
            session,
          });
        })
      );
      if (song_remove.length > 0) {
        const songId_remove = song_remove.map((item) => item.songId);
        await albumSong
          .deleteMany({ albumId: albumId, songId: { $in: songId_remove } })
          .session(session);
      }

      await session.commitTransaction();
      session.endSession();
      return { EC: 0, EM: "Update successed!" };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Lỗi khi cập nhật danh sách bài hát trong album:", error);
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

const DeleteAlbum = async (albumId) => {
  try {
    if (!albumId) return { EC: 1, EM: "Missing required params" };

    const deletedAlbum = await Album.findByIdAndDelete(albumId);
    if (!deletedAlbum) throw new AppError("Cannot find Album", 404);

    await albumSong.deleteMany({ albumId: albumId });

    return {
      EC: 0,
      EM: "Delete album success",
    };
  } catch (error) {
    throw error;
  }
};

const UpdateSongAlbum = async (song, albumId, style) => {
  //style: ADD || REMOVE
  try {
    if (!song || !albumId) return { EC: 1, EM: "Missing required params" };

    if (style === "ADD") {
      await albumSong.findOneAndUpdate(
        { albumId: albumId, songId: song._id },
        { $setOnInsert: { albumId: albumId, songId: song._id } },
        { upsert: true }
      );
    } else if (style === "REMOVE") {
      await albumSong.findOneAndDelete({ albumId: albumId, songId: song._id });
    }

    return {
      EC: 0,
      EM: "Delete successed",
    };
  } catch (error) {
    throw error;
  }
};

const recordListeningAlbum = async (albumId, userId) => {
  try {
    if (!albumId || !userId) return { EC: 1, EM: "Missing required params" };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await ListenHistory.findOne({ albumId, userId, date: today });
    let result = {};
    if (record) {
      result = await ListenHistory.findOneAndUpdate({ albumId, userId, date: today }, { $inc: { count: 1 } });
    } else {
      result = await ListenHistory.create({ albumId, userId, date: today });
    }

    if (!result) throw new AppError("Cannot record listening album", 404);
    return {
      EC: 0,
      EM: "Record listening album success",
      result,
    };
  } catch (error) {
    throw error;
  }
}


const getRecentListeningAlbums = async (userId, page = 1) => {
  try {
    const end = startOfDay(new Date());
    const start = subDays(end, 7);
    const LIMIT = 10;
    const SKIP = (page - 1) * LIMIT;
    const data_history = await ListenHistory
      .find({
        userId,
        date: { $gte: start, $lte: end },
        albumId: { $exists: true }, songId: { $exists: false },
      })
      .sort({ date: -1 }).populate("albumId").limit(LIMIT).skip(SKIP);
    return data_history.map(item => item.albumId);
  } catch (error) {
    throw (error);
  }
}

const getRecommendedAlbums = async (userId, page = 1) => {
  try {
    const end = startOfDay(new Date());
    const start = subDays(end, 7);
    const LIMIT = 10;
    const SKIP = (page - 1) * LIMIT;
    const data_history = await ListenHistory
      .find({
        userId,
        date: { $gte: start, $lte: end },
        albumId: { $exists: true }, songId: { $exists: false },
      })
      .populate({
        path: "albumId",
        populate: { path: "genreId", select: 'name' }
      })
      .sort({ date: -1 });

    const albumIds = data_history.map(item => item.albumId);
    const result = await Album.find({ _id: { $nin: albumIds }, type: 'admin' })
      .limit(LIMIT)
      .skip(SKIP)
      .populate({ path: "genreId", select: 'name' });
    return result;
  } catch (error) {
    throw (error);
  }
}

const getPopularAlbums = async (page = 1) => {
  try {
    const start = startOfMonth(new Date());
    const end = startOfToday(new Date());

    const LIMIT = 10;
    const SKIP = (page - 1) * LIMIT;

    const data_history = await ListenHistory
      .find({
        date: { $gte: start, $lte: end },
        albumId: { $exists: true }, songId: { $exists: false },
      })
      .sort({ count: -1 })
      .populate({
        path: "albumId",
        populate: { path: "genreId", select: 'name' }
      })
      .limit(LIMIT).skip(SKIP);

    return data_history.map(item => ({
      ...item.albumId.toObject(),
      count: item.count
    }));
  } catch (error) {
    throw (error);
  }
}

const getNewReleases = async (page = 1) => {
  try {
    const end = startOfToday(new Date());
    const start = subDays(end, 30);
    const LIMIT = 10;
    const SKIP = (page - 1) * LIMIT;

    return await Album
      .find({
        type: "admin",
        createdAt: { $gte: start, $lte: end }
      })
      .populate({ path: "genreId", select: 'name' })
      .sort({ createdAt: -1 }).limit(LIMIT).skip(SKIP);
  } catch (error) {
    throw (error);
  }
}


export default {
  getAllAlbums,
  getAllAlbumById,
  createAlbumUser,
  createAlbumAdmin,
  UpdateInfoAlbum,
  UpdateSongAlbumAdmin,
  DeleteAlbum,
  UpdateSongAlbum,
  getRecentListeningAlbums,
  getPopularAlbums,
  getRecommendedAlbums,
  getNewReleases,
  recordListeningAlbum,
};
