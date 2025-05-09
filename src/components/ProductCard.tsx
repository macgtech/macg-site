"use client";

import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      quantity: 1,
      price: product.price,
      totalPrice: product.price,
    });
  };

  return (
    <div className="border p-4 rounded shadow-md">
      {product.image && (
        <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
      )}
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-700">${product.price.toFixed(2)}</p>
      <button onClick={handleAddToCart} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Add to Cart
      </button>
    </div>
  );
}


