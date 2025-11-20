import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const currencySymbol = "₹";

  /* STATE */
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);

  /* ----------------------------------
        GET ALL DOCTORS
  -------------------------------------*/
  const loadDoctorsFromDB = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error("Failed to load doctors");
      }
    } catch (err) {
      console.log("Doctor fetch error:", err);
      toast.error("Error loading doctors");
    }
  };

  useEffect(() => {
    if (backendUrl) loadDoctorsFromDB();
  }, [backendUrl]);


  /* ----------------------------------
        LOAD USER PROFILE
  -------------------------------------*/
  const loadUserProfileData = async () => {
    try {
      if (!token) return;

      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { token },
      });

      if (data.success) {
        const u = data.userData || {};

        setUserData({
          name: u.name || "",
          email: u.email || "",
          gender: u.gender || "",
          dob: u.dob || "",
          address: {
            line1: u.address?.line1 || "",
            line2: u.address?.line2 || "",
            city: u.address?.city || "",
            state: u.address?.state || "",
            pincode: u.address?.pincode || "",
          },
        });
      } else {
        toast.error(data.message);
      }

    } catch (err) {
      console.log("Profile load error:", err);
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    if (backendUrl) loadUserProfileData();
  }, [token, backendUrl]);


  /* CONTEXT value */
  const value = {
    backendUrl,
    currencySymbol,

    doctors,
    loadDoctorsFromDB,

    token,
    setToken,

    userData,
    setUserData,

    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
