import React, { useContext } from "react";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";

// Import CareSchedule logo
import carescheduleLogo from "../assets/careschedule_logo.jpg";

const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext);
  const { aToken, setAToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-3 text-xs">

        {/* CareSchedule Logo */}
        <img
          onClick={() => navigate("/")}
          className="w-36 sm:w-40 cursor-pointer rounded"
          src={carescheduleLogo}
          alt="CareSchedule Logo"
        />

        {/* Role Label */}
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="bg-primary text-white text-sm px-10 py-2 rounded-full"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
