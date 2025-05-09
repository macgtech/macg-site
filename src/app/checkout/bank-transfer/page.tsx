"use client";

import { useSearchParams } from "next/navigation";

export default function BankTransferPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="max-w-lg mx-auto p-6 border rounded shadow-md">
      <h2 className="text-2xl font-bold">Bank Transfer Payment</h2>
      <p>Your order ID: <strong>{orderId}</strong></p>
      <p>Please transfer the total amount to the following bank account:</p>
      <ul>
        <li><strong>Bank:</strong> XYZ Bank</li>
        <li><strong>Account Number:</strong> 12345678</li>
        <li><strong>Reference:</strong> {orderId}</li>
      </ul>
      <p>Once payment is made, please email support with your payment confirmation.</p>
    </div>
  );
}
