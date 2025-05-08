import React from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaBan, FaListOl } from "react-icons/fa";

const Instructions = () => {
 const navigate = useNavigate();

  const handleNext = () => {
    navigate("/basic-details"); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-200 to-blue-300 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center flex-col  px-4 py-10">

    <h1 className="text-3xl md:text-4xl font-bold text-center text-zinc-900 dark:text-white mb-10">
      Welcome to Affy Cloud Screening Test
    </h1>
        
      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl max-w-2xl w-full p-6 md:p-10 space-y-6">
        <h3 className="text-2xl md:text-3xl font-bold text-center text-zinc-900 dark:text-white">
        Please read the instructions carefully:
        </h3>

        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div className="flex items-start gap-4">
            <FaListOl className="text-xl text-zinc-900 mt-1" />
            <p className="text-base md:text-lg">
              You will be presented with <strong>10 questions</strong> in total.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <FaClock className="text-4xl text-zinc-900 mt-1" />
            <p className="text-base md:text-lg">
              Each question has a time limit of <strong>1 minute</strong>. Once time is up, you will be auto-moved to the next question.
            </p>
          </div>
          <div className="flex items-start gap-4">
            <FaBan className="text-4xl text-zinc-900 mt-1" />
            <p className="text-base md:text-lg">
              <strong>Tab switching is not allowed</strong>. Navigating away from the test window may result in disqualification.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={handleNext}
            className="bg-zinc-900 cursor-pointer hover:bg-zinc-950 text-white text-lg font-semibold px-5 py-1.5 rounded-full shadow-md transition duration-300"
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
