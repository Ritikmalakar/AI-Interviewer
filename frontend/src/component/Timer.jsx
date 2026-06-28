import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Timer({ timeLeft = 60, totalTime = 60, onComplete }) {
  const [seconds, setSeconds] = useState(timeLeft);

  useEffect(() => {
    setSeconds(timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds, onComplete]);

  const percentage = (seconds / totalTime) * 100;

  return (
    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 mx-auto">
      <CircularProgressbar
        value={percentage}
        text={`${seconds}s`}
        styles={buildStyles({
          textColor: "#111827",
          textSize: "18px",
          pathColor: seconds <= 10 ? "#ef4444" : "#2563eb",
          trailColor: "#e5e7eb",
          strokeLinecap: "round",
        })}
      />
    </div>
  );
}
