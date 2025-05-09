import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClock,
  FaBan,
  FaListOl,
  FaVideo,
  FaEye,
  FaPlayCircle,
} from "react-icons/fa";

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
      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl max-w-2xl w-full p-8 md:p-10 space-y-8">
        <div className="flex justify-center mb-0">
          <img
            src="https://affycloudsolution.com/static/media/affy_logo.7354960bda008279c013.png"
            alt="Affy Cloud Logo"
            className="w-24 h-auto mb-4"
          />
        </div>

        <h1 className="text-3xl font-semibold text-center text-zinc-900 dark:text-white">
          AI Screening Round
        </h1>

        <h3 className="text-xl md:text-2xl font-semibold text-center text-zinc-900 dark:text-white">
          Please read the instructions carefully:
        </h3>

        <div className="space-y-5 text-sm md:text-base text-gray-700 dark:text-gray-300">
          <div className="flex items-start gap-4">
            <FaEye className="text-xl text-zinc-900 dark:text-white" />
            <p>
              <strong>Read all the questions properly</strong> before starting
              the recording.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <FaListOl className="text-xl text-zinc-900 dark:text-white" />
            <p>
              You will be presented with <strong>3 questions</strong> only.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <FaClock className="text-xl text-zinc-900 dark:text-white" />
            <p>
              Each question has a time limit of <strong>1 minute</strong>. Once
              time is up, you will be auto-moved to the next question.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <FaVideo className="text-xl text-zinc-900 dark:text-white" />
            <p>
              <strong>Recording can only be done once</strong>. Ensure your mic
              and camera are working before starting.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <FaPlayCircle className="text-xl text-zinc-900 dark:text-white" />
            <p>
              Once the recording starts and then stops, it will{" "}
              <strong>auto-submit your answer</strong>.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <FaBan className="text-xl text-zinc-900 dark:text-white" />
            <p>
              <strong>Tab switching is not allowed</strong>. After 2 warnings,
              the 3rd switch will lead to automatic disqualification.
            </p>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center pt-4 w-fit m-auto">
          <button
            onClick={handleNext}
            className="bg-blue-700 hover:bg-green-700 text-white text-base font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300 flex items-center justify-center gap-2"
          >
            <FaPlayCircle className="text-lg" />
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
