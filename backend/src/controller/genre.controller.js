import { uploadToCloudinary } from "../helper/uploadToCloudinary.js";
import { Album } from "../models/album.model.js";
import { Genre } from "../models/genre.model.js";
import { Song } from "../models/song.model.js";

class genreController {


  // POST api/genre/add-new
  CreateNew = async (req, res, next) => {
    try {
      if (!req.body || !req.files.imageFile) {
        return res.status(400).json({
          EC: 1,
          EM: "Missing required params",
        })
      }

      const imageUrl = await uploadToCloudinary(req.files.imageFile);
      const new_genre = await Genre({ ...req.body, imageUrl });

      await new_genre.save();
      res.status(200).json({
        EC: 0,
        EM: "Create success",
      })
    } catch (error) {
      console.log("Error when creating: ", error);
      next(error);
    }
  }

  // GET api/genre/all
  GetALlGenre = async (req, res, next) => {
    try {
      const list_genre = await Genre.find();
      res.status(200).json({
        EC: 0,
        EM: "All genre had been get",
        list: [...list_genre],
      })
    } catch (error) {
      console.log("Error when get all genre: ", error);
      next(error);
    }
  }

  // GET api/genre/detail/:genreId
  GetDetailGenre = async (req, res, next) => {
    try {
      if (!req.params) return res.status(400).json({ EC: 1, EM: "Missing required params" });

      const detail_song = await Song.find({ genreId: req.params.genreId });
      const detail_album = await Album.find({ genreId: req.params.genreId }).populate('songs');
      return res.status(200).json({
        EC: 0,
        EM: "Get detail success",
        songs: [...detail_song],
        albums: [...detail_album]
      })
    } catch (error) {
      console.log("Error when get detail genre: ", error);
      next(error);
    }
  }

  // PUT api/genre/update-genre/:genreId
  UpdateGenre = async (req, res, next) => {
    try {
      const { genreId } = req.params;
      if (!req.body || Object.keys(req.body).length === 0)
        return res.status(200).json({
          EC: 1,
          EM: "Data in body is empty",
        })
      const data = await Genre.findByIdAndUpdate(genreId, req.body, { new: true });
      if (!data) {
        return res.status(404).json({
          EC: 2,
          EM: `Cannot find genre by id: ${genreId}`
        })
      }
      return res.status(200).json({
        EC: 0,
        EM: "Update data success",
        new_data: data,
      })
    } catch (error) {
      next(error);
    }
  }

  // Delete api/genre/delete/:genreId
  DeleteGenre = async (req, res, next) => {
    try {
      const { genreId } = req.params;
      if (!genreId) return res.status(400).json({ EC: 1, EM: "Missing required params" });
      const data = await Genre.findByIdAndDelete(genreId);
      if (!data) return res.status(404).json({ EC: 2, EM: `Cannot found genre by id: ${genreId}` });
      return res.status(200).json({
        EC: 0,
        EM: "Delete success",
      })
    } catch (error) {
      next(error)
    }
  }

}

export default new genreController()