"use client";

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      elements.getElement(CardElement)!
    );

    if (error) {
      console.error("❌ Payment Error:", error);
      setLoading(false);
      return;
    }

    console.log("✅ Payment Successful:", paymentIntent);
    router.push("/order-success");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="border p-2 rounded" />
      <button type="submit" disabled={!stripe || loading} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
