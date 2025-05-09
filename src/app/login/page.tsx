"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Step 1: Validate Login (POST request)
    await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "validateLogin", email, password }),
    });

    // ✅ Step 2: Immediately check recent login timestamp
    const response = await fetch(
      `/api/proxy?action=confirmRecentLogin&email=${encodeURIComponent(email)}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );

    const result = await response.json();

    if (result.success) {
      toast.success("Login successful!");
      localStorage.setItem("email", email);
      localStorage.setItem("lastLoginTimestamp", new Date().toISOString());
      localStorage.setItem("deliveryAddress", result.address);
      localStorage.setItem("companyName", result.companyName);

      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      router.push(cart.length > 0 ? "/checkout" : "/shop");
    } else {
      toast.error(result.message || "Login failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

