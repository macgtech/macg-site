"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CoinbaseCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [loading, setLoading] = useState(true);
  const [checkoutUrl, setCheckoutUrl] = useState("");

  useEffect(() => {
    if (!orderId) return;

    fetch("/api/coinbase/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCheckoutUrl(data.url);
          window.location.href = data.url; // Redirect to Coinbase
        } else {
          console.error("❌ Coinbase Checkout Failed:", data.message);
        }
        setLoading(false);
      })
      .catch((error) => console.error("❌ Error:", error));
  }, [orderId]);

  return <>{loading ? <p>Redirecting to payment...</p> : <p>Error processing payment</p>}</>;
}
