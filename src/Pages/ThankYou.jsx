import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CANDIDATE_DETAILS } from "../config/api";
import {
  FaSadTear,
  FaMeh,
  FaSmile,
  FaGrin,
  FaGrinHearts,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PiRobotDuotone } from "react-icons/pi";

const ThankYou = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();

  const [candidateData, setCandidateData] = useState(null);
  const [scoreLevel, setScoreLevel] = useState("");
  const [scoreIcon, setScoreIcon] = useState(null);
  const [quote, setQuote] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [showResult, setShowResult] = useState(false);

  // useEffect(() => {
  //   const waitTimer = setTimeout(() => {
  //     setShowResult(true);
  //     fetchCandidateDetails();
  //   }, 5000);

  //   return () => clearTimeout(waitTimer);
  // }, [candidateId]);
  const messages = [
    "analyzes your expressions",
    "scores your confidence level",
    "evaluates your communication skills",
    "checks your response relevance",
    "prepares your result",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const waitTimer = setTimeout(() => {
      setShowResult(true);
      fetchCandidateDetails();
    }, 10000);

    const rotateTimer = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000);

    return () => {
      clearTimeout(waitTimer);
      clearInterval(rotateTimer);
    };
  }, [candidateId]);

  useEffect(() => {
    if (!showResult) return;

    // Start countdown after result shows
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResult, navigate]);

  const fetchCandidateDetails = async () => {
    try {
      const response = await axios.get(`${CANDIDATE_DETAILS(candidateId)}`);
      const data = response?.data;
      setCandidateData(data);
      const score = data?.score || 0;
      setScoreLevel(calculateScoreLevel(score));
      setScoreIcon(getScoreIcon(score));
      setQuote(getRandomQuote());
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      toast.error("Failed to fetch candidate details.");
    }
  };

  const calculateScoreLevel = (score) => {
    if (score <= 10) return { level: "Poor", color: "text-red-500" };
    if (score <= 25)
      return { level: "Below Average", color: "text-yellow-500" };
    if (score <= 50) return { level: "Average", color: "text-orange-500" };
    if (score <= 75) return { level: "Good", color: "text-blue-500" };
    return { level: "Excellent", color: "text-green-500" };
  };

  const getScoreIcon = (score) => {
    if (score <= 10) return <FaSadTear className="text-red-500" />;
    if (score <= 25) return <FaMeh className="text-yellow-500" />;
    if (score <= 50) return <FaSmile className="text-orange-500" />;
    if (score <= 75) return <FaGrin className="text-blue-500" />;
    return <FaGrinHearts className="text-green-500" />;
  };

  const getRandomQuote = () => {
    const quotes = [
      "Believe in yourself! The best is yet to come.",
      "Keep pushing! Success is just around the corner.",
      "The harder you work for something, the greater you'll feel when you achieve it.",
      "Believe in your dreams, and they will come true.",
      "Don’t stop when you’re tired. Stop when you’re done.",
      "Every accomplishment starts with the decision to try.",
      "Push yourself, because no one else is going to do it for you.",
      "Success doesn’t come from what you do occasionally, it comes from what you do consistently.",
      "Your only limit is your mind.",
      "Dream it. Wish it. Do it.",
      "Stay positive, work hard, make it happen.",
      "Don’t wait for opportunity. Create it.",
      "Difficult roads often lead to beautiful destinations.",
      "Failure is not the opposite of success, it’s part of success.",
      "If it doesn’t challenge you, it won’t change you.",
      "Success is the sum of small efforts, repeated day in and day out.",
      "Great things never come from comfort zones.",
      "You are capable of amazing things.",
      "The secret of getting ahead is getting started.",
      "Be proud of how far you’ve come and have faith in how far you can go.",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-200 to-blue-300 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl max-w-2xl w-full p-6 md:p-10 space-y-6 relative">
        {!showResult ? (
          <div className="text-center text-gray-600">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="relative flex items-center justify-center">
                <PiRobotDuotone className="text-7xl text-blue-600 drop-shadow-sm animate-bounce" />
              </div>

              <p className="text-base md:text-lg font-semibold text-zinc-800 dark:text-black">
                Our AI is analyzing your response
              </p>

              <p className="text-sm md:text-base font-medium text-blue-700 animate-pulse px-6 italic">
                {messages[currentMessageIndex]}...
              </p>
            </div>
          </div>
        ) : candidateData ? (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-semibold text-gray-800">
              Thank You, {candidateData.name}!
            </h2>

            {/* <p className="text-lg text-gray-600">Your score is:</p>
  <div className="text-6xl font-bold text-gray-800">
    {candidateData.score}%
  </div>
  <div className={`text-2xl font-semibold ${scoreLevel?.color} mt-2`}>
    {scoreLevel?.level}
  </div>
  <div className="flex justify-center mt-4">
    <div className="text-6xl">{scoreIcon}</div>
  </div> */}

            <div className="mt-6 text-lg text-gray-600">
              <p>
                Thank you for completing the screening. Our team will review
                your submission and get back to you shortly.
              </p>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              You will be redirected automatically in{" "}
              <span className="font-semibold">{countdown}</span> second
              {countdown !== 1 ? "s" : ""}.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded transition duration-200"
            >
              Exit
            </button>
          </div>
        ) : (
          <div className="text-center text-lg text-gray-600 space-y-2">
            <div className="p-3 rounded-full bg-gray-200 inline-block">
              <svg
                className="w-5 h-5 text-gray-600 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6.364 1.636l-.707.707M20 12h-1M17.657 17.657l-.707-.707M12 20v-1M6.343 17.657l.707-.707M4 12h1M6.343 6.343l.707.707"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Generating Result...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThankYou;
