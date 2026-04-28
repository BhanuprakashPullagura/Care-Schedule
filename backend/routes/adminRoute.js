import express from 'express'
import {
  addDoctor,
  adminDashboard,
  allDoctors,
  appointmentCancel,
  appointmentsAdmin,
  loginAdmin,
  deleteDoctor,
  changeAvailability
} from '../controllers/adminController.js'

import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'

const adminRouter = express.Router()

// LOGIN
adminRouter.post("/login", loginAdmin)

// ADD DOCTOR
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor)

// ALL DOCTORS
adminRouter.get("/all-doctors", authAdmin, allDoctors)

// CHANGE AVAILABILITY
adminRouter.post("/change-availability", authAdmin, changeAvailability)

// DELETE DOCTOR
adminRouter.delete("/delete-doctor/:doctorId", authAdmin, deleteDoctor)

// ADMIN APPOINTMENTS
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)

// DASHBOARD
adminRouter.get("/dashboard", authAdmin, adminDashboard)

export default adminRouter