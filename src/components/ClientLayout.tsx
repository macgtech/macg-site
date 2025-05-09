"use client";

import { useCart } from "@/context/CartContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useCart();

  const handleLogin = async () => {
    const email = prompt("Enter your email:");
    if (!email) return;

    try {
      // Use environment variable for the API URL
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      
      // Check if the user exists
      const response = await fetch(`${baseUrl}/api?action=getUser&email=${encodeURIComponent(email)}`);
      const result = await response.json();

      if (result.success) {
        // User exists, ask for a password
        const password = prompt("Enter your password:");
        if (!password) return;

        const loginResponse = await fetch(`${baseUrl}/api`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "validateLogin", email, password }),
        });

        const loginResult = await loginResponse.json();
        if (loginResult.success) {
          setUser({ email });
          alert("Logged in successfully!");
        } else {
          alert("Invalid password.");
        }
      } else {
        // User does not exist, create a new user and send password setup email
        const createUserResponse = await fetch(`${baseUrl}/api`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "createUser", email }),
        });

        const createUserResult = await createUserResponse.json();
        if (createUserResult.success) {
          await fetch(`${baseUrl}/api`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "sendPasswordSetupEmail", email }),
          });
          alert("User created! Check your email to set a password.");
          setUser({ email });
        } else {
          alert("Failed to create user.");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while trying to log in.");
    }
  };

  return (
    <div>
      <header className="p-4 bg-gray-800 text-white flex justify-between">
        <h1 className="text-lg font-bold">My Store</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          {user?.email ? `Logged in as ${user.email}` : "Login"}
        </button>
      </header>
      <main>{children}</main>
    </div>
  );
}

