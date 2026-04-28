import axios from "axios";
import React, { useContext, useState } from "react";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Admin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Backend URL from admin/.env
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { setDToken } = useContext(DoctorContext);
  const { setAToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Admin") {
        const { data } = await axios.post(
          `${backendUrl}/api/admin/login`,
          { email, password }
        );

        if (data.success) {
          setAToken(data.token);
          localStorage.setItem("aToken", data.token);
          window.location.href = "/admin-dashboard";
        } else {
          toast.error(data.message);
        }

      } else {
        const { data } = await axios.post(
          `${backendUrl}/api/doctor/login`,
          { email, password }
        );

        if (data.success) {
          setDToken(data.token);
          localStorage.setItem("dToken", data.token);
          window.location.href = "/doctor-dashboard";
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      console.error(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 border rounded-xl shadow-lg">

        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>

        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          Login
        </button>

        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span onClick={() => setState("Doctor")} className="text-primary underline cursor-pointer">
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span onClick={() => setState("Admin")} className="text-primary underline cursor-pointer">
              Click here
            </span>
          </p>
        )}

      </div>
    </form>
  );
};

export default Login;
