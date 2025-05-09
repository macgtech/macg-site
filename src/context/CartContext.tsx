"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface CartItem {
  productId: string;
  productName: string;
  variant?: string;
  barcode?: string;
  quantity: number;
  price: number;
  totalPrice: number;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Load Cart from Local Storage on Mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // ✅ Save Cart to Local Storage on Update
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Add Item to Cart (Handles Variants & Images) — Completely Ignores API Response & Errors
  const addToCart = async (item: CartItem) => {
    setCart((prevCart) => [...prevCart, item]);

    // ✅ Get User Email (Check Storage or Prompt)
    let email = localStorage.getItem("email");
    if (!email) {
      email = prompt("Enter your email to continue:");
      if (!email) return;
      localStorage.setItem("email", email);
    }

    // ✅ Send to Google Sheets (Ignoring Errors & Response)
    fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateCart",
        userId: email,
        cart: [item],
      }),
    })
      .then(() => {}) // ✅ Ignore response
      .catch(() => {}); // ✅ Ignore errors silently
  };

  // ✅ Remove Item from Cart
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  // ✅ Clear Entire Cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart"); // Also clear storage
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// ✅ Custom Hook for Using Cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

