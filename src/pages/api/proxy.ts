import type { NextApiRequest, NextApiResponse } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Your Google Web App API

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!API_URL) {
    return res.status(500).json({ success: false, message: "API URL not configured" });
  }

  try {
    let response;
    if (req.method === "POST") {
      response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
    } else if (req.method === "GET") {
      // Forward GET request
      const url = `${API_URL}?${new URLSearchParams(req.query as any).toString()}`;
      response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy API Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

