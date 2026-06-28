import React, { useState } from "react";
import Step1Setup from "../component/Step1Setup";
import Step2Interview from "../component/Step2Interview";
import Step3Report from "../component/Step3Report";

export default function Interview() {
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 sm:px-6 lg:px-8 py-6">
      {/* Progress */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm md:text-base">
          <span
            className={
              step >= 1 ? "text-blue-500 font-semibold" : "text-gray-500"
            }
          >
            Setup
          </span>

          <span
            className={
              step >= 2 ? "text-blue-500 font-semibold" : "text-gray-500"
            }
          >
            Interview
          </span>

          <span
            className={
              step >= 3 ? "text-blue-500 font-semibold" : "text-gray-500"
            }
          >
            Report
          </span>
        </div>

        <div className="w-full h-2 bg-gray-800 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full bg-blue-600 transition-all duration-500 ${
              step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full"
            }`}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {step === 1 && (
          <Step1Setup
            onStart={(data) => {
              setInterviewData(data);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <Step2Interview
            interviewData={interviewData}
            onFinish={(report) => {
              setInterviewData(report);
              setStep(3);
            }}
          />
        )}

        {step === 3 && <Step3Report report={interviewData} />}
      </div>
    </div>
  );
}
