import React from "react";
import { FaRobot } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <FaRobot className="text-blue-500 text-2xl" />
          <h2 className="text-white text-xl font-bold">
            Interview <span className="text-blue-500">Q.AI</span>
          </h2>
        </div>

        {/* Copyright */}
        <p className="text-gray-400 text-sm mt-3 md:mt-0">
          © {new Date().getFullYear()} Interview Q.AI. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
