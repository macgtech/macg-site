"use client";

import { useCart } from "@/context/CartContext";

const FloatingCartButton = () => {
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed bottom-4 right-4">
      <a
        href="/cart"
        className="relative bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
      >
        🛒 View Cart
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {totalItems}
          </span>
        )}
      </a>
    </div>
  );
};

export default FloatingCartButton;
