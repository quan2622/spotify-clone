import { Router } from "express";
import artistController from "../controller/artist.controller.js";

const router = Router();

router
  .post("/create", artistController.CreateNewArtist)
  .get("/", artistController.getAllArtist)
  .get("/songs/:artistId", artistController.getArtistSong)
  .get("/albums/:artistId", artistController.getArtistAlbum)
  .put("/:artistId", artistController.updateArtist)
  .delete("/delete/:artistId", artistController.deleteArtist)


export default router;