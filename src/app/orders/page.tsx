"use client";

import { useEffect, useState } from "react";
import { fetchUserOrders } from "@/utils/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface OrderSummary {
  orderId: string;
  date: string;
  total: number;
  paymentMethod: string;
  status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    if (!userEmail) {
      toast.error("Please log in to view your orders.");
      router.push("/login");
      return;
    }

async function loadOrders() {
  try {
    const data = await fetchUserOrders(userEmail);
    console.log("✅ API Response:", data);

    // Check if the response follows the correct structure
    if (data.success && data.data && Array.isArray(data.data.orders)) {
      console.log("✅ Valid Orders:", data.data.orders);
      setOrders(data.data.orders);
    } else {
      console.error("❌ API Error: Unexpected response format", data);
      throw new Error("Invalid order data");
    }
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    setError("Failed to load orders");
  } finally {
    setLoading(false);
  }
}

    loadOrders();
  }, [userEmail, router]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        <ul className="divide-y">
          {orders.map((order) => (
            <li key={order.orderId} className="py-4 flex justify-between">
              <div>
                <p><strong>Order ID:</strong> {order.orderId}</p>
                <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                {order.status === "Pending Payment" ? (
  <button
    onClick={() => confirmBankPayment(order.orderId)}
    className="px-4 py-2 bg-green-500 text-white rounded"
  >
    Confirm Payment
  </button>
) : (
  <span className="status">{order.status}</span>
)}

              </div>
              <button
                onClick={() => router.push(`/order/${order.orderId}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                View Order
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

