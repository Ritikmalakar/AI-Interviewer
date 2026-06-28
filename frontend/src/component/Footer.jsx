import React from "react";
import { FaRobot } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-4 sm:py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <FaRobot className="text-blue-500 text-xl sm:text-2xl" />

          <h2 className="text-white font-bold text-lg sm:text-xl">
            Interview <span className="text-blue-500">Q.AI</span>
          </h2>
        </div>

        {/* Copyright */}
        <p className="text-gray-400 text-xs sm:text-sm text-center md:text-right">
          © {new Date().getFullYear()} Interview Q.AI. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
