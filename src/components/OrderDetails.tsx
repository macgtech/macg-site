"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchOrderDetails, addToCart } from "@/utils/api";
import { toast } from "react-toastify";

interface OrderItem {
  id: string;
  name: string;
  variant: string;
  barcode: string;
  quantity: number;
  price: number;
  totalPrice: number;
  image: string;
}

export default function OrderDetails() {
  const { orderId } = useParams(); // Get order ID from URL
  const router = useRouter();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderId) return;

      try {
        const data = await fetchOrderDetails(orderId);
        if (data.success && Array.isArray(data.orderItems)) {
          setOrderItems(
            data.orderItems.map((item: any) => ({
              id: item["ProductID"] ? String(item["ProductID"]) : "Unknown",
              name: item["ProductName"] || "Unknown Product",
              variant: item["Variant Name"] || "Default",
              barcode: item["Barcode"] || "No Barcode",
              quantity: Number(item["Quantity Ordered"]) || 1,
              price: Number(item["Price Per Unit"]) || 0,
              totalPrice: Number(item["Total Price for Item"]) || 0,
              image: item["Image URL"] || "/placeholder-image.png",
            }))
          );
        } else {
          console.error("Invalid order data:", data);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId]);

  const handleReorder = async () => {
    if (!orderItems.length) return;

    try {
      await addToCart(orderItems);
      toast.success("Order items added to cart!");
      router.push("/cart");
    } catch (error) {
      console.error("Error adding items to cart:", error);
      toast.error("Failed to reorder items.");
    }
  };

  if (loading) return <p>Loading order details...</p>;

  if (!orderItems.length) return <p>No items found for this order.</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Order Details - {orderId}</h2>

      <ul>
        {orderItems.map((item, index) => (
          <li key={index} className="border-b py-4 flex items-center">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded mr-4"
            />
            <div className="flex-1">
              <p className="font-medium">{item.name} ({item.variant})</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price.toFixed(2)}</p>
              <p><strong>Total: ${item.totalPrice.toFixed(2)}</strong></p>
            </div>
          </li>
        ))}
      </ul>

      {/* ✅ Reorder Button */}
      <button
        onClick={handleReorder}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Reorder Items
      </button>
    </div>
  );
}

