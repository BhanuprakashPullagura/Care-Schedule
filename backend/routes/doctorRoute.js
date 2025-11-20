import express from 'express';
import { 
  loginDoctor, 
  appointmentsDoctor, 
  appointmentCancel, 
  doctorList,  
  appointmentComplete, 
  doctorDashboard, 
  doctorProfile, 
  updateDoctorProfile, 
  changeAvailability,
  doctorProfileById,
  addPrescription   // ⭐ NEW IMPORT
} from '../controllers/doctorController.js';

import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter = express.Router();

/* ---------------------------------------------------
   ✅ ALWAYS PUT STATIC ROUTES FIRST
----------------------------------------------------- */
doctorRouter.get("/list", doctorList);               // GET ALL DOCTORS
doctorRouter.post("/login", loginDoctor);            // LOGIN

/* ---------------------------------------------------
   AUTH DOCTOR ROUTES
----------------------------------------------------- */
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);

doctorRouter.post("/change-availability", authDoctor, changeAvailability);

doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);

doctorRouter.get("/dashboard", authDoctor, doctorDashboard);

doctorRouter.get("/profile", authDoctor, doctorProfile);

doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);

/* ---------------------------------------------------
   ⭐ NEW ROUTE — ADD PRESCRIPTION
----------------------------------------------------- */
doctorRouter.post("/add-prescription", authDoctor, addPrescription);

/* ---------------------------------------------------
   ⭐ MUST BE LAST ROUTE
----------------------------------------------------- */
doctorRouter.get("/:id", doctorProfileById);

export default doctorRouter;
