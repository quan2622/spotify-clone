import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { getAllUser } from "../controller/user.controller";

const router = Router();

router.get("/", protectRoute, getAllUser);
// Todo: getMessage

export default router;