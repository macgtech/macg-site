import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    // Coinbase sends webhooks as raw JSON, so ensure body is properly parsed
    const event = req.body;

    console.log("📡 Received Coinbase Webhook:", JSON.stringify(event, null, 2));

    if (!event || !event.event || !event.event.data || !event.event.data.metadata) {
      return res.status(400).json({ success: false, message: "Invalid webhook data" });
    }

    // ✅ Extract Order ID from webhook metadata
    const orderId = event.event.data.metadata.order_id;
    console.log("✅ Payment confirmed for Order:", orderId);

    // ✅ Update Google Sheets with "Paid" status
    const updateResponse = await fetch(process.env.NEXT_PUBLIC_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateOrderStatus",
        orderId,
        status: "Paid",
      }),
    });

    const updateResult = await updateResponse.json();
    console.log("📡 Google Sheets API Response:", updateResult);

    return res.json({ success: true, message: "Order updated successfully" });

  } catch (error) {
    console.error("❌ Webhook Handling Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
