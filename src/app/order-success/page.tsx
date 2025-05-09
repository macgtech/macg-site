"use client";

import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white text-center">
      <h1 className="text-2xl font-bold text-green-600">🎉 Order Placed Successfully!</h1>
      <p className="mt-4 text-gray-700">
        Thank you for your purchase! Your order has been successfully processed.
      </p>
      <div className="mt-6">
        <Link href="/shop">
          <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
}

