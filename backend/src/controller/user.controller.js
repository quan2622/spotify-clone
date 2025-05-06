import { User } from "../models/user.model.js"
import { Message } from "../models/message.model.js"

export const getAllUser = async (req, res, next) => {
  try {
    const current_userId = req.auth.userId;
    const users = await User.find({ clerkId: { $ne: current_userId } });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export const getMessages = async (req, res, next) => {
  try {
    const myId = req.auth.userId;
    const { userId } = req.parms;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId },
      ]
    }).sort({ createdAt: 'asc' });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
}