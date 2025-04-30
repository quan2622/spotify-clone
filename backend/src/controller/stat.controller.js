import { Song } from "../models/song.model.js"
import { Album } from "../models/album.model.js"
import { User } from "../models/user.model.js"

export const getAllStat = async (req, res, next) => {
  try {
    const [totalSong, totalAlbum, totalUser, uniqueArtists] = await Promise.all([
      Song.countDocuments(),
      Album.countDocuments(),
      User.countDocuments(),

      Song.aggregate([
        {
          $unionWith: {
            coll: Album,
            pipeline: [],
          },
        },
        {
          $group: { _id: '$artist' },
          // group by artist field
        },
        {
          $count: 'count',
        },
      ]),
    ]);

    res.status(200).json({
      totalAlbum,
      totalSong,
      totalUser,
      uniqueArtists: uniqueArtists?.count || 0,
    });
  } catch (error) {
    next(error);
  }
}