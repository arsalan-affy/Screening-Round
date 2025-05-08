import React from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaBan, FaListOl } from "react-icons/fa";

const Instructions = () => {
  const navigate = useNavigate();
  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  };
  const handleNext = () => {
    try {
      enterFullscreen();
    } catch (error) {
      toast.error("Failed to enter fullscreen mode.");
    }
    navigate("/basic-details");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-200 to-blue-300 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center flex-col px-4 py-10">
      <h1 className="text-4xl font-semibold text-center text-zinc-900 dark:text-white mb-10">
        Affy Cloud AI Screening Round
      </h1>

      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl max-w-2xl w-full p-8 md:p-12 space-y-8">
        <h3 className="text-2xl md:text-3xl font-semibold text-center text-zinc-900 dark:text-white">
          Please read the instructions carefully:
        </h3>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <div className="flex items-start gap-5">
            <FaListOl className="text-3xl text-zinc-900 dark:text-white" />
            <p className="text-lg md:text-xl">
              You will be presented with <strong>10 questions</strong> in total.
            </p>
          </div>

          <div className="flex items-start gap-5">
            <FaClock className="text-3xl text-zinc-900 dark:text-white" />
            <p className="text-lg md:text-xl">
              Each question has a time limit of <strong>1 minute</strong>. Once
              time is up, you will be auto-moved to the next question.
            </p>
          </div>

          <div className="flex items-start gap-5">
            <FaBan className="text-3xl text-zinc-900 dark:text-white" />
            <p className="text-lg md:text-xl">
              <strong>Tab switching is not allowed</strong>. Navigating away
              from the test window may result in disqualification.
            </p>
          </div>
        </div>

        <div className="text-center pt-6">
          <button
            onClick={handleNext}
            className="bg-zinc-900 hover:bg-zinc-950 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300"
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
