"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import OrderDetails from "@/components/OrderDetails";
import Invoice from "@/components/Invoice";

export default function OrderPage() {
  const { orderId } = useParams();
  const [validOrder, setValidOrder] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (orderId) {
      setValidOrder(true);
    } else {
      console.error("❌ Invalid Order ID");
    }
  }, [orderId]);

  if (!validOrder) return <p>Invalid Order ID.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Order Summary</h1>
      <OrderDetails />

      {/* ✅ Print Invoice Button */}
      <button
        onClick={() => setShowInvoice(true)}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Print Invoice
      </button>

      {showInvoice && <Invoice />}
    </div>
  );
}
