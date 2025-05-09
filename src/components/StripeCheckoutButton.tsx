"use client";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const StripeCheckoutButton: React.FC<{ cart: any[], userId: string }> = ({ cart, userId }) => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    if (!stripe) {
      console.error("Stripe failed to load.");
      return;
    }

    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createCheckoutSession",
          cart,
          userId
        }),
      });

      const { id } = await response.json();

      // Redirect to Stripe Checkout
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (error) {
      console.error("Stripe Checkout failed:", error);
    }
  };

  return (
    <button
      className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={handleCheckout}
    >
      Pay with Stripe
    </button>
  );
};

export default StripeCheckoutButton;
