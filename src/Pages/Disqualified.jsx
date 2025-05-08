import React from "react";

const Disqualified = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 animate-pulse">
      <div className="text-center px-6 py-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          You Have Been Disqualified!
        </h1>
        <p className="text-xl md:text-2xl">
          Tab switching is not allowed. Please contact support if you believe this is an error.
        </p>
      </div>
    </div>
  );
};

export default Disqualified;
