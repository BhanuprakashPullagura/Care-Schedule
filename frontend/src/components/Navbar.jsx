import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  // 👉 Safe default profile icon using upload_area.png
  const profileImage =
    userData?.image && userData.image.trim() !== ""
      ? userData.image
      : assets.upload_area; // using upload_area.png as default

  return (
    <div className="flex items-center justify-between text-sm pt-2 pb-0 border-b border-b-gray-400">
      
      {/* Logo */}
      <div className="w-24 h-24 overflow-hidden">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="Logo"
          className="w-full h-full object-contain cursor-pointer"
        />
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <li className="pb-0.5">
          <NavLink to="/" className={({ isActive }) => (isActive ? "border-b-2 border-primary" : "")}>
            HOME
          </NavLink>
        </li>
        <li className="pb-0.5">
          <NavLink to="/doctors" className={({ isActive }) => (isActive ? "border-b-2 border-primary" : "")}>
            ALL DOCTORS
          </NavLink>
        </li>
        <li className="pb-0.5">
          <NavLink to="/about" className={({ isActive }) => (isActive ? "border-b-2 border-primary" : "")}>
            ABOUT
          </NavLink>
        </li>
        <li className="pb-0.5">
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "border-b-2 border-primary" : "")}>
            CONTACT
          </NavLink>
        </li>
      </ul>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        
        {/* Admin Panel Button */}
        {location.pathname === "/" && (
          <button
            onClick={() => window.open("http://localhost:5174", "_blank")}
            className="bg-primary text-white text-xs px-4 py-2 rounded-full hover:bg-gray-700 hidden md:block"
          >
            Admin Panel
          </button>
        )}

        {/* User Dropdown */}
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            
            {/* Profile Icon */}
            <img
              className="w-12 h-12 rounded-full object-cover border"
              src={profileImage}
              alt="profile"
            />

            <img className="w-2.5" src={assets.dropdown_icon} alt="dropdown" />

            {/* Dropdown Menu */}
            <div className="absolute top-0 right-0 pt-14 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 text-base font-medium text-gray-600">
                <p onClick={() => navigate("/my-profile")} className="hover:text-black cursor-pointer">
                  My Profile
                </p>
                <p onClick={() => navigate("/my-appointments")} className="hover:text-black cursor-pointer">
                  My Appointments
                </p>
                <p onClick={logout} className="hover:text-black cursor-pointer">
                  Logout
                </p>
              </div>
            </div>

          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create Account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt="menu"
        />

        {/* Mobile Menu */}
        <div
          className={`md:hidden ${showMenu ? "fixed w-full" : "h-0 w-0"} right-0 top-0 bottom-0 bg-white z-20 overflow-hidden transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.logo} className="w-36" alt="logo" />
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className="w-7" alt="close" />
          </div>

          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p>HOME</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p>ALL DOCTORS</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p>ABOUT</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p>CONTACT</p>
            </NavLink>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Navbar;
