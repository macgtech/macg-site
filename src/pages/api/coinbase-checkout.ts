import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { userEmail, name, cart, totalWithDelivery, orderId } = req.body;

    const chargeData = {
      name: `Order ${orderId}`,
      description: "Payment for your order at MacG TechnoloG",
      pricing_type: "fixed_price",
      local_price: {
        amount: totalWithDelivery,
        currency: "NZD",
      },
      metadata: {
        order_id: orderId,
        customer_email: userEmail,
        customer_name: name,
      },
      redirect_url: `https://macg.co.nz/payment-success?orderId=${orderId}`,
      cancel_url: "https://macg.co.nz/cart",
    };

    const response = await fetch("https://api.commerce.coinbase.com/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": process.env.COINBASE_API_KEY as string,
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify(chargeData),
    });

    const result = await response.json();

    if (!result || !result.data || !result.data.hosted_url) {
      return res.status(500).json({ success: false, message: "Failed to create Coinbase checkout" });
    }

    res.json({ success: true, url: result.data.hosted_url });
  } catch (error) {
    console.error("❌ Coinbase Checkout Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
