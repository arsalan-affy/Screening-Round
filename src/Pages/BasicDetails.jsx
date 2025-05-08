import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { REGISTER } from "../config/api";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const BasicDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
  });

  const validateForm = () => {
    const nameValid = formData.name.trim().length > 0;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const contactValid = /^\d{10}$/.test(formData.contact);

    if (!nameValid) {
      toast.error("Please enter a valid name.");
      return false;
    }
    if (!emailValid) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (!contactValid) {
      toast.error("Please enter a 10-digit mobile number.");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    try {
      const body = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.contact,
      };

      const response = await axios.post(REGISTER, body);
      toast.success("Registration successful!");
      navigate(`/test-questions/${response.data.id}`);
    } catch (error) {
      console.log(error.response.data.detail);
      console.error("Registration Failed:", error);
      toast.error(error.response.data.detail || "Registration full");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-200 to-blue-300 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center flex-col px-4 py-8">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-3xl md:text-4xl font-bold text-center text-zinc-900 dark:text-white mb-10">
        Welcome to Affy Cloud Screening Test
      </h1>
      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6">
        <h3 className="text-2xl md:text-3xl font-bold text-center text-zinc-900 dark:text-white">
          Enter Your Basic Details
        </h3>

        <form className="space-y-3.5 text-gray-700 dark:text-gray-300">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Contact Number</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter your contact number"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </form>

        <div className="text-center pt-4">
          <button
            onClick={handleContinue}
            className="bg-zinc-900 cursor-pointer hover:bg-zinc-950 text-white text-lg font-semibold px-6 py-1.5 rounded-full shadow-md transition duration-300"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;
