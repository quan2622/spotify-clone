import { uploadToCloudinary } from "../helper/uploadToCloudinary.js";
import { Album } from "../models/album.model.js";
import { Artist } from "../models/artist.model.js";
import { Song } from "../models/song.model.js";

class artistController {
  // POST api/artist/create
  CreateNewArtist = async (req, res, next) => {
    try {
      if (!req.body || !req.files) return res.status(400).json({ EC: 1, EM: "Missing required params" });
      const imageUrl = await uploadToCloudinary(req.files.imageFile);
      const new_artist = await Artist({ ...req.body, imageUrl });
      await new_artist.save();

      return res.status(200).json({
        EC: 0,
        EM: "Create new artist success",
      })
    } catch (error) {
      next(error);
    }
  }

  // Get api/artist/
  getAllArtist = async (req, res, next) => {
    try {
      const data = await Artist.find().populate([
        {
          path: "genres",
          select: "name description",
        }]);

      return res.status(200).json({
        EC: 0,
        EM: "Get data success",
        artists: data,
      })
    } catch (error) {
      next(error);
    }
  }

  // Get api/artist/songs/:artistId
  getArtistSong = async (req, res, next) => {
    try {
      const { artistId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const hasPageInfo = req.query.hasPageInfo === 'true';
      const limit = 10;
      let number_skip = (+page - 1) * limit;

      const songs = await Song.find({
        artistId: { $in: [artistId] },
      }).sort({ createdAt: "desc" }).skip(number_skip).limit(limit);

      const response = {
        songs,
        currentPage: page,
      }

      if (hasPageInfo) {
        const totalSong = await Song.countDocuments({ artistId: { $in: [artistId] } });
        const totalPage = Math.ceil(totalSong / limit);
        response.totalSong = totalSong;
        response.totalPage = totalPage;
      }
      return res.status(200).json({
        EC: 0,
        EM: "Get data song pagination success",
        ...response,
      })
    } catch (error) {
      next(error);
    }
  }

  // Get api/artist/albums/:artistId
  getArtistAlbum = async (req, res, next) => {
    try {
      const { artistId } = req.params;
      const albums = await Album.find({
        type: 'admin',
        artistId: artistId,
        owner: { $regex: artistId, $options: 'i' }
      });

      if (!albums) return res.status(404).json({
        EC: 1,
        EM: "Cannot found album",
      })
      return res.status(200).json({
        EC: 0,
        EM: "Get data album success",
        albums: albums,
      })
    } catch (error) {
      next(error);
    }
  }


  // Put api/artist/:artistId
  updateArtist = async (req, res, next) => {
    try {
      if (!req.boy || Object.keys(req.body).length === 0) return res.status(400).json({ EC: 1, EM: "Missing required params" });
      const { artistId } = req.params;
      const data_update = await Artist.findByIdAndUpdate(artistId, req.body, { new: true });
      if (!data_update) return res.status(404).json({ EC: 2, EM: `Cannot found artist data by id: ${artistId}` });

      return res.status(200).json({
        EC: 0,
        EM: "Update data success",
        dataUpdate: data_update,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete api/artist/delete/:artistId
  deleteArtist = async (req, res, next) => {
    try {
      const { artistId } = req.params;
      if (!artistId) return res.status(400).json({ EC: 1, EM: "Missing required params" });

      const data = await Artist.findByIdAndDelete(artistId);
      if (!data) return res.status(404).json({ EC: 2, EM: `Cannot found artist has id: ${artistId}` });
      return res.status(200).json({ EC: 0, EM: "Delete data artist success" });
    } catch (error) {
      next(error);
    }
  }
}

export default new artistController();