import { User } from "../models/user.model.js"

export const authCallBack = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    // check if user already exists
    const user = await User.findOne({ clerkId: id });
    if (!user) {
      // Sign-up
      await User.create({
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl: imageUrl,
      })
    };

    res.status(200).json({ sucess: true });
  } catch (error) {
    console.log("Error in auth callback", error);
    next(error);
  }
};