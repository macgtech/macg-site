import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"]!, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;

      await fetch("https://script.google.com/macros/s/YOUR_GOOGLE_SCRIPT_ID/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateOrderStatus", orderId, status: "Paid" }),
      });
    }

    res.status(200).send("Received webhook!");
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    res.status(400).send("Webhook Error");
  }
}
