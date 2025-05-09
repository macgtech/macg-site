"use client";

import { useCart } from "@/context/CartContext";

export default function CartClient() {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.productId} className="border-b py-2">
                <p>{item.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p>Total: ${item.totalPrice.toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button onClick={clearCart} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}

