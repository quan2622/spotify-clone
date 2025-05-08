import { Router } from "express";
import { getAllSong, getFeatureSong, getMadeForYou, getTrending, updateSong, getSongById } from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// router.get('/', protectRoute, requireAdmin, getAllSong);
router.get('/', getAllSong);
router.get('/featured', getFeatureSong);
router.get('/made-for-you', getMadeForYou);
router.get('/trending', getTrending);
router.get('/:songId', getSongById);
router.put('/:songId', updateSong);

export default router;