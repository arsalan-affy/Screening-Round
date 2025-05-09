// import React, { useEffect, useRef, useState } from "react";
// import { FaPause, FaMicrophone } from "react-icons/fa";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { GET_QUESTIONS, SUBMIT_AUDIO, SUBMIT_TEST } from "../config/api";

// const TestQuestions = () => {
//   const { candidateId } = useParams();
//   const navigate = useNavigate();

//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(10);
//   const [testStarted, setTestStarted] = useState(false);
//   const [mediaStream, setMediaStream] = useState(null);
//   const [recorder, setRecorder] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioURL, setAudioURL] = useState(null);
//   const [answers, setAnswers] = useState([]);
//   const chunksRef = useRef([]);
//   const [submittingAudio, setSubmittingAudio] = useState(false);
//   const [audioSubmitted, setAudioSubmitted] = useState(false);
//   const currentQuestion = questions[currentQuestionIndex];

//   const fetchQuestions = async () => {
//     try {
//       const response = await axios.get(GET_QUESTIONS);
//       if (response?.data) {
//         setQuestions(response.data);
//         toast.success("Questions loaded successfully!");
//       }
//     } catch (error) {
//       console.error("Error fetching questions:", error);
//       toast.error("Failed to load questions.");
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, []);

//   useEffect(() => {
//     if (testStarted && timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else if (testStarted && timeLeft === 0) {
//       handleStopAndSubmit();
//     }
//   }, [timeLeft, testStarted]);

//   const handleStartTest = async () => {
//     try {
//       const userStream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//       });
//       setMediaStream(userStream);
//       setTestStarted(true);
//       toast.success("Test started. Audio recording is enabled.");
//     } catch (err) {
//       alert("Microphone access is required to start the test.");
//     }
//   };

//   const handleStartAudio = () => {
//     if (mediaStream && !isRecording) {
//       const mediaRecorder = new MediaRecorder(mediaStream);
//       chunksRef.current = [];

//       mediaRecorder.ondataavailable = (e) => {
//         if (e.data.size > 0) {
//           chunksRef.current.push(e.data);
//         }
//       };

//       mediaRecorder.onstop = () => {
//         const blob = new Blob(chunksRef.current, { type: "audio/webm" });
//         const url = URL.createObjectURL(blob);
//         setAudioURL(url);
//         setIsRecording(false);
//         handleSubmitAudio(blob); // Automatically submit on stop
//       };

//       mediaRecorder.start();
//       setRecorder(mediaRecorder);
//       setIsRecording(true);
//     }
//   };

//   const handleStopAudio = () => {
//     if (recorder && recorder.state === "recording") {
//       recorder.stop();
//     }
//   };

//   const handleStopAndSubmit = () => {
//     if (recorder && recorder.state === "recording") {
//       recorder.stop();
//     } else {
//       handleSubmitAudio(); // if already stopped but timer expired
//     }
//   };
//   const handleSubmitAudio = async (blobArg) => {
//     setSubmittingAudio(true);
//     toast.dismiss();

//     try {
//       const blob =
//         blobArg || new Blob(chunksRef.current, { type: "audio/webm" });
//       const formData = new FormData();
//       formData.append("audio", blob, `question-${currentQuestionIndex + 1}.webm`);
//       formData.append("question", currentQuestion?.id);

//       const res = await axios.post(SUBMIT_AUDIO, formData);
//       const responseText = res?.data?.response || "No response";

//       const answerObj = {
//         question: currentQuestion?.question,
//         response: responseText,
//       };

//       setAnswers((prev) => [...prev, answerObj]);
//       toast.success(`Answer submitted for Question ${currentQuestionIndex + 1}`);
//     } catch (error) {
//       console.error("Error submitting audio:", error);
//       const answerObj = {
//         question: currentQuestion?.question,
//         response: "",
//       };
//       setAnswers((prev) => [...prev, answerObj]);
//       toast.error("Error submitting audio, moving to next question.");
//     } finally {
//       setAudioURL(null);
//       setTimeLeft(10);
//       setSubmittingAudio(false);

//       // Move to next or submit final
//       if (currentQuestionIndex < questions.length - 1) {
//         setCurrentQuestionIndex((prev) => prev + 1);
//       } else {
//         setAudioSubmitted(true);
//       }
//     }
//   };
//   useEffect(() => {
//     if (audioSubmitted && currentQuestionIndex === questions.length - 1) {
//       toast.loading("Submitting final test...");
//       handleSubmitFinal();
//     }
//   }, [audioSubmitted]);
//   const handleSubmitFinal = async () => {
//     if (recorder?.state === "recording") recorder.stop();

