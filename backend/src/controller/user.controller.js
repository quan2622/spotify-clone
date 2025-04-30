import { User } from "../models/user.model.js"

export const getAllUser = async (req, res, next) => {
  try {
    const current_userId = req.auth.userId;
    const users = await User.find({ clerkId: { $ne: current_userId } });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}