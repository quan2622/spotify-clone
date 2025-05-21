import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';

import { connectBD } from "./lib/db.js";
import { initializeSocket } from "./lib/socket.js";
import { clerkMiddleware } from '@clerk/express'
import fileUpload from 'express-fileupload'
import path from 'path'

import app_route from "./routes/index.route.js"
import { createServer } from "http";
import cron from 'node-cron'

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json()); // to parse req.body

app.use(clerkMiddleware()) //this will add auth to req obj => req.auth.userId

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024 //10MB max file size
    }
  })
)

app_route(app);

// cron jobs
const tempDir = path.join(process.cwd(), 'tmp');
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.log('error', err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => { });
      }
    });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  })
}

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message });
})

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectBD();
})

