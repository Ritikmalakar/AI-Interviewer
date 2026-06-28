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

  // Load Voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      const female =
        voices.find((v) => v.name.includes("Microsoft Zira")) ||
        voices.find((v) => v.name.includes("Google UK English Female")) ||
        voices.find((v) => v.name.includes("Samantha")) ||
        voices.find((v) => v.lang.startsWith("en"));

      setSelectedVoice(female || null);
    };

    loadVoices();

    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  // Text To Speech
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

        if (videoRef.current) {
          videoRef.current.play();
        }
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

  // Speech Recognition
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

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  // Intro + Question Voice
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
  // Submit Answer
  const submitAnswer = async (timeTaken = 0) => {
    try {
      setIsSubmitting(true);

      stopListening();

      const { data } = await baseUrlInterview.post("/submitAnswer", {
        interviewId,
        questionIndex: currentIndex,
        answer,
        timeTaken,
      });

      if (data.success) {
        // Backend kabhi feedback direct aur kabhi data.feedback return karta hai
        setFeedback(data.data?.feedback || data.feedback || "");

        setTimeout(() => {
          if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setAnswer("");
            setFeedback("");
          } else {
            finishInterview();
          }
        }, 2500);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Timer Complete
  const handleTimerComplete = () => {
    submitAnswer(currentQuestion?.timeLimit || 60);
  };

  // Manual Submit
  const handleManualSubmit = () => {
    submitAnswer(0);
  };

  // Finish Interview
  const finishInterview = async () => {
    try {
      setIsSubmitting(true);

      stopListening();

      window.speechSynthesis.cancel();

      const { data } = await baseUrlInterview.post("/finishInterview", {
        interviewId,
      });

      if (data.success) {
        onFinish(data.result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* LEFT SIDE */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col">
            <div className="bg-blue-600 py-4 px-6">
              <h2 className="text-white text-xl sm:text-2xl font-bold flex items-center justify-center gap-3">
                <FaRobot />
                AI Interviewer
              </h2>
            </div>

            <div className="flex-1 p-4 sm:p-6">
              <video
                ref={videoRef}
                src={femaleVideo}
                muted
                playsInline
                className="w-full aspect-video rounded-2xl object-cover bg-black"
              />

              <div className="flex justify-center mt-6">
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

                  <h2 className="text-3xl font-bold text-blue-700">
                    {currentIndex + 1}
                  </h2>

                  <p className="text-gray-600">Current Question</p>
                </div>

                <div className="bg-green-50 rounded-xl p-5 text-center">
                  <FaCheckCircle className="mx-auto text-green-600 text-3xl mb-2" />

                  <h2 className="text-3xl font-bold text-green-700">
                    {questions.length}
                  </h2>

                  <p className="text-gray-600">Total Questions</p>
                </div>
              </div>

              {isAIPlaying && (
                <div className="mt-6 bg-blue-100 rounded-xl p-5">
                  <h3 className="font-bold text-blue-700">🤖 AI Speaking...</h3>

                  <p className="mt-3 text-blue-700">{subtitle}</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-8 flex flex-col text-gray-900">
            <h1 className="text-3xl font-bold">AI Smart Interview</h1>

            <p className="text-gray-600 mt-2">
              Welcome <span className="font-semibold">{userName}</span>
            </p>

            <div className="mt-6 bg-slate-100 rounded-xl p-5">
              <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm">
                Question {currentIndex + 1} / {questions.length}
              </h2>

              <p className="mt-4 text-lg sm:text-xl font-semibold text-gray-900">
                {currentQuestion?.question}
              </p>
            </div>

            <div className="mt-6 flex-1 flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">
                Your Answer
              </label>

              <textarea
                rows={8}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type or speak your answer here..."
                className="w-full flex-1 border border-gray-300 rounded-xl p-4 resize-none bg-white text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Voice Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <button
                onClick={startListening}
                disabled={isListening || isSubmitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl py-3 flex items-center justify-center gap-2 transition"
              >
                <FaMicrophone />
                Start Speaking
              </button>

              <button
                onClick={stopListening}
                disabled={!isListening}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-xl py-3 flex items-center justify-center gap-2 transition"
              >
                <FaStop />
                Stop Speaking
              </button>
            </div>

            {isListening && (
              <div className="mt-4 bg-red-100 border border-red-300 rounded-xl p-4 text-center text-red-700 font-semibold">
                🎤 Listening... Speak now
              </div>
            )}

            {feedback && (
              <div className="mt-5 bg-green-50 border border-green-300 rounded-xl p-5">
                <h3 className="font-bold text-green-700">AI Feedback</h3>

                <p className="mt-2 text-gray-800 whitespace-pre-wrap">
                  {feedback}
                </p>
              </div>
            )}

            {isSubmitting && (
              <div className="mt-5 text-center text-blue-600 font-semibold">
                Evaluating your answer...
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <button
                onClick={handleManualSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl py-3 font-semibold transition"
              >
                Submit Answer
              </button>

              <button
                onClick={finishInterview}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-xl py-3 font-semibold transition"
              >
                Finish Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
