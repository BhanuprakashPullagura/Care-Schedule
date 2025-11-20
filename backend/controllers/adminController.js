import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";

/* ========================
   ADMIN LOGIN
======================== */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { role: "admin", email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({ success: true, token });
    }

    return res.json({
      success: false,
      message: "Invalid credentials",
    });
  } catch (error) {
    console.log("Admin Login Error:", error);
    return res.json({ success: false, message: error.message });
  }
};

/* ========================
   ADD DOCTOR
======================== */
export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password too short" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = "";
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      imageUrl = uploaded.secure_url;
    }

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      image: imageUrl,
      address: JSON.parse(address),
      date: Date.now(),
      available: true,
    };

    const newDoc = new doctorModel(doctorData);
    await newDoc.save();

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.log("Add Doctor Error:", error);
    res.json({ success: false, message: error.message });
  }
};

/* ========================
   DELETE DOCTOR
======================== */
export const deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;

    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    await doctorModel.findByIdAndDelete(doctorId);

    res.json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    console.log("Delete Doctor Error:", error);
    res.json({
      success: false,
      message: "Server error while deleting doctor",
    });
  }
};

/* ========================
   GET ALL DOCTORS
======================== */
export const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log("All Doctors Error:", error);
    res.json({ success: false, message: error.message });
  }
};

/* ========================
   CHANGE AVAILABILITY  ✅ NEW
======================== */
export const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    res.json({
      success: true,
      message: "Availability Updated",
    });
  } catch (error) {
    console.log("Availability Change Error:", error);
    res.json({ success: false, message: error.message });
  }
};

/* ========================
   GET ALL APPOINTMENTS
======================== */
export const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log("Appointments Admin Error:", error);
    res.json({ success: false, message: error.message });
  }
};

/* ========================
   ADMIN CANCEL APPOINTMENT
======================== */
export const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appt = await appointmentModel.findById(appointmentId);
    if (!appt) return res.json({ success: false, message: "Not found" });

    if (appt.cancelled) {
      return res.json({ success: false, message: "Already cancelled" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const { docId, slotDate, slotTime } = appt;

    const doctor = await doctorModel.findById(docId);

    if (doctor?.slots_booked?.[slotDate]) {
      doctor.slots_booked[slotDate] = doctor.slots_booked[slotDate].filter(
        (time) => time !== slotTime
      );

      await doctorModel.findByIdAndUpdate(docId, {
        slots_booked: doctor.slots_booked,
      });
    }

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log("Appointment Cancel Error:", error);
    res.json({ success: false, message: error.message });
  }
};

/* ========================
   ADMIN DASHBOARD
======================== */
export const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.countDocuments();
    const users = await userModel.countDocuments();
    const appointments = await appointmentModel
      .find({})
      .sort({ date: -1 });

    const dashData = {
      doctors,
      patients: users,
      appointments: appointments.length,
      latestAppointments: appointments.slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log("Dashboard Error:", error);
    res.json({ success: false, message: error.message });
  }
};
