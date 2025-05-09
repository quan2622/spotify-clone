import { Router } from "express";
import { createSong, deleteSong, createAlbum, deleteAlbum, checkAdmin, updateAlbum, getAllSong } from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();
// authencation & authorcation 
router.use(protectRoute, requireAdmin);

router.get('/check', checkAdmin);

router.get('/songs', getAllSong)
router.post('/songs', createSong);
router.delete('/songs/:id', deleteSong);

router.post('/albums', createAlbum);
router.put('/albums/update/:albumId', updateAlbum);
router.delete('/albums/:id', deleteAlbum);


export default router;