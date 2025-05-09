"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchUserDetails } from "@/utils/api";
import { toast } from "react-toastify";

export default function StripePaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Extract values from the URL
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  // ✅ State to hold user details
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Get stored email from localStorage
    const storedEmail = typeof window !== "undefined" ? localStorage.getItem("email") : null;

    if (!storedEmail) {
      toast.error("No user email found. Redirecting to register...");
      router.push("/register"); // Redirect to register if no email
      return;
    }

    // ✅ Fetch user details from API
    const loadUserDetails = async () => {
      try {
        const data = await fetchUserDetails(storedEmail);
        console.log("📡 API Response:", data);

        if (data.success && data.message) {
          setEmail(data.message.email || storedEmail);
          setName(data.message.name || "Guest"); // Fallback if name is missing
        } else {
          console.error("❌ Invalid user data:", data);
        }
      } catch (error) {
        console.error("❌ Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserDetails();
  }, [router]);

  useEffect(() => {
    if (loading) return;

    if (!orderId || !amount || !email || !name) {
      console.error("❌ Missing required parameters:", { orderId, amount, email, name });
      alert("Missing payment details. Redirecting to cart.");
      router.push("/cart");
      return;
    }

    console.log("📡 Sending request to /api/stripe-checkout:", { orderId, amount, email, name });

    fetch("/api/stripe-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, amount, email, name }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📩 Stripe Checkout API Response:", data);

        if (data.url) {
          console.log(`✅ Redirecting to Stripe Checkout: ${data.url}`);
          window.location.href = data.url; // ✅ Redirect to Stripe Checkout
        } else {
          console.error("❌ Stripe checkout failed:", data);
          alert("Stripe checkout failed. Please try again.");
          router.push("/cart");
        }
      })
      .catch((err) => {
        console.error("❌ Fetch error when calling /api/stripe-checkout:", err);
        router.push("/cart");
      });
  }, [orderId, amount, email, name, loading, router]);

  return <p>Redirecting to payment...</p>;
}
