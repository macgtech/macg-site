// Update to fix variant dropdown display on the detail screen
// Ensure barcode is included even for the default variant without options

"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Variant {
  name: string;
  barcode: string;
  image: string;
}

interface ProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    barcode?: string; // Add default barcode for single-variant products
    variants?: Variant[];
    images?: string[];
  };
}

const ProductWithVariants: React.FC<ProductProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : { name: "Default", barcode: product.barcode || "", image: product.images?.[0] || "" }
  );

  const handleVariantChange = (variantName: string) => {
    if (!product.variants) return;
    const newVariant = product.variants.find((v) => v.name === variantName) || null;
    setSelectedVariant(newVariant);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      variant: selectedVariant.name,
      barcode: selectedVariant.barcode,
      quantity: 1,
      totalPrice: product.price,
      image: selectedVariant.image,
    });
    toast.success("Item added to cart!");
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
      {product.variants && product.variants.length > 0 ? (
        <div>
          <label htmlFor="variant-select">Select Variant:</label>
          <select
            id="variant-select"
            onChange={(e) => handleVariantChange(e.target.value)}
            value={selectedVariant?.name}
          >
            {product.variants.map((variant) => (
              <option key={variant.barcode} value={variant.name}>
                {variant.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>Default variant selected</p>
      )}
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductWithVariants;
