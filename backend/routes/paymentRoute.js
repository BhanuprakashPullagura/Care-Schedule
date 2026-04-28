import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

// create order
paymentRouter.post("/create-order", createOrder);

// verify payment
paymentRouter.post("/verify", verifyPayment);

export default paymentRouter;