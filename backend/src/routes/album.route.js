import { Router } from "express";
import { getAllAlbums, getAllAlbumById, createAlbumUser, AddSongToAlbum, UpdateInfoAlbum, DeleteSongAlbum, DeleteAlbumUser, getCacheAlbum, recordListeningAlbum } from "../controller/album.controller.js";
const router = Router();

router.get('/', getAllAlbums);
router.get('/:albumId', getAllAlbumById);
router.post('/createAlbum', createAlbumUser);
router.post('/addnew', AddSongToAlbum);
router.post('/deleteSong', DeleteSongAlbum);
router.put('/update/:albumId', UpdateInfoAlbum);
router.delete("/delete/:albumId", DeleteAlbumUser);
router.get("/get/caches", getCacheAlbum);
router.post("/record-album/:albumId", recordListeningAlbum);

export default router;