import { Router } from "express";
import { getAllStat, recordListen, getDataAnalysts } from "../controller/stat.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute, requireAdmin);

router.get('/', getAllStat);
router.post('/recordListen', recordListen);
router.get('/statsHistory', getDataAnalysts);

export default router;