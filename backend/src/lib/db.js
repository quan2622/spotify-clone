import mongoose from 'mongoose';

export const connectBD = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connect to MongoDB ${conn.connection.host}`);
  } catch (error) {
    console.log("Failed to connect to mongoDB", error);
    process.exit(1);
  }
}