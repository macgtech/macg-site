import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { orderId } = req.body;

    // ✅ Call Google Apps Script to mark order as Paid
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "confirmPayment", orderId }),
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.message);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Confirm Payment Error:", error);
    res.status(500).json({ success: false, message: "Failed to confirm payment" });
  }
}
