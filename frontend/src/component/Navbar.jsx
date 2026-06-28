import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaUserCircle, FaSignOutAlt, FaHome } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user"));

  const handleProtectedRoute = (path) => {
    if (!userData) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  const handleAvatarClick = () => {
    if (!userData) {
      navigate("/login");
      return;
    }
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-[#050505] border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
        {/* Logo */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#111] flex items-center justify-center">
            <FaRobot className="text-xl sm:text-2xl text-blue-500" />
          </div>

          <h1 className="font-bold text-lg sm:text-2xl lg:text-3xl">
            <span className="text-white">Interview</span>{" "}
            <span className="text-blue-500">Q.AI</span>
          </h1>
        </div>

        {/* User */}
        <div className="relative flex items-center gap-2 sm:gap-3">
          {/* Desktop Info */}
          <div className="hidden md:block text-right">
            <p className="text-gray-400 text-sm">Welcome</p>

            <p className="text-white font-semibold">
              {userData?.name || "Guest"}
            </p>

            <p className="text-blue-400 text-sm">
              Credits : {userData?.credits ?? 0}
            </p>
          </div>

          {/* Avatar */}
          <div
            onClick={handleAvatarClick}
            className="flex items-center gap-1 sm:gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#111] border border-gray-700 flex items-center justify-center">
              {userData?.name ? (
                <span className="text-white text-lg sm:text-xl font-bold uppercase">
                  {userData.name.charAt(0)}
                </span>
              ) : (
                <FaUserCircle className="text-2xl sm:text-3xl text-blue-500" />
              )}
            </div>

            <IoChevronDown
              className={`text-white transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-14 sm:top-16 w-60 bg-[#111] border border-gray-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-gray-700">
                <p className="text-white font-semibold">
                  {userData?.name || "Guest"}
                </p>

                <p className="text-gray-400 text-sm break-all">
                  {userData?.email}
                </p>

                <p className="text-blue-400 text-sm mt-2">
                  Credits : {userData?.credits ?? 0}
                </p>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  handleProtectedRoute("/");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-blue-600 transition"
              >
                <FaHome />
                Home
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-600 hover:text-white transition"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
