import { Album } from "../models/album.model.js";
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
        fullName: `${firstName || ''} ${lastName || ''}`.trim(),
        imageUrl: imageUrl,
      })

      // Create Album Likes default
      const today = new Date();

      await Album.create({
        title: "My Love",
        artist: `${firstName || ''} ${lastName || ''}`.trim(),
        imageUrl: 'https://res.cloudinary.com/dchv5jtrl/image/upload/v1746945274/ab6765630000ba8afa44b5670d5387d6a098775a_ypqala.jpg',
        releaseYear: today.getFullYear(),
        songs: [],
        owner: id,
        type: 'user',
        sharedWith: [],
      });
    };

    res.status(200).json({ sucess: true });
  } catch (error) {
    console.log("Error in auth callback", error);
    next(error);
  }
};