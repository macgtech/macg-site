"use client";

import { useState } from 'react';

interface CoinbaseCheckoutButtonProps {
  amount: number;
  currency: string;
  orderId: string;
}

const CoinbaseCheckoutButton: React.FC<CoinbaseCheckoutButtonProps> = ({
  amount,
  currency,
  orderId,
}) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/coinbase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          orderId,
          name: 'Order Payment',
          description: 'Payment for your order',
        }),
      });

      const data = await response.json();

      if (data.hosted_url) {
        window.location.href = data.hosted_url; // Redirect to Coinbase checkout page
      } else {
        console.error('Error with Coinbase checkout:', data.error);
      }
    } catch (err) {
      console.error('Error initiating Coinbase checkout:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`px-4 py-2 rounded ${
        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
      } text-white`}
    >
      {loading ? 'Processing...' : 'Pay with Crypto'}
    </button>
  );
};

export default CoinbaseCheckoutButton;

