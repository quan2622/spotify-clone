import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  if (!req.auth.userId) { //set up app.use(clerkMiddleware()) in index.js to get data in req.auth
    return res.status(401).json({ message: 'Unauthorized - you must log in' });
  }

  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const current_user = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin = process.env.EMAIL_ADMIN === current_user.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      return res.status(403).json({ message: 'Unauthorized - you must be an admin' });
    }

    next();
  } catch (error) {
    next(error);
  }
}