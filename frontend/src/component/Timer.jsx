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
    <div className="w-40 h-40">
      <CircularProgressbar
        value={percentage}
        text={`${seconds}s`}
        styles={buildStyles({
          textColor: "#111827",
          pathColor: seconds <= 10 ? "#ef4444" : "#2563eb",
          trailColor: "#e5e7eb",
        })}
      />
    </div>
  );
}
