import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const event = req.body.event;
    const orderId = req.body.event.data.metadata?.order_id;

    if (!orderId) {
      console.error("❌ Coinbase Webhook: No order ID found");
      return res.status(400).json({ success: false, message: "Missing order ID" });
    }

    if (event.type === "charge:confirmed") {
      console.log(`✅ Coinbase Payment Confirmed for Order: ${orderId}`);

      // ✅ Update Google Sheets Order Status to "Paid"
      await fetch("https://script.google.com/macros/s/YOUR_GOOGLE_SCRIPT_ID/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateOrderStatus",
          orderId,
          status: "Paid",
        }),
      });
    } else if (event.type === "charge:failed") {
      console.log(`❌ Coinbase Payment Failed for Order: ${orderId}`);

      // ❌ Update Google Sheets Order Status to "Failed"
      await fetch("https://script.google.com/macros/s/YOUR_GOOGLE_SCRIPT_ID/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateOrderStatus",
          orderId,
          status: "Failed",
        }),
      });
    }

    return res.status(200).json({ success: true, message: "Webhook received" });

  } catch (error) {
    console.error("❌ Coinbase Webhook Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
