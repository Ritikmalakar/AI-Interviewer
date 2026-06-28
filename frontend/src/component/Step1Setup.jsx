import React, { useState } from "react";
import {
  FaChartLine,
  FaFileUpload,
  FaMicrophone,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { baseUrlInterview } from "../../Axios";

export default function Step1Setup({ onStart }) {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [resume, setResume] = useState(null);
  const [mode, setMode] = useState("");

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const features = [
    {
      icon: <FaUser className="text-blue-500 text-3xl" />,
      text: "Choose Role & Experience",
    },
    {
      icon: <FaMicrophone className="text-green-500 text-3xl" />,
      text: "Smart Voice Interview",
    },
    {
      icon: <FaChartLine className="text-yellow-500 text-3xl" />,
      text: "Performance Analysis",
    },
  ];

  // Resume Upload
  const handleUploadResume = async () => {
    if (!resume) {
      toast.error("Please select a resume.");
      return;
    }

    try {
      setAnalyzing(true);

      const formData = new FormData();
      formData.append("resume", resume);

      const { data } = await baseUrlInterview.post("/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setProjects(data.projects || []);
        setSkills(data.skills || []);
        setResumeText(data.resumeText || "");
        setAnalysisDone(true);

        toast.success(data.message || "Resume analyzed successfully.");
      } else {
        toast.error(data.message || "Resume analysis failed.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Resume upload failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Start Interview
  const handleStart = async () => {
    if (!role || !experience || !mode) {
      toast.error("Please fill all fields.");
      return;
    }

    if (!analysisDone) {
      toast.error("Please analyze your resume first.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await baseUrlInterview.post("/generateQues", {
        role,
        experience,
        mode,
        projects,
        skills,
        resumeText,
      });

      if (data.success) {
        onStart(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to generate interview."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-10">
        AI Interview Setup
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="flex justify-center mb-4">{item.icon}</div>
            <p className="font-semibold">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-5">
        <input
          type="text"
          placeholder="Frontend Developer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option value="">Select Experience</option>
          <option value="Fresher">Fresher</option>
          <option value="1 Year">1 Year</option>
          <option value="2 Years">2 Years</option>
          <option value="3+ Years">3+ Years</option>
        </select>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option value="">Select Interview Mode</option>
          <option value="Technical">Technical Interview</option>
          <option value="HR">HR Interview</option>
        </select>

        {!analysisDone ? (
          <>
            <div className="flex items-center gap-2">
              <FaFileUpload className="text-blue-600 text-xl" />
              <span>Upload Resume (PDF)</span>
            </div>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              className="w-full"
            />

            <button
              onClick={handleUploadResume}
              disabled={analyzing}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {analyzing ? "Analyzing..." : "Analyze Resume"}
            </button>
          </>
        ) : (
          <div className="bg-green-100 border border-green-500 rounded-lg p-4">
            <h3 className="font-bold text-green-700">
              ✅ Resume Analysis Completed
            </h3>

            <p className="mt-2">
              <strong>Skills:</strong>{" "}
              {skills.length ? skills.join(", ") : "N/A"}
            </p>

            <p className="mt-2">
              <strong>Projects:</strong>{" "}
              {projects.length ? projects.join(", ") : "N/A"}
            </p>
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={!analysisDone || loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Starting Interview..." : "Start Interview"}
        </button>
      </div>
    </div>
  );
}
