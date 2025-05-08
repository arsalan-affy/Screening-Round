import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import BasicDetails from "./Pages/BasicDetails";
import Instructions from "./Pages/Instructions";
import TestQuestions from "./Pages/TestQuestios";
import ThankYou from "./Pages/ThankYou";
import Disqualified from "./Pages/Disqualified";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

const AppRoutes = () => {
  const [violationCount, setViolationCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (violationCount < 2) {
          setViolationCount(violationCount + 1);
          alert(`Warning ${violationCount + 1}: Tab switching is not allowed.`);
        } else {
          navigate("/disqualified");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [violationCount, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Instructions />} />
      <Route path="/basic-details" element={<BasicDetails />} />
      <Route path="/test-questions/:candidateId" element={<TestQuestions />} />
      <Route path="/thank-you/:candidateId" element={<ThankYou />} />
      <Route path="/disqualified" element={<Disqualified />} />
    </Routes>
  );
};

export default App;
