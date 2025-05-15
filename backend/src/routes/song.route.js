import { Router } from "express";
import { getFeatureSong, getAllSong, getMadeForYou, getTrending, getSongById } from "../controller/song.controller.js";

const router = Router();

router.get("/all", getAllSong);
router.get('/featured', getFeatureSong);
router.get('/made-for-you', getMadeForYou);
router.get('/trending', getTrending);
router.get('/:songId', getSongById);
export default router;