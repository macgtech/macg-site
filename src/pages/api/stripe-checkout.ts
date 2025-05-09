import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("🔄 Stripe Checkout API called");

  if (req.method !== "POST") {
    console.error("❌ Method Not Allowed");
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { orderId, amount, email, name } = req.body;

    if (!orderId || !amount || !email || !name) {
      console.error("❌ Missing required fields in request:", req.body);
      return res.status(400).json({ success: false, message: "Missing orderId, amount, email, or name" });
    }

    console.log(`📦 Processing Stripe Checkout: Order ${orderId} - Amount ${amount} - Email ${email} - Name ${name}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email, // ✅ Pre-fill email field in Stripe
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "nzd",
            product_data: {
              name: `Order #${orderId}`,
              description: `Order placed by ${name}`, // ✅ Add user name
            },
            unit_amount: Math.round(parseFloat(amount) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId,
        customerName: name, // ✅ Store customer name in metadata
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment-success?orderId=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
    });

    console.log(`✅ Stripe Checkout URL Created: ${session.url}`);

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("❌ Stripe Checkout Error:", error);
    res.status(500).json({ success: false, message: `Stripe checkout failed: ${error.message}` });
  }
}
