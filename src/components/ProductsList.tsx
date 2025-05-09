// src/components/ProductDetails.tsx
"use client";

import Link from "next/link";
import ProductCarousel from "./ProductCarousel";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

interface Variant {
  name: string;
  barcode: string;
  stock: string;
  image: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  specialprice?: number;
  imageUrls: string[];
  variants?: Variant[];
}

interface ProductsListProps {
  products: Product[];
}

const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
  const { addToCart } = useCart();

  // State to track selected variants for each product
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: Variant }>({});

  const handleVariantChange = (productId: string, variantName: string) => {
    const product = products.find((p) => p.id === productId);
    if (product && product.variants) {
      const newVariant = product.variants.find((v) => v.name === variantName);
      if (newVariant) {
        setSelectedVariants((prev) => ({ ...prev, [productId]: newVariant }));
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const variants: Variant[] = product.variants && product.variants.length > 0 ? product.variants : [{
          name: "Default Variant",
          barcode: "",
          stock: "",
          image: product.imageUrls.length > 0 ? product.imageUrls[0] : "",
        }];
        
        const selectedVariant = selectedVariants[product.id] || variants[0];

        return (
          <div key={product.id} className="p-4 border rounded-lg shadow-md relative">
            {product.specialprice && (
              <span className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 text-sm font-bold rounded-lg shadow-lg animate-bounce">
                  🔥 On Sale!
              </span>
            )}

            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <p className="mt-2">{product.description}</p>

<ProductCarousel 
  images={product.imageUrls} 
  selectedVariantImage={selectedVariant?.image} 
/>

            {variants.length > 1 && (
              <div className="mt-2">
                <label className="block font-semibold">Choose a variant:</label>
                <select
                  className="border p-2 w-full rounded mt-1"
                  value={selectedVariant?.name}
                  onChange={(e) => handleVariantChange(product.id, e.target.value)}
                >
                  {variants.map((variant) => (
                    <option key={variant.name} value={variant.name}>
                      {variant.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-2">
              {product.specialprice ? (
                <>
                  <p className="text-lg text-gray-500 line-through">${product.price.toFixed(2)}</p>
                  <p className="text-lg font-bold text-red-600">${product.specialprice.toFixed(2)}</p>
                </>
              ) : (
                <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Link href={`/shop/${product.id}`} className="text-blue-500 hover:underline">
                View Details
              </Link>
              <button
                onClick={() => {
                  addToCart({
                    productId: product.id,
                    productName: `${product.name} (${selectedVariant.name})`,
                    quantity: 1,
                    price: product.specialprice || product.price,
                    totalPrice: (product.specialprice || product.price) * 1,
                    variant: selectedVariant.name,
                    barcode: selectedVariant.barcode,
                    image: selectedVariant.image || product.imageUrls[0],
                  });
                   // Display toast message with longer duration
    toast.success(`Level up my Gear! - Added ${product.name} to cart.`, {
      autoClose: 5000, // Keep toast visible for 5 seconds
      onClose: () => {
        // Refresh Floating Cart Button after toast disappears
        window.dispatchEvent(new Event("cartUpdated"));
      },
    });
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add to Cart
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductsList;


