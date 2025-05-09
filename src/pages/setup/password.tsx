// src/pages/setup-password.tsx
import { useState } from "react";
import { useRouter } from "next/router";

export default function SetupPasswordPage() {
  const router = useRouter();
  const { token } = router.query; // Get the token from the URL
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/setup-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage("Password set successfully. You can now log in.");
        router.push("/login");
      } else {
        setMessage(result.message || "Failed to set password.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h1>Set Up Your Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

