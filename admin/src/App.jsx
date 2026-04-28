import React, { useContext } from "react";
import { DoctorContext } from "./context/DoctorContext";
import { AdminContext } from "./context/AdminContext";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";

import Login from "./pages/Login.jsx";  // FIXED

import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

const App = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);
  const location = useLocation();

  // Redirect "/" automatically
  if (location.pathname === "/") {
    if (aToken) return <Navigate to="/admin-dashboard" replace />;
    if (dToken) return <Navigate to="/doctor-dashboard" replace />;
  }

  // ----------- ADMIN ROUTES -----------
  if (aToken) {
    return (
      <div className="bg-[#F8F9FD]">
        <ToastContainer />
        <Navbar />
        <div className="flex items-start">
          <Sidebar />

          <Routes>
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/all-appointments" element={<AllAppointments />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctor-list" element={<DoctorsList />} />

            <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
          </Routes>
        </div>
      </div>
    );
  }

  // ----------- DOCTOR ROUTES -----------
  if (dToken) {
    return (
      <div className="bg-[#F8F9FD]">
        <ToastContainer />
        <Navbar />
        <div className="flex items-start">
          <Sidebar />

          <Routes>
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-appointments" element={<DoctorAppointments />} />
            <Route path="/doctor-profile" element={<DoctorProfile />} />

            <Route path="*" element={<Navigate to="/doctor-dashboard" replace />} />
          </Routes>
        </div>
      </div>
    );
  }

  // ----------- LOGIN PAGE -----------
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
