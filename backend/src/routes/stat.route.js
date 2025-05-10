import { Router } from "express";
import { getAllStat, recordListen, getDataAnalysts } from "../controller/stat.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get('/', protectRoute, requireAdmin, getAllStat);
router.post('/recordListen', recordListen);
router.get('/statsHistory', getDataAnalysts);

export default router;