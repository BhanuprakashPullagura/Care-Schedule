import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load .env
dotenv.config();

// ⭐ CLOUDINARY CONFIG
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Database connection
import connectDB from './config/mongodb.js';

// Routers
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

// App config
const app = express();
const port = process.env.PORT || 4000;

// Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

// Health route
app.get('/', (req, res) => {
  res.send('API Working');
});

// Database test route
app.get('/test-db', (req, res) => {
  const state = mongoose.connection.readyState;
  if (state === 1) {
    res.send('Database is connected');
  } else {
    res.status(500).send('Database NOT connected');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server started on PORT:${port}`);
  console.log("Cloudinary Config Loaded:", !!process.env.CLOUDINARY_API_SECRET);
});
