"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const FloatingCartButton = () => {
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const fetchCartData = async () => {
    if (!email) return;
    try {
      const response = await fetch(
        `/api/proxy?action=getCart&userId=${encodeURIComponent(email)}`
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();
      if (result.success) {
        const totalItems = result.cart.reduce(
          (count: number, item: { Quantity: number }) => count + item.Quantity,
          0
        );
        const totalPrice = result.cart.reduce(
          (sum: number, item: { TotalPrice: number }) => sum + item.TotalPrice,
          0
        );

        setCartCount(totalItems);
        setCartTotal(totalPrice);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
    window.addEventListener("cartUpdated", fetchCartData);
    return () => window.removeEventListener("cartUpdated", fetchCartData);
  }, [email]);

  return (
    <Link href="/cart" className="fixed bottom-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center">
      <span>Cart ({cartCount})</span>
      {cartCount > 0 && (
        <span className="ml-3 bg-white text-black px-3 py-1 rounded-full text-sm">
          ${cartTotal.toFixed(2)}
        </span>
      )}
    </Link>
  );
};

export default FloatingCartButton;

