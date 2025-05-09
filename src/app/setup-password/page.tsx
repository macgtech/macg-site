"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { setPassword } from "@/utils/api"; // ✅ Use correct API function
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SetupPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || ""; // ✅ Get token from URL
  const [password, setPasswordState] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    await setPassword(token, password); // ✅ Fire-and-forget request
    toast.success("Password set successfully!");
    router.push("/login"); // ✅ Redirect to login
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Set Up Your Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPasswordState(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Set Password
        </button>
      </form>
    </div>
  );
}

