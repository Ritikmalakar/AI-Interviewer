import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRobot,
  FaPlayCircle,
  FaHistory,
  FaBrain,
  FaMicrophone,
  FaChartLine,
} from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("user"));

  const handleStartInterview = () => {
    if (!userData) return navigate("/login");
    navigate("/interview");
  };

  const handleHistory = () => {
    if (!userData) return navigate("/login");
    navigate("/history");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Hero */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_30px_#2563eb]">
            <FaRobot className="text-4xl sm:text-5xl lg:text-6xl" />
          </div>

          <h1 className="mt-6 sm:mt-8 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            AI Interview Platform
          </h1>

          <p className="mt-5 max-w-2xl text-gray-400 text-base sm:text-lg leading-relaxed">
            Practice real interview questions powered by Artificial
            Intelligence. Improve your communication, confidence and technical
            skills with instant AI feedback.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 mt-8 sm:mt-10">
            <button
              onClick={handleStartInterview}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition"
            >
              <FaPlayCircle />
              Start Interview
            </button>

            <button
              onClick={handleHistory}
              className="w-full sm:w-auto flex items-center justify-center gap-3 border border-blue-500 hover:bg-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg transition"
            >
              <FaHistory />
              History
            </button>
          </div>
        </div>

        {/* Features */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-20 lg:mt-24">
          <div className="bg-[#111] rounded-2xl p-6 sm:p-8 border border-gray-800 hover:border-blue-500 transition">
            <FaBrain className="text-4xl sm:text-5xl text-blue-500 mb-5" />

            <h2 className="text-xl sm:text-2xl font-bold">AI Questions</h2>

            <p className="text-gray-400 mt-3 text-sm sm:text-base leading-relaxed">
              AI generates smart interview questions based on your selected
              technology.
            </p>
          </div>

          <div className="bg-[#111] rounded-2xl p-6 sm:p-8 border border-gray-800 hover:border-blue-500 transition">
            <FaMicrophone className="text-4xl sm:text-5xl text-blue-500 mb-5" />

            <h2 className="text-xl sm:text-2xl font-bold">Voice Interview</h2>

            <p className="text-gray-400 mt-3 text-sm sm:text-base leading-relaxed">
              Answer questions using your microphone for a real interview
              experience.
            </p>
          </div>

          <div className="bg-[#111] rounded-2xl p-6 sm:p-8 border border-gray-800 hover:border-blue-500 transition">
            <FaChartLine className="text-4xl sm:text-5xl text-blue-500 mb-5" />

            <h2 className="text-xl sm:text-2xl font-bold">AI Feedback</h2>

            <p className="text-gray-400 mt-3 text-sm sm:text-base leading-relaxed">
              Get instant AI analysis, score and suggestions to improve your
              interview performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
