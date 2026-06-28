import React, { useEffect, useRef, useState } from "react";
import femaleVideo from "../assets/videos/female-ai.mp4";
import Timer from "./Timer";
import {
  FaRobot,
  FaRegClock,
  FaCheckCircle,
  FaMicrophone,
  FaStop,
} from "react-icons/fa";
import { baseUrlInterview } from "../../Axios";

export default function Step2Interview({ interviewData, onFinish }) {
  const {
    interviewId,
    questions: rawQuestions,
    userName = "User",
  } = interviewData || {};

  const questions = rawQuestions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [isIntro, setIsIntro] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  // ========================== Load Voice ==========================
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const female =
        voices.find((v) => v.name.includes("Microsoft Zira")) ||
        voices.find((v) => v.name.includes("Google UK English Female")) ||
        voices.find((v) => v.name.includes("Samantha")) ||
        voices.find((v) => v.lang.startsWith("en"));

      setSelectedVoice(female);
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  // ========================== Text to Speech ==========================
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!selectedVoice) return resolve();

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        setSubtitle(text);
        videoRef.current?.play();
      };

      utterance.onend = () => {
        setIsAIPlaying(false);
        setSubtitle("");
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  // ========================== Speech Recognition ==========================
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }
      setAnswer(transcript.trim());
    };

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, []);

  const startListening = () => recognitionRef.current?.start();
  const stopListening = () => recognitionRef.current?.stop();

  // ========================== Speak Intro & Question ==========================
  useEffect(() => {
    if (!selectedVoice) return;

    const run = async () => {
      if (isIntro) {
        await speakText(
          `Hello ${userName}. Welcome to your AI Interview. Best of luck.`
        );
        setIsIntro(false);
      } else if (currentQuestion?.question) {
        await speakText(currentQuestion.question);
      }
    };
    run();
  }, [selectedVoice, currentIndex, isIntro, userName, currentQuestion]);

  // ========================== Submit Answer ==========================
  const submitAnswer = async (timeTaken = 0) => {
    if (!currentQuestion || isSubmitting) return;

    setIsSubmitting(true);
    setFeedback("");

    try {
      const response = await baseUrlInterview.post("/submitAnswer", {
        interviewId,
        questionIndex: currentIndex,
        answer: answer.trim(),
        timeTaken: Number(timeTaken),
      });

      setFeedback(response.data.feedback || "Answer submitted successfully!");

      // Next Question or Finish
      // Next Question or Finish
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setAnswer("");
        setFeedback("");
      } else {
        await finishInterview();
      }
    } catch (error) {
      console.error("Submit Error:", error);
      setFeedback(
        error.response?.data?.message ||
          "Failed to submit answer. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimerComplete = (timeTaken) => {
    submitAnswer(timeTaken);
  };

  const handleManualSubmit = () => submitAnswer(0);

  const finishInterview = async () => {
    try {
      const response = await baseUrlInterview.post("/finishInterview", {
        interviewId,
      });

      console.log(response.data);

      onFinish(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* ================= LEFT - AI VIDEO ================= */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 py-4">
            <h2 className="text-white text-2xl font-bold flex items-center justify-center gap-3">
              <FaRobot /> AI Interviewer
            </h2>
          </div>

          <div className="p-6">
            <video
              ref={videoRef}
              src={femaleVideo}
              muted
              playsInline
              className="w-full h-[340px] rounded-2xl object-cover"
            />

            <div className="mt-6 flex justify-center">
              <Timer
                key={currentIndex}
                timeLeft={currentQuestion?.timeLimit || 60}
                totalTime={currentQuestion?.timeLimit || 60}
                onComplete={handleTimerComplete}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-blue-50 rounded-xl p-5 text-center">
                <FaRegClock className="mx-auto text-blue-600 text-3xl mb-2" />
                <h2 className="text-3xl font-bold">{currentIndex + 1}</h2>
                <p className="text-gray-600">Current Question</p>
              </div>
              <div className="bg-green-50 rounded-xl p-5 text-center">
                <FaCheckCircle className="mx-auto text-green-600 text-3xl mb-2" />
                <h2 className="text-3xl font-bold">{questions.length}</h2>
                <p className="text-gray-600">Total Questions</p>
              </div>
            </div>

            {isAIPlaying && (
              <div className="mt-8 bg-blue-100 rounded-xl p-5">
                <h3 className="font-bold text-blue-700">🤖 AI Speaking...</h3>
                <p className="mt-3 text-blue-700 leading-7">{subtitle}</p>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT - USER SIDE ================= */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold">AI Smart Interview</h1>
          <p className="text-gray-500 mt-2">
            Welcome <span className="font-semibold">{userName}</span>
          </p>

          {/* Question */}
          <div className="mt-8 bg-slate-100 rounded-xl p-6">
            <h2 className="text-blue-600 font-bold">
              Question {currentIndex + 1} / {questions.length}
            </h2>
            <p className="mt-5 text-xl font-semibold leading-relaxed">
              {currentQuestion?.question}
            </p>
          </div>

          {/* Answer Area */}
          <div className="mt-8">
            <label className="font-semibold block mb-2">Your Answer</label>
            <textarea
              rows={10}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type or speak your answer here..."
              className="w-full border rounded-xl p-4 resize-none outline-none focus:border-blue-600"
            />
          </div>

          {/* Voice Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-5">
            <button
              onClick={startListening}
              disabled={isListening}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl py-3 flex items-center justify-center gap-2 transition"
            >
              <FaMicrophone /> Start Speaking
            </button>
            <button
              onClick={stopListening}
              disabled={!isListening}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-xl py-3 flex items-center justify-center gap-2 transition"
            >
              <FaStop /> Stop Speaking
            </button>
          </div>

          {isListening && (
            <div className="mt-5 bg-red-100 text-red-700 rounded-xl p-4 text-center font-semibold">
              🎤 Listening... Speak now
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-5">
              <h3 className="font-bold text-green-700">AI Feedback</h3>
              <p className="mt-2">{feedback}</p>
            </div>
          )}

          {isSubmitting && (
            <div className="mt-6 text-center text-blue-600 font-semibold">
              Evaluating your answer...
            </div>
          )}

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
              onClick={handleManualSubmit}
              disabled={isSubmitting || !answer.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition"
            >
              Submit Answer
            </button>

            <button
              onClick={finishInterview}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition"
            >
              Finish Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
