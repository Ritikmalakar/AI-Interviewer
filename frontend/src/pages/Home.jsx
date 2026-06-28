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
    if (!userData) {
      navigate("/login");
      return;
    }

    navigate("/interview");
  };

  const handleHistory = () => {
    if (!userData) {
      navigate("/login");
      return;
    }

    navigate("/history");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_30px_#2563eb]">
            <FaRobot className="text-6xl" />
          </div>

          <h1 className="text-5xl font-bold mt-8">AI Interview Platform</h1>

          <p className="text-gray-400 mt-6 max-w-2xl text-lg">
            Practice real interview questions powered by Artificial
            Intelligence. Improve your communication, confidence and technical
            skills with instant AI feedback.
          </p>

          <div className="flex gap-5 mt-10">
            <button
              onClick={handleStartInterview}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-semibold transition"
            >
              <FaPlayCircle />
              Start Interview
            </button>

            <button
              onClick={handleHistory}
              className="flex items-center gap-3 border border-blue-500 hover:bg-blue-600 px-8 py-4 rounded-xl text-lg transition"
            >
              <FaHistory />
              History
            </button>
          </div>
        </div>

        {/* Features */}

        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-[#111] rounded-2xl p-8 border border-gray-800 hover:border-blue-500 transition">
            <FaBrain className="text-5xl text-blue-500 mb-5" />

            <h2 className="text-2xl font-bold">AI Questions</h2>

            <p className="text-gray-400 mt-3">
              AI generates smart interview questions based on your selected
              technology.
            </p>
          </div>

          <div className="bg-[#111] rounded-2xl p-8 border border-gray-800 hover:border-blue-500 transition">
            <FaMicrophone className="text-5xl text-blue-500 mb-5" />

            <h2 className="text-2xl font-bold">Voice Interview</h2>

            <p className="text-gray-400 mt-3">
              Answer questions using your microphone for a real interview
              experience.
            </p>
          </div>

          <div className="bg-[#111] rounded-2xl p-8 border border-gray-800 hover:border-blue-500 transition">
            <FaChartLine className="text-5xl text-blue-500 mb-5" />

            <h2 className="text-2xl font-bold">AI Feedback</h2>

            <p className="text-gray-400 mt-3">
              Get instant AI analysis, score and suggestions to improve your
              interview performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
