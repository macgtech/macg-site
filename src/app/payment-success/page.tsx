"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      console.error("❌ Missing orderId in payment success URL");
      router.push("/"); // Redirect home if orderId is missing
    } else {
      console.log(`✅ Payment successful for Order ID: ${orderId}`);
    }
  }, [orderId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful 🎉</h1>
      <p className="text-lg text-gray-700 mt-4">
        Your order <strong>{orderId}</strong> has been successfully processed.
      </p>
      <a href="/" className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700">
        Return to Home
      </a>
    </div>
  );
}
