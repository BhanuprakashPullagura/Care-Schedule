import express from 'express';
import {
  registerUser,
  loginUser,
  verifyOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  
} from '../controllers/userController.js';

import { chatWithAI } from "../controllers/chatController.js";

import { createOrder, verifyPayment } from "../controllers/paymentController.js";

import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

// ================= AUTH ROUTES =================
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/verify-otp", verifyOtp);

// ================= PASSWORD RESET =================
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/verify-reset-otp", verifyResetOtp);
userRouter.post("/reset-password", resetPassword);

// ================= PROFILE =================
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile);

// ================= APPOINTMENTS =================
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);

// ================= PAYMENT ROUTES (NEW) =================
userRouter.post("/create-order", createOrder);
userRouter.post("/verify-payment", verifyPayment);

//  CHAT ROUTE
userRouter.post("/chat", chatWithAI);
export default userRouter;