//     try {
//       const payload = {
//         candidate_id: Number(candidateId),
//         answers: answers,
//       };

//       await axios.post(SUBMIT_TEST, payload);
//       toast.dismiss();
//       toast.success("Final test submitted successfully!");
//       navigate(`/thank-you/${candidateId}`);
//     } catch (error) {
//       console.error("Submit test error:", error);
//       toast.dismiss();
//       toast.error("Failed to submit final test.");
//     }
//   };

//   // const handleSubmitAudio = async (blobArg) => {
//   //   setSubmittingAudio(true);
//   //   toast.dismiss(); // close any existing toasts
//   //   try {
//   //     const blob =
//   //       blobArg || new Blob(chunksRef.current, { type: "audio/webm" });
//   //     const formData = new FormData();
//   //     formData.append(
//   //       "audio",
//   //       blob,
//   //       `question-${currentQuestionIndex + 1}.webm`
//   //     );
//   //     formData.append("question", currentQuestion?.id);

//   //     const res = await axios.post(SUBMIT_AUDIO, formData);
//   //     const responseText = res?.data?.response || "No response";

//   //     const answerObj = {
//   //       question: currentQuestion?.question,
//   //       response: responseText,
//   //     };

//   //     setAnswers((prev) => [...prev, answerObj]);
//   //   } catch (error) {
//   //     console.error("Error submitting audio:", error);
//   //     const answerObj = {
//   //       question: currentQuestion?.question,
//   //       response: "",
//   //     };
//   //     setAnswers((prev) => [...prev, answerObj]);
//   //     toast.error("Error submitting audio, moving to next question.");
//   //   } finally {
//   //     setAudioURL(null);
//   //     setTimeLeft(60);
//   //     setSubmittingAudio(false);

//   //     if (currentQuestionIndex < questions.length - 1) {
//   //       setCurrentQuestionIndex((prev) => prev + 1);
//   //     } else {
//   //       setAudioSubmitted(true); // only for last question
//   //     }
//   //   }
//   // };

//   // const handleSubmitAudio = async (blobArg) => {
//   //   setSubmittingAudio(true); // start
//   //   toast.loading("Submitting audio...");
//   //   try {
//   //     const blob =
//   //       blobArg || new Blob(chunksRef.current, { type: "audio/webm" });
//   //     const formData = new FormData();
//   //     formData.append(
//   //       "audio",
//   //       blob,
//   //       `question-${currentQuestionIndex + 1}.webm`
//   //     );
//   //     formData.append("question", currentQuestion?.id);

//   //     const res = await axios.post(SUBMIT_AUDIO, formData);
//   //     const responseText = res?.data?.response || "No response";

//   //     const answerObj = {
//   //       question: currentQuestion?.question,
//   //       response: responseText,
//   //     };

//   //     setAnswers((prev) => [...prev, answerObj]);
//   //   } catch (error) {
//   //     console.error("Error submitting audio:", error);
//   //     const answerObj = {
//   //       question: currentQuestion?.question,
//   //       response: "",
//   //     };
//   //     setAnswers((prev) => [...prev, answerObj]);
//   //     toast.error("Error submitting audio, moving to next question.");
//   //   } finally {
//   //     toast.dismiss();
//   //     setAudioURL(null);
//   //     setTimeLeft(60);
//   //     setSubmittingAudio(false); // end

//   //     if (currentQuestionIndex < questions.length - 1) {
//   //       setCurrentQuestionIndex((prev) => prev + 1);
//   //     }
//   //   }
//   // };

//   // const handleSubmitAudio = async (blobArg) => {
//   //   toast.loading("Submitting audio...");
//   //   try {
//   //     const blob = blobArg || new Blob(chunksRef.current, { type: "audio/webm" });
//   //     const formData = new FormData();
//   //     formData.append("audio", blob, `question-${currentQuestionIndex + 1}.webm`);
//   //     formData.append("question", currentQuestion?.id);

//   //     const res = await axios.post(SUBMIT_AUDIO, formData);
//   //     const responseText = res?.data?.response || "No response";

//   //     const answerObj = {
//   //       question: currentQuestion?.question,
//   //       response: responseText,
//   //     };

//   //     setAnswers((prev) => [...prev, answerObj]);
//   //   } catch (error) {
//   //     console.error("Error submitting audio:", error);
//   //     const answerObj = {
//   //       question: currentQuestion?.question,
//   //       response: "",
//   //     };
//   //     setAnswers((prev) => [...prev, answerObj]);
//   //     toast.error("Error submitting audio, moving to next question.");
//   //   } finally {
//   //     toast.dismiss();
//   //     setAudioURL(null);
//   //     setTimeLeft(60);

