"use client";

import ClientLayout from "@/components/ClientLayout";
import { useCart } from "@/context/CartContext";
import EmailPopup from "@/components/EmailPopup";
import { useState } from "react";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showPopup, setShowPopup] = useState(false);
  const { email, setEmail, addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    if (!email) {
      setShowPopup(true); // Show popup if email is not set
    } else {
      addToCart(item); // Add item to cart if email exists
    }
  };

  const handleEmailSubmit = (userEmail: string) => {
    setEmail(userEmail); // Set email in context
    setShowPopup(false); // Hide popup
  };

  return (
    <>
      {showPopup && <EmailPopup onEmailSubmit={handleEmailSubmit} />}
      <ClientLayout>
        {children}
      </ClientLayout>
    </>
  );
}

