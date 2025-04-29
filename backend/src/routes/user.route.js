import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  req.auth.userId;
  res.send('User route with get methods');
});

export default router;