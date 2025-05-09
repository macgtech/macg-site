"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { sendBankTransferEmail, checkUser, processPayment } from "@/utils/api";
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

const CHECKOUT_TIMEOUT_HOURS = 4;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCart();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [totalWithDelivery, setTotalWithDelivery] = useState(0);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      toast.error("Please log in to proceed.");
      router.push("/cart");
      return;
    }
    setUserEmail(storedEmail);

    const checkUserSession = async () => {
      try {
        const user = await checkUser(storedEmail);
        if (!user.success || !user.user) {
          toast.error("User not found. Redirecting to Register.");
          router.push("/register");
          return;
        }

        setUserDetails(user.user);

        const lastLoginTime = new Date(user.user["Last Logged In"]).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = (currentTime - lastLoginTime) / (1000 * 60 * 60);

        if (timeDifference >= CHECKOUT_TIMEOUT_HOURS) {
          toast.info("Session expired, please log in again.");
          router.push("/login");
          return;
        }

        const response = await fetch(
          `/api/proxy?action=getCart&userId=${encodeURIComponent(storedEmail)}`
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
          const total = validatedCart.reduce((sum, item) => sum + item.totalPrice, 0);
          setCartTotal(total);

          let fee = 0;
          const address = String(user.user.Address || "");
          if (address.includes("Auckland")) {
            fee = total >= 100 ? 0 : 5;
          } else if (address.includes("Wellington") || address.includes("Christchurch")) {
            fee = 8;
          } else {
            fee = 12;
          }

          setDeliveryFee(fee);
          setTotalWithDelivery(total + fee);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong. Try again.");
      }
      setLoading(false);
    };

    checkUserSession();
  }, [router]);

  if (loading) return <p>Loading checkout details...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="border-b pb-4 mb-4">
        <h3 className="text-lg font-semibold">Your Cart</h3>
        <ul>
          {cartItems.map((item, index) => (
            <li key={`${item.productId}-${index}`} className="flex justify-between py-2 border-b">
              <span>
                {item.productName} ({item.variant}) × {item.quantity}
              </span>
              <span>${item.totalPrice.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-semibold mt-3">
          <span>Subtotal:</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery Fee:</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold mt-3">
          <span>Total:</span>
          <span>${totalWithDelivery.toFixed(2)}</span>
        </div>
      </div>

      {/* 🚚 Delivery Address */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Delivery Address</h3>
        <p className="border p-2 rounded">{userDetails?.Address || "No address on file"}</p>
      </div>

      {/* 💳 Payment Methods */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Payment Method</h3>
        <div className="grid grid-cols-2 gap-4">
   <button
  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
  onClick={async () => {
    if (!userEmail) {
      toast.error("User not logged in. Please log in to continue.");
      return;
    }

    try {
      const orderId = await processPayment(
        userEmail, 
        cart,
        {}, 
        "Visa/Mastercard"
      );

      if (orderId) {
        // ✅ Redirect user to Stripe Checkout with email & name
        window.location.href = `/stripe-payment?orderId=${orderId}&amount=${totalWithDelivery}&email=${encodeURIComponent(userEmail)}&name=${encodeURIComponent(name)}`;
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("❌ Payment processing failed:", error);
      toast.error("An error occurred. Please try again.");
    }
  }}
>
  💳 Visa/Mastercard
</button>

<button
  className="px-4 py-2 bg-green-500 text-white rounded-lg"
  onClick={async () => {
    if (!userEmail) {
      toast.error("User not logged in. Please log in to continue.");
      return;
    }

    try {
      const orderId = await processPayment(
        userEmail,
        cart,
        {}, // No extra details for now
        "Bank Transfer"
      );

      if (orderId) {
        // ✅ Call the function from `api.ts`
        const result = await sendBankTransferEmail(userEmail, name, orderId, totalWithDelivery);

        if (result.success) {
          toast.success("Bank transfer details sent to your email.");
          router.push("/payment-pending?orderId=" + orderId);
        } else {
          toast.error("Failed to send bank transfer email.");
        }
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("❌ Payment processing failed:", error);
      toast.error("An error occurred. Please try again.");
    }
  }}
>
  🏦 Pay via Bank Transfer
</button>
<button
  className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
  onClick={async () => {
    if (!userEmail) {
      toast.error("User not logged in. Please log in to continue.");
      return;
    }

    try {
      const orderId = await processPayment(
        userEmail,
        cart,
        {}, // No extra details for now
        "Coinbase"
      );

      if (orderId) {
        // ✅ Redirect user to Coinbase Checkout with email & name
        window.location.href = `/coinbase-payment?orderId=${orderId}&amount=${totalWithDelivery}&email=${encodeURIComponent(userEmail)}&name=${encodeURIComponent(name)}`;
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("❌ Payment processing failed:", error);
      toast.error("An error occurred. Please try again.");
    }
  }}
>
  ₿ Pay with Crypto (Coinbase)
</button>
        </div>
      </div>
    </div>
  );
}
