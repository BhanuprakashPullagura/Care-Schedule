import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

dotenv.config({
  path: path.resolve("./.env")
});
console.log("ENV FILE TEST:", process.env.GEMINI_API_KEY);

// ==============================
//  CLOUDINARY CONFIG
// ==============================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// ==============================
//  DATABASE CONNECTION
// ==============================
import connectDB from "./config/mongodb.js";
connectDB();

// ==============================
// ROUTES
// ==============================
import adminRouter from "./routes/adminRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

//  NEW PAYMENT ROUTE
import paymentRouter from "./routes/paymentRoute.js";

// ==============================
//  EXPRESS APP
// ==============================
const app = express();
const port = process.env.PORT || 4000;

// ==============================
//  MIDDLEWARES
// ==============================
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

// Serve uploaded files (multer temp files)
app.use("/uploads", express.static("uploads"));

// ==============================
// ROUTE REGISTRATION
// ==============================
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

//  ADD THIS LINE (IMPORTANT)
app.use("/api/payment", paymentRouter);

// ==============================
// HEALTH CHECK
// ==============================
app.get("/", (req, res) => {
  res.send("API Working");
});

// DB check route
app.get("/test-db", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.send(connected ? "Database is connected" : "Database NOT connected");
});

// ==============================
//  START SERVER
// ==============================
app.listen(port, () => {
  console.log(`✅ Server running on PORT: ${port}`);
  console.log("🌩 Cloudinary Loaded:", !!process.env.CLOUDINARY_API_SECRET);
});