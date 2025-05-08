import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BasicDetails from "./Pages/BasicDetails";
import Instructions from "./Pages/Instructions";
import TestQuestions from "./Pages/TestQuestios";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Instructions />} />
        <Route path="/basic-details" element={<BasicDetails />} />
        <Route path="/test-questions" element={<TestQuestions />} />
      </Routes>
    </Router>
  );
}

export default App;
