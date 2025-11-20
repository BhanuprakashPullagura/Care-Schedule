import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 🔍 DEBUG LOGS — these help us find the 404 issue
  console.log("Admin Backend URL at runtime:", backendUrl);
  console.log("Admin Token at runtime:", aToken);

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [dashData, setDashData] = useState(null);

  // -------------------------------------
  // Get all doctors
  // -------------------------------------
  const getAllDoctors = async () => {
    try {
      console.log("➡️ Calling:", backendUrl + "/api/admin/all-doctors");
      console.log("➡️ Headers:", { atoken: aToken });

      const { data } = await axios.get(backendUrl + "/api/admin/all-doctors", {
        headers: { atoken: aToken },
      });

      console.log("⬅️ Response:", data);

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ getAllDoctors ERROR:", {
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
      });
      toast.error(error.message || "Error loading doctors");
    }
  };

  // -------------------------------------
  // Change doctor availability
  // -------------------------------------
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        { headers: { atoken: aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ changeAvailability ERROR:", error);
      toast.error(error.message || "Error updating availability");
    }
  };

  // -------------------------------------
  // DELETE DOCTOR
  // -------------------------------------
  const deleteDoctor = async (doctorId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/delete-doctor/${doctorId}`,
        {
          headers: { atoken: aToken },
        }
      );

      if (data.success) {
        toast.success("Doctor deleted successfully");
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ deleteDoctor ERROR:", error);
      toast.error("Failed to delete doctor");
    }
  };

  // -------------------------------------
  // Load all appointments
  // -------------------------------------
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/admin/appointments",
        { headers: { atoken: aToken } }
      );

      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ getAllAppointments ERROR:", error);
      toast.error(error.message || "Error loading appointments");
    }
  };

  // -------------------------------------
  // Cancel appointment
  // -------------------------------------
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { atoken: aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ cancelAppointment ERROR:", error);
      toast.error(error.message || "Error cancelling appointment");
    }
  };

  // -------------------------------------
  // Dashboard
  // -------------------------------------
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { atoken: aToken },
      });

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ getDashData ERROR:", error);
      toast.error("Error loading dashboard");
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,

    doctors,
    getAllDoctors,
    changeAvailability,
    deleteDoctor,

    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,

    getDashData,
    dashData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
