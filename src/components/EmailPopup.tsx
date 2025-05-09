"use client";

import { useState } from "react";

interface EmailPopupProps {
  onEmailSubmit: (email: string) => void;
}

const EmailPopup: React.FC<EmailPopupProps> = ({ onEmailSubmit }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (email.trim()) {
      onEmailSubmit(email.trim());
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Enter Your Email</h2>
        <input
          type="email"
          className="w-full border border-gray-300 rounded p-2 mb-4"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default EmailPopup;

