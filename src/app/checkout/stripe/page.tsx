"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function StripeCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [loading, setLoading] = useState(true);
  const [checkoutUrl, setCheckoutUrl] = useState("");

  useEffect(() => {
    if (!orderId) return;
    
    // ✅ Fetch Stripe checkout URL
    fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCheckoutUrl(data.url);
          window.location.href = data.url; // Redirect to Stripe
        } else {
          console.error("❌ Stripe Checkout Failed:", data.message);
        }
        setLoading(false);
      })
      .catch((error) => console.error("❌ Error:", error));
  }, [orderId]);

  return <>{loading ? <p>Redirecting to payment...</p> : <p>Error processing payment</p>}</>;
}