//   //     if (currentQuestionIndex < questions.length - 1) {
//   //       setCurrentQuestionIndex((prev) => prev + 1);
//   //     }
//   //   }
//   // };

//   // const handleSubmitFinal = async () => {
//   //   if (recorder?.state === "recording") recorder.stop();

//   //   try {
//   //     const payload = {
//   //       candidate_id: Number(candidateId),
//   //       answers: answers,
//   //     };

//   //     await axios.post(SUBMIT_TEST, payload);
//   //     toast.success("Test submitted successfully!");
//   //     navigate(`/thank-you/${candidateId}`);
//   //   } catch (error) {
//   //     console.error("Submit test error:", error);
//   //     toast.error("Failed to submit test.");
//   //   }
//   // };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white via-blue-200 to-blue-300 flex items-center justify-center px-4 py-10">
//       <div className="bg-white shadow-2xl rounded-2xl max-w-2xl w-full p-6 md:p-10 space-y-6">
//         {testStarted && (
//           <div className="text-right text-sm font-semibold text-zinc-700">
//             Time left: {timeLeft}s
//           </div>
//         )}
//         <div className="mb-6 space-y-2">
//           <p className="text-base md:text-lg font-medium text-gray-600">
//             {questions.length > 0
//               ? `Question ${currentQuestionIndex + 1} of ${questions.length}`
//               : "Loading questions..."}
//           </p>

//           <h3 className="text-xl md:text-3xl font-semibold text-zinc-900 leading-snug tracking-tight">
//             {currentQuestion?.question}
//           </h3>
//         </div>

