import Razorpay from "razorpay";
import appointmentModel from "../models/appointmentModel.js";
import sendEmail from "../lib/sendEmail.js"; 
import userModel from "../models/userModel.js";

//  CREATE ORDER API
export const createOrder = async (req, res) => {
  try {

    // CREATE INSTANCE HERE (IMPORTANT)
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // convert to paise
      currency: "INR",
    });

    res.json({ success: true, order });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



//  VERIFY PAYMENT API
export const verifyPayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    //  UPDATE + GET APPOINTMENT
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { payment: true },
      { new: true }
    );

    //  GET USER
    const user = await userModel.findById(appointment.userId);

    //  SEND EMAIL (NEW)
    await sendEmail(
      user.email,
      "Payment Successful",
      `<h3>Payment Successful ✅</h3>
       <p>Amount: ₹${appointment.amount}</p>
       <p>Doctor: ${appointment.docData.name}</p>`
    );

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};