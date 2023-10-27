import React, { useState, useEffect } from "react";

export function Timer({ durationInSeconds }) {
  const [timeRemaining, setTimeRemaining] = useState(durationInSeconds);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    if (timeRemaining === 0) {
      clearInterval(intervalId);
      // Timer has ended, you can perform any desired actions here
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [timeRemaining]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  return (
    <div>
      <p>{formatTime(timeRemaining)}</p>
    </div>
  );
}