//         {!testStarted && currentQuestionIndex === 0 ? (
//           <div div className="text-center pt-4">
//             <button
//               onClick={handleStartTest}
//               className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-2 rounded-full"
//             >
//               Start Test
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="space-y-3">
//               <div className="flex gap-3 justify-center flex-wrap">
//                 {submittingAudio ? (
//                   <div className="p-3 rounded-full bg-gray-200 animate-spin">
//                     <svg
//                       className="w-5 h-5 text-gray-600"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 4v1m6.364 1.636l-.707.707M20 12h-1M17.657 17.657l-.707-.707M12 20v-1M6.343 17.657l.707-.707M4 12h1M6.343 6.343l.707.707"
//                       />
//                     </svg>
//                   </div>
//                 ) : isRecording ? (
//                   <div className="text-center">
//                     <button
//                       onClick={handleStopAudio}
//                       className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full"
//                     >
//                       <FaPause />
//                     </button>
//                     <p className="text-sm text-red-600 font-medium">
//                       Click to Submit Audio
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="text-center">
//                     <button
//                       onClick={handleStartAudio}
//                       className="bg-zinc-800 hover:bg-zinc-900 text-white p-3 rounded-full"
//                     >
//                       <FaMicrophone />
//                     </button>
//                     <p className="text-sm text-red-600 font-medium">
//                       Click to Record Audio
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {submittingAudio && (
//                 <p className="text-sm text-zinc-600 font-medium text-center">
//                   Please Wait! Submitting audio...
//                 </p>
//               )}
//             </div>

//             <div className="text-center pt-4">
//               {currentQuestionIndex === questions.length - 1 &&
//                 audioSubmitted && (
//                   <button
//                     onClick={handleSubmitFinal}
//                     className="bg-green-700 hover:bg-green-800 text-white text-lg font-semibold px-6 py-2 rounded-full"
//                   >
//                     Final Submit
//                   </button>
//                 )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TestQuestions;

import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaMicrophone } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { GET_QUESTIONS, SUBMIT_AUDIO, SUBMIT_TEST } from "../config/api";

const TestQuestions = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [testStarted, setTestStarted] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submittingAudio, setSubmittingAudio] = useState(false);
  const [audioSubmitted, setAudioSubmitted] = useState(false);

  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const currentQuestion = questions[currentQuestionIndex];

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(GET_QUESTIONS);
      if (response?.data) {
        setQuestions(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch questions");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      timerRef.current = setTimeout(
        () => setTimeLeft((prev) => prev - 1),
        1000
      );
    }

    if (testStarted && timeLeft === 0) {
      handleStopAndSubmit();
    }

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, testStarted]);

  const handleStartTest = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setMediaStream(userStream);
      setTestStarted(true);
    } catch (err) {
      alert("Microphone access is required to start the test.");
    }
  };

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
        handleSubmitAudio(blob);
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setIsRecording(true);
    }
  };

  const handleStopAudio = () => {
    if (recorder && recorder.state === "recording") {
      recorder.stop();
    }
  };

  const handleStopAndSubmit = () => {
    clearTimeout(timerRef.current); // ✅ Prevent duplicate submit
    if (recorder && recorder.state === "recording") {
      recorder.stop(); // auto-triggers handleSubmitAudio
    } else {
      handleSubmitAudio(); // fallback
    }
  };

  const handleSubmitAudio = async (blobArg) => {
    clearTimeout(timerRef.current);
    setSubmittingAudio(true);

    try {
      const blob =
        blobArg || new Blob(chunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append(
        "audio",
        blob,
        `question-${currentQuestionIndex + 1}.webm`
      );
      formData.append("question", currentQuestion?.id);

      const res = await axios.post(SUBMIT_AUDIO, formData);
      const responseText = res?.data?.response || "No response";

      const answerObj = {
        question: currentQuestion?.question,
        response: responseText,
      };

      setAnswers((prev) => [...prev, answerObj]);
    } catch (error) {
      const answerObj = {
        question: currentQuestion?.question,
        response: "",
      };
      setAnswers((prev) => [...prev, answerObj]);
    } finally {
      setAudioURL(null);
      setTimeLeft(60);
      setSubmittingAudio(false);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setAudioSubmitted(true);
      }
    }
  };

  useEffect(() => {
    if (audioSubmitted && currentQuestionIndex === questions.length - 1) {
      handleSubmitFinal();
    }
  }, [audioSubmitted]);
  const [isFinalSubmit, setIsFinalSubmit] = useState(false);
  const handleSubmitFinal = async () => {
    setIsFinalSubmit(true);
    if (recorder?.state === "recording") recorder.stop();

    try {
      const payload = {
        candidate_id: Number(candidateId),
        answers,
      };

      await axios.post(SUBMIT_TEST, payload);
      navigate(`/thank-you/${candidateId}`);
    } catch (error) {
      toast.error("Failed to submit final test.");
    } finally {
      setIsFinalSubmit(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-200 to-blue-300 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl max-w-2xl w-full p-6 md:p-10 space-y-6">
        {testStarted && (
          <div className="text-right text-sm font-semibold text-zinc-700">
            Time left: {timeLeft}s
          </div>
        )}
        <div className="mb-6 space-y-2">
          <p className="text-base md:text-lg font-medium text-gray-600">
            {questions.length > 0
              ? `Question ${currentQuestionIndex + 1} of ${questions.length}`
              : "Loading questions..."}
          </p>

          <h3 className="text-xl md:text-3xl font-semibold text-zinc-900 leading-snug tracking-tight">
            {currentQuestion?.question}
          </h3>
        </div>

        {!testStarted && currentQuestionIndex === 0 ? (
          <div div className="text-center pt-4">
            <button
              onClick={handleStartTest}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-2 rounded-full"
            >
              Start Test
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex gap-3 justify-center flex-wrap">
                {submittingAudio ? (
                  <div className="p-3 rounded-full bg-gray-200 animate-spin">
                    <svg
                      className="w-5 h-5 text-gray-600"
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
                ) : isRecording ? (
                  <div className="text-center">
                    <button
                      onClick={handleStopAudio}
                      className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full"
                    >
                      <FaPause />
                    </button>
                    <p className="text-sm text-red-600 font-medium">
                      Click to Submit Audio
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={handleStartAudio}
                      className="bg-zinc-800 hover:bg-zinc-900 text-white p-3 rounded-full disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={isFinalSubmit}
                    >
                      <FaMicrophone />
                    </button>
                    <p className="text-sm text-red-600 font-medium">
                      {isFinalSubmit
                        ? "Submitting Test..."
                        : "Click to Record Audio"}
                    </p>
                  </div>
                )}
              </div>

              {submittingAudio && (
                <p className="text-sm text-zinc-600 font-medium text-center">
                  Please Wait! Submitting audio...
                </p>
              )}
            </div>

            <div className="text-center pt-4">
              {currentQuestionIndex === questions.length - 1 &&
                audioSubmitted && (
                  <button
                    onClick={handleSubmitFinal}
                    className="bg-green-700 hover:bg-green-800 text-white text-lg font-semibold px-6 py-2 rounded-full disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isFinalSubmit}
                  >
                    Submit Test
                  </button>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TestQuestions;
