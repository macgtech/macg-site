import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import getRawBody from "raw-body"; // ✅ Use `raw-body` instead of `micro`

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export const config = {
  api: {
    bodyParser: false, // ✅ Disable automatic JSON parsing
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  let event;
  let rawBody;

  try {
    rawBody = await getRawBody(req); // ✅ Get raw request body
    const sig = req.headers["stripe-signature"] as string;

    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err: any) {
    console.error("❌ Webhook Signature Verification Failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("📡 Received Stripe Webhook:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // ✅ Extract `orderId` and `paymentIntent`
    const orderId = session.metadata?.orderId;
    const paymentIntent = session.payment_intent;

    console.log(`✅ Extracted Order ID: ${orderId}`);
    console.log(`✅ Extracted Payment Intent: ${paymentIntent}`);

    if (!orderId || !paymentIntent) {
      console.error("❌ Missing orderId or paymentIntent in metadata.");
      return res.status(400).json({ success: false, message: "Missing orderId or paymentIntent" });
    }

    // ✅ Send request to Google Apps Script to mark order as paid
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "markOrderPaid",
          orderId: orderId,
          paymentIntent: paymentIntent,
        }),
      });

      const result = await response.json();
      console.log("📡 Google Sheets API Response:", result);

      if (!result.success) {
        console.error("❌ Google Sheets API failed:", result.message);
      }

      return res.json({ success: true, message: "Webhook processed successfully" });
    } catch (error) {
      console.error("❌ Error sending to Google Sheets:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  res.json({ received: true });
}
