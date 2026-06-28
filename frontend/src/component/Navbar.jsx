import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRobot,
  FaUserCircle,
  FaHistory,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // LocalStorage se user data
  const userData = JSON.parse(localStorage.getItem("user"));

  // Login check
  const handleProtectedRoute = (path) => {
    if (!userData) {
      navigate("/login");
      return;
    }

    navigate(path);
  };

  // Avatar click
  const handleAvatarClick = () => {
    if (!userData) {
      navigate("/login");
      return;
    }

    setOpen(!open);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-[#050505] border-b border-gray-800">
      <div className="max-w-7xl mx-auto h-20 px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-[#111] flex items-center justify-center">
            <FaRobot className="text-2xl text-blue-500" />
          </div>

          <h1 className="text-3xl font-bold">
            <span className="text-white">Interview</span>{" "}
            <span className="text-blue-500">Q.AI</span>
          </h1>
        </div>

        {/* User */}
        <div className="relative flex items-center gap-3">
          <div className="hidden sm:block text-right">
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
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#111] border border-gray-700 flex items-center justify-center">
              {userData?.name ? (
                <span className="text-white text-xl font-bold uppercase">
                  {userData.name.charAt(0)}
                </span>
              ) : (
                <FaUserCircle className="text-3xl text-blue-500" />
              )}
            </div>

            <IoChevronDown
              className={`text-white transition ${open ? "rotate-180" : ""}`}
            />
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-16 w-56 bg-[#111] border border-gray-700 rounded-lg shadow-xl">
              <div className="p-4 border-b border-gray-700">
                <p className="text-white font-semibold">{userData?.name}</p>

                <p className="text-gray-400 text-sm">{userData?.email}</p>

                <p className="text-blue-400 text-sm mt-2">
                  Credits : {userData?.credits ?? 0}
                </p>
              </div>

              {/* History */}
              <button
                onClick={() => {
                  setOpen(false);
                  handleProtectedRoute("/");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-blue-600"
              >
                <FaHome />
                <span>Home</span>
              </button>

              {/* History */}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
