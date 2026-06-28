import React from "react";
import { FaAward, FaCheckCircle, FaComments, FaBrain } from "react-icons/fa";

export default function Step3Report({ report }) {
  if (!report) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-bold">
        Report Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-center text-blue-700">
          AI Interview Report
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Your interview has been completed successfully.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <div className="bg-blue-50 rounded-2xl p-6 text-center">
            <FaAward className="text-5xl text-blue-600 mx-auto mb-3" />
            <h2 className="text-3xl font-bold">{report.finalScore}%</h2>
            <p>Final Score</p>
          </div>

          <div className="bg-green-50 rounded-2xl p-6 text-center">
            <FaBrain className="text-5xl text-green-600 mx-auto mb-3" />
            <h2 className="text-3xl font-bold">{report.avgConfidence}%</h2>
            <p>Confidence</p>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-6 text-center">
            <FaComments className="text-5xl text-yellow-600 mx-auto mb-3" />
            <h2 className="text-3xl font-bold">{report.avgCommunication}%</h2>
            <p>Communication</p>
          </div>

          <div className="bg-purple-50 rounded-2xl p-6 text-center">
            <FaCheckCircle className="text-5xl text-purple-600 mx-auto mb-3" />
            <h2 className="text-3xl font-bold">{report.avgCorrectness}%</h2>
            <p>Correctness</p>
          </div>
        </div>

        <div className="mt-10 bg-slate-100 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Interview Summary</h2>

          <p className="text-lg">
            Total Questions :
            <span className="font-bold ml-2">{report.totalQuestions}</span>
          </p>

          <p className="text-lg mt-3">
            Overall Performance :
            <span
              className={`ml-2 font-bold ${
                report.finalScore >= 80
                  ? "text-green-600"
                  : report.finalScore >= 60
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {report.finalScore >= 80
                ? "Excellent"
                : report.finalScore >= 60
                ? "Good"
                : "Needs Improvement"}
            </span>
          </p>
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-semibold"
          >
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
}
