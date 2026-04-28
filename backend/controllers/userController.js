import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from 'cloudinary';
import sendEmail from "../lib/sendEmail.js";

/* ========================
   REGISTER USER
======================== */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;


    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password (min 8 chars)" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
  name,
  email,
  phone,
  password: hashedPassword
});

    

    await newUser.save();

    res.json({ success: true, message: "User Registered Successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ========================
   LOGIN USER (SEND OTP)
======================== */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid credentials" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    user.isOtpVerified = false;

    await user.save();

    await sendEmail(user.email, otp);

    res.json({
      success: true,
      message: "OTP sent to your email",
      userId: user._id
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ========================
   VERIFY OTP
======================== */
const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await userModel.findById(userId);
    if (!user)
      return res.json({ success: false, message: "User not found" });

    if (user.otp !== otp)
      return res.json({ success: false, message: "Invalid OTP" });

    if (user.otpExpiry < Date.now())
      return res.json({ success: false, message: "OTP expired" });

    user.isOtpVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ========================
   GET USER PROFILE
======================== */
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ========================
   UPDATE USER PROFILE
======================== */
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    let parsedAddress = address;
    try {
      if (typeof address === 'string') {
        parsedAddress = JSON.parse(address);
      }
    } catch (e) {
      parsedAddress = address || {};
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender
    });

    if (imageFile) {
      const upload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image"
      });

      await userModel.findByIdAndUpdate(userId, {
        image: upload.secure_url
      });
    }

    res.json({ success: true, message: "Profile Updated" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ========================
   BOOK APPOINTMENT
======================== */


const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { docId, slotDate, slotTime } = req.body;

    if (!slotDate || !slotTime) {
      return res.json({ success: false, message: "Slot date and time required" });
    }

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData)
      return res.json({ success: false, message: "Doctor not found" });

    if (!docData.available)
      return res.json({ success: false, message: "Doctor Not Available" });

    let slots_booked = docData.slots_booked || {};

    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res.json({ success: false, message: "Slot Not Available" });
    }

    if (!slots_booked[slotDate]) {
      slots_booked[slotDate] = [];
    }

    slots_booked[slotDate].push(slotTime);

    const userData = await userModel.findById(userId).select("-password");
    const { slots_booked: _, ...docDataWithoutSlots } = docData.toObject();

    const appointmentData = {
      userId,
      docId,
      userData,
      docData: docDataWithoutSlots,
      slotDate,
      slotTime,
      amount: docData.fees,
      date: Date.now()
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    // ================= EMAIL ADDED (SAFE) =================
    await sendEmail(
      userData.email,
      "Appointment Confirmed",
      `<h3>Appointment Confirmed</h3>
       <p>Doctor: ${docData.name}</p>
       <p>Date: ${slotDate}</p>
       <p>Time: ${slotTime}</p>
       <p>Fees: ₹${docData.fees}</p>`
    );
    // =====================================================

    res.json({ success: true, message: "Appointment Booked" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ========================
   LIST USER APPOINTMENTS
======================== */
const listAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ========================
   CANCEL APPOINTMENT
======================== */
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const doctor = await doctorModel.findById(appointmentData.docId);

    if (doctor && doctor.slots_booked?.[appointmentData.slotDate]) {
      doctor.slots_booked[appointmentData.slotDate] =
        doctor.slots_booked[appointmentData.slotDate].filter(
          t => t !== appointmentData.slotTime
        );

      await doctorModel.findByIdAndUpdate(doctor._id, {
        slots_booked: doctor.slots_booked
      });
    }

    res.json({ success: true, message: "Appointment Cancelled" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ========================
   FORGOT PASSWORD (SEND OTP)
======================== */
const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user)
      return res.json({ success: false, message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(user.email, otp);

    res.json({
      success: true,
      message: "OTP sent to email",
      userId: user._id
    });

  } catch (error) {

    console.log(error);
    res.json({ success: false, message: error.message });

  }
};


/* ========================
   VERIFY RESET OTP
======================== */
const verifyResetOtp = async (req, res) => {
  try {

    const { userId, otp } = req.body;

    const user = await userModel.findById(userId);

    if (!user)
      return res.json({ success: false, message: "User not found" });

    if (user.otp !== otp)
      return res.json({ success: false, message: "Invalid OTP" });

    if (user.otpExpiry < Date.now())
      return res.json({ success: false, message: "OTP expired" });

    res.json({ success: true });

  } catch (error) {

    console.log(error);
    res.json({ success: false, message: error.message });

  }
};


/* ========================
   RESET PASSWORD
======================== */
const resetPassword = async (req, res) => {
  try {

    const { userId, newPassword } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
      otp: null,
      otpExpiry: null
    });

    res.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {

    console.log(error);
    res.json({ success: false, message: error.message });

  }
};

export {
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
  cancelAppointment
};