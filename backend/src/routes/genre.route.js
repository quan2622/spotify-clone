import { Router } from "express";

import genreController from "../controller/genre.controller.js"

const router = Router();

router.post("/add-new", genreController.CreateNew);
router.get("/all", genreController.GetALlGenre);
router.get("/detail/:genreId", genreController.GetDetailGenre);
router.put("/update-genre/:genreId", genreController.UpdateGenre);
router.delete("/delete/:genreId", genreController.DeleteGenre);

export default router;