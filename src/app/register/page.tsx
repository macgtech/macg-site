"use client";
import { useState, useEffect, useRef } from "react";
import { registerUser, updateCartEmail } from "@/utils/api"; // ✅ Function to update email in cart
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [oldEmail, setOldEmail] = useState(""); // ✅ Store old email
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyTickBox, setCompanyTickBox] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const addressInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Prefill Email from LocalStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      setOldEmail(storedEmail);
    }
  }, []);

  // ✅ Google Maps Address Autocomplete
  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      const autocomplete = new google.maps.places.Autocomplete(addressInputRef.current!, {
        types: ["geocode"],
        componentRestrictions: { country: "NZ" },
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          setDeliveryAddress(place.formatted_address);
        }
      });
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  if (companyTickBox && !companyName) {
    toast.error("Company name is required when registering as a business.");
    return;
  }

  // ✅ Always store the email in localStorage
  localStorage.setItem("email", email);

  // ✅ Fire the user registration request (Fire & Forget)
  registerUser(
    email,
    name,
    phone,
    companyName,
    deliveryAddress,
    subscribe,
    companyTickBox,
    oldEmail
  );

  // ✅ Update cart email after registration (Fire & Forget)
  updateCartEmail(oldEmail, email);

  // ✅ Redirect to login (No need to wait for response)
  toast.success("Registration successful! Redirecting to login...");
  router.push("/login");
};

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={companyTickBox}
            onChange={() => setCompanyTickBox(!companyTickBox)}
            className="mr-2"
          />
          Register as a Business
        </label>

        {companyTickBox && (
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        )}

        {/* Google Places Autocomplete Address Input */}
        <input
          ref={addressInputRef}
          type="text"
          placeholder="Delivery Address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={subscribe}
            onChange={() => setSubscribe(!subscribe)}
            className="mr-2"
          />
          Subscribe to Newsletter
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
