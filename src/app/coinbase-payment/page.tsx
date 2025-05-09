"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CoinbasePaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const email = searchParams.get("email");
  const name = searchParams.get("name");

  useEffect(() => {
    if (!orderId || !amount || !email) {
      toast.error("Invalid payment request.");
      router.push("/checkout");
      return;
    }

    const startCoinbasePayment = async () => {
      try {
        const response = await fetch("/api/coinbase-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: email,
            name: name || "Customer",
            orderId,
            totalWithDelivery: amount,
          }),
        });

        const result = await response.json();

        if (result.success && result.url) {
          window.location.href = result.url; // ✅ Redirect to Coinbase checkout
        } else {
          toast.error(`Coinbase payment failed: ${result.message}`);
          router.push("/checkout");
        }
      } catch (error) {
        console.error("❌ Error processing Coinbase payment:", error);
        toast.error("An error occurred. Please try again.");
        router.push("/checkout");
      }
    };

    startCoinbasePayment();
  }, [orderId, amount, email, name, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-semibold">Processing your Coinbase payment...</p>
    </div>
  );
}
