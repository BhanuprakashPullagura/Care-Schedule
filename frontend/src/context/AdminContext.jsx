import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);

  // ✔ Backend URL (You can keep static or move to .env)
  const backendUrl = "http://localhost:4000";

  /* -----------------------------------------
     FETCH ALL DOCTORS
  ----------------------------------------- */
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/all-doctors`,
        {
          headers: { Authorization: `Bearer ${aToken}` }
        }
      );

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Unable to fetch doctors");
    }
  };

  /* -----------------------------------------
     DELETE DOCTOR
  ----------------------------------------- */
  const deleteDoctor = async (doctorId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/delete-doctor/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${aToken}` }
        }
      );

      if (data.success) {
        toast.success("Doctor deleted successfully");
        getAllDoctors(); // Refresh list after delete
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to delete doctor");
    }
  };

  return (
    <AdminContext.Provider
      value={{
        aToken,
        setAToken,
        doctors,
        getAllDoctors,
        deleteDoctor,
        backendUrl
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
