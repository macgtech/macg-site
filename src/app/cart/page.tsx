"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { checkUser } from "@/utils/api";
import { toast } from "react-toastify";

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

const CartPage = () => {
  const router = useRouter();
  const { cart } = useCart();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("email");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCartData = async () => {
    if (!userId) return;
    try {
      const response = await fetch(
        `/api/proxy?action=getCart&userId=${encodeURIComponent(userId)}`
      );
      const result = await response.json();

      if (result.success && Array.isArray(result.cart)) {
        const validatedCart: CartItem[] = result.cart.map((item, index) => ({
          productId: item.ProductID ? String(item.ProductID) : `Unknown-${index}`,
          productName: item.ProductName || "Unknown Product",
          variant: item.Variant || "Default",
          barcode: item.Barcode || "",
          quantity: item.Quantity || 1,
          price: typeof item.Price === "number" ? item.Price : 0,
          totalPrice: typeof item.TotalPrice === "number" ? item.TotalPrice : 0,
          image: item.Image || "/placeholder-image.png",
        }));

        setCartItems(validatedCart);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCartData();
  }, [userId]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const sendQuantityUpdate = async (item: CartItem, change: number, action: string) => {
    const newQuantity = Math.max(1, item.quantity + change);

    setCartItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.productId === item.productId
          ? { ...cartItem, quantity: newQuantity, totalPrice: newQuantity * cartItem.price }
          : cartItem
      )
    );

    fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateCart",
        userId,
        cart: [{ ...item, quantity: change }],
      }),
    });

    if (action === "-") toast.info("Nah, Maybe Later");
    if (action === "+") toast.success("Another one for more fun!");
    if (action === "remove") toast.warn("It's out of here!");

    setTimeout(fetchCartData, 2000);
  };

  const handleProceedToCheckout = async () => {
    if (!userId) {
      toast.error("You need to log in before checking out.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `/api/proxy?action=getUser&email=${encodeURIComponent(userId)}`
      );
      const result = await response.json();

      if (result.success && result.user) {
        // ✅ Check Last Login Timestamp
        const lastLoginTime = new Date(result.user["Last Logged In"]).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = (currentTime - lastLoginTime) / (1000 * 60 * 60); // Hours

        if (timeDifference < 4) {
          // ✅ Proceed to Checkout if logged in within 4 hours
          router.push("/checkout");
        } else {
          // ✅ Otherwise, redirect to Login
          toast.info("Session expired. Please log in again.");
          router.push("/login");
        }
      } else {
        // ✅ Redirect to Register if user doesn't exist
        toast.info("User not found. Please register.");
        router.push("/register");
      }
    } catch (error) {
      console.error("Error checking user status:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  if (loading) return <p>Loading cart...</p>;

  if (!userId) {
    return <p>Please log in to view your cart.</p>;
  }

  if (!cartItems.length) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <p className="text-lg font-bold">Cart Total: ${cartTotal.toFixed(2)}</p>
      </div>
      <ul>
        {cartItems.map((item, index) => (
          <li key={`${item.productId}-${item.variant}-${index}`} className="border-b py-4 flex items-center">
            <img
              src={item.image}
              alt={item.productName}
              className="w-16 h-16 object-cover rounded mr-4"
            />
            <div className="flex-1">
              <p className="font-medium">{item.productName} ({item.variant})</p>
              <p className="text-gray-700">${item.price.toFixed(2)} each</p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => sendQuantityUpdate(item, -1, "-")}
                  className="px-2 py-1 bg-gray-200 rounded-l"
                >
                  -
                </button>
                <input
                  type="text"
                  value={item.quantity}
                  readOnly
                  className="w-12 text-center border-t border-b border-gray-300"
                />
                <button
                  onClick={() => sendQuantityUpdate(item, 1, "+")}
                  className="px-2 py-1 bg-gray-200 rounded-r"
                >
                  +
                </button>
              </div>
              <p className="mt-2 text-lg font-bold">
                Total: ${item.totalPrice.toFixed(2)}
              </p>
              <button
                onClick={() => sendQuantityUpdate(item, -item.quantity, "remove")}
                className="text-red-500 hover:underline mt-2"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <button
          onClick={handleProceedToCheckout}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;

