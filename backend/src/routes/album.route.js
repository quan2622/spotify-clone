import { Router } from "express";
import { getAllAlbums, getAllAlbumById, createAlbumUser, AddSongToAlbum, UpdateInfoAlbum } from "../controller/album.controller.js";
const router = Router();

router.get('/', getAllAlbums);
router.get('/:albumId', getAllAlbumById);
router.post('/createAlbum', createAlbumUser);
router.post('/addnew', AddSongToAlbum);
router.put('/update/:albumId', UpdateInfoAlbum);

export default router;