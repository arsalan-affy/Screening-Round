import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPauseCircle, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const questions = [
  "What is the difference between synchronous and asynchronous code in JavaScript?",
  "Explain the concept of closures in JavaScript.",
  "What are React hooks? Name a few and their use cases.",
  "Describe the software development lifecycle (SDLC).",
  "What is REST API and how is it used in web development?",
  "How would you optimize a slow React application?",
  "What are the principles of Object-Oriented Programming?",
  "Explain the difference between SQL and NoSQL databases.",
  "What is a middleware in Node.js?",
  "How do you manage application state in React apps?"
];

const TestQuestions = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [mediaStream, setMediaStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const chunksRef = useRef([]);
  const screenRecorderRef = useRef(null);
  const canvasRef = useRef(null);
  const audioAnalyzerRef = useRef(null);
  const animationIdRef = useRef(null);
  const audioContextRef = useRef(null);
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const startRecording = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMediaStream(userStream);

        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const combinedStream = new MediaStream([
          ...screenStream.getTracks(),
          ...userStream.getAudioTracks(),
        ]);

        const screenRecorder = new MediaRecorder(combinedStream);
        screenRecorder.start();
        screenRecorderRef.current = screenRecorder;

        alert("Screen recording started.");
      } catch (err) {
        alert("Camera, microphone, and screen access are required to start the test.");
      }
    };

    startRecording();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNext();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleStartAudio = () => {
    if (mediaStream && !isRecording) {
      const mediaRecorder = new MediaRecorder(mediaStream);
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setIsRecording(false);
        cancelAnimationFrame(animationIdRef.current);
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setIsRecording(true);

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(mediaStream);
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      audioAnalyzerRef.current = analyser;

      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext("2d");

      const draw = () => {
        animationIdRef.current = requestAnimationFrame(draw);
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = "#f3f4f6";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "#2563eb";
        canvasCtx.beginPath();

        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) canvasCtx.moveTo(x, y);
          else canvasCtx.lineTo(x, y);

          x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      };

      draw();
    }
  };

  const handleStopAudio = () => {
    if (recorder && recorder.state === "recording") {
      recorder.stop();
    }
  };

  const handleSubmitAudio = () => {
    alert("Audio submitted for this question.");
  };

  const handleNext = () => {
    if (recorder && recorder.state === "recording") recorder.stop();
    setAudioURL(null); 
    setTimeLeft(60);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    if (recorder && recorder.state === "recording") recorder.stop();
    if (screenRecorderRef.current && screenRecorderRef.current.state !== "inactive") {
      screenRecorderRef.current.stop();
    }
    alert("Screen recording completed.");
    navigate("/thank-you");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-200 to-blue-300 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-10">
      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl max-w-2xl w-full p-6 md:p-10 space-y-6">
        <div className="text-right text-sm font-semibold text-zinc-700 dark:text-gray-200">
          Time left: {timeLeft}s
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 ">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h3>

        <p className="text-lg text-gray-800 dark:text-gray-300">{currentQuestion}</p>

        <div className="space-y-3">
          {/* <input
            type="text"
            placeholder="Optional: Add notes or text response"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-100  text-gray-800 "
          /> */}

          <canvas
            ref={canvasRef}
            width={500}
            height={100}
            className="w-full bg-gray-200  rounded"
          />

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={handleStartAudio}
              disabled={isRecording}
              className="bg-zinc-800 cursor-pointer hover:bg-zinc-900 text-white p-3 rounded-full font-semibold transition"
            >
              <FaPlay/>
            </button>
            <button
              onClick={handleStopAudio}
              disabled={!isRecording}
              className="bg-red-600 hover:bg-red-700 cursor-pointer text-white p-3 rounded-full font-semibold transition"
            >
              <FaPause/>
            </button>
            <button
              onClick={handleSubmitAudio}
              className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-4 py-2 rounded-full font-semibold transition"
            >
              Submit Audio
            </button>
          </div>

          {audioURL && (
            <div className="text-center mt-2">
              <a
                href={audioURL}
                download={`question-${currentQuestionIndex + 1}.webm`}
                className="text-blue-600 underline"
              >
                Download Recorded Audio
              </a>
            </div>
          )}
        </div>

        <div className="text-center pt-4">
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="bg-zinc-900 hover:bg-zinc-950 text-white text-lg font-semibold px-6 py-2 rounded-full shadow-md transition duration-300"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-green-700 hover:bg-green-800 text-white text-lg font-semibold px-6 py-2 rounded-full shadow-md transition duration-300"
            >
             Final Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestQuestions;
