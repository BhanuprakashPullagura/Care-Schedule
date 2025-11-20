import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

/* =====================================================
   DOCTOR LOGIN
===================================================== */
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await doctorModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================================
   GET DOCTOR DETAILS BY ID (PUBLIC)
===================================================== */
const doctorProfileById = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.params.id).select("-password");

    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    res.json({ success: true, doctor });
  } catch (error) {
    res.json({ success: false, message: "Invalid doctor ID" });
  }
};

/* =====================================================
   DOCTOR APPOINTMENTS
===================================================== */
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.userId || req.body.docId;

    const appointments = await appointmentModel
      .find({ docId })
      .populate("userId", "name image dob");

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================================
   CANCEL APPOINTMENT
===================================================== */
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.userId || req.body.docId;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.docId.toString() !== docId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Invalid doctor or appointment",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================================
   COMPLETE APPOINTMENT
===================================================== */
const appointmentComplete = async (req, res) => {
  try {
    const docId = req.userId || req.body.docId;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.docId.toString() !== docId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Invalid doctor or appointment",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });

    res.json({ success: true, message: "Appointment Completed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================================
   ADD PRESCRIPTION  ⭐ NEW
===================================================== */
const addPrescription = async (req, res) => {
  try {
    const { appointmentId, prescription } = req.body;
    const docId = req.userId || req.body.docId;

    const appt = await appointmentModel.findById(appointmentId);
    if (!appt) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Optional: verify doctor belongs to this appointment
    if (appt.docId.toString() !== docId.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    appt.prescription = prescription;
    await appt.save();

    res.json({ success: true, message: "Prescription added" });

  } catch (error) {
    console.log("Add Prescription Error:", error);
    res.json({ success: false, message: error.message });
  }
};

/* =====================================================
   GET ALL DOCTORS
===================================================== */
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password -email");
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================================
   CHANGE AVAILABILITY
===================================================== */
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    res.json({ success: true, message: "Availability changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================================
   DOCTOR PROFILE (SELF)
===================================================== */
const doctorProfile = async (req, res) => {
  try {
    const docId = req.userId || req.body.docId;
    const profile = await doctorModel.findById(docId).select("-password");

    res.json({ success: true, profileData: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================================
   UPDATE DOCTOR PROFILE
===================================================== */
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.userId || req.body.docId;
    const { fees, address, available, about } = req.body;

    await doctorModel.findByIdAndUpdate(docId, {
      fees,
      address,
      available,
      about,
    });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================================
   DOCTOR DASHBOARD (FIXED)
===================================================== */
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.userId || req.body.docId;

    const appointments = await appointmentModel
      .find({ docId })
      .populate("userId", "name image dob");

    let earnings = 0;
    const patientSet = new Set();

    const formatted = appointments.map((a) => {
      if (a.isCompleted || a.payment) earnings += a.amount;
      if (a.userId) patientSet.add(a.userId._id.toString());

      return {
        _id: a._id,
        userData: a.userId,
        slotDate: a.slotDate,
        slotTime: a.slotTime,
        isCompleted: a.isCompleted,
        cancelled: a.cancelled,
        amount: a.amount,
      };
    });

    res.json({
      success: true,
      dashData: {
        earnings,
        appointments: formatted.length,
        patients: patientSet.size,
        latestAppointments: formatted.reverse().slice(0, 5),
      },
    });
  } catch (error) {
    console.log("Dashboard ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorList,
  changeAvailability,
  doctorProfile,
  updateDoctorProfile,
  doctorDashboard,
  doctorProfileById,
  addPrescription,   
};
