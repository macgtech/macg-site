"use client";

import { useEffect, useState } from "react";

const FloatingLoginButton = () => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleLogin = async () => {
    const userEmail = prompt("Enter your email to log in:");
    if (userEmail) {
      localStorage.setItem("email", userEmail);
      setEmail(userEmail);
      window.dispatchEvent(new Event("userLoggedIn"));

      // ✅ Check if the user exists in Google Sheets
      await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "checkUser", email: userEmail }),
      });
    }
  };

  if (email) return null; // ✅ Hide button if logged in

  return (
    <button
      onClick={handleLogin}
      className="fixed bottom-16 right-4 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50"
    >
      Login
    </button>
  );
};

export default FloatingLoginButton;

