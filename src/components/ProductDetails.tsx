"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { fetchProductById } from "@/utils/api";
import ProductCarousel from "@/components/ProductCarousel";
import { toast } from "react-toastify";

interface Variant {
  name: string;
  barcode: string;
  stock: string;
  image: string;
}

interface Product {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  specialprice?: number;
  features?: string;
  tags?: string;
  dimensions?: string;
  imageUrls?: string[];
  variants?: Variant[];
}

const ProductDetailsPage = () => {
  const params = useParams();
  const productId = params?.id;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) return;
      try {
        const response = await fetch(`/api/proxy?action=getProductById&productId=${productId}`, {
          method: "GET",
          headers: { "Cache-Control": "no-store" },
        });
        const data = await response.json();

        if (data.success && data.data) {
          const fetchedProduct = data.data;

          const formattedProduct: Product = {
            id: String(fetchedProduct["Product ID"]),
            name: fetchedProduct["Product Name"] || "Unknown Product",
            description: fetchedProduct["Description"] || "No description available.",
            price: Number(fetchedProduct["Price (GST Incl.)"]) || 0,
            specialprice: Number(fetchedProduct["Special Price"]) || null,
            features: fetchedProduct["Features"] || "",
            tags: fetchedProduct["Tags"] || "",
            dimensions: fetchedProduct["Dimensions"] || "",
            imageUrls: [
              fetchedProduct["Image URL 1"],
              fetchedProduct["Image URL 2"],
              fetchedProduct["Image URL 3"],
              fetchedProduct["Image URL 4"],
              fetchedProduct["Image URL 5"],
              fetchedProduct["Image URL 6"],
              fetchedProduct["Image URL 7"],
              fetchedProduct["Image URL 8"],
              fetchedProduct["Image URL 9"],
              fetchedProduct["Image URL 10"],
              fetchedProduct["Video URL 1"],
              fetchedProduct["Video URL 2"],
              fetchedProduct["Video URL 3"],
            ].filter(Boolean),
            variants: fetchedProduct.variants && Array.isArray(fetchedProduct.variants)
              ? fetchedProduct.variants.map((variant: any) => ({
                  name: variant.name || "Default Variant",
                  barcode: variant.barcode || "",
                  stock: variant.stock || "0",
                  image: variant.image || "",
                }))
              : [],
          };

          setProduct(formattedProduct);
          setSelectedVariant(
            formattedProduct.variants?.length ? formattedProduct.variants[0] : null
          );
        }
      } catch (error) {
        console.error("Failed to fetch product data", error);
      }
    };

    fetchData();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleVariantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    const newVariant =
      product.variants?.find((v) => v.name === selectedName) ||
      selectedVariant;
    setSelectedVariant(newVariant);
  };

  const handleAddToCart = () => {
    if (!product.id) return;

    addToCart({
      productId: product.id,
      productName: product.name || "Unknown Product",
      quantity: 1,
      price: product.specialprice ?? product.price ?? 0,
      variant: selectedVariant?.name || "Default Variant",
      barcode: selectedVariant?.barcode || "",
      image: selectedVariant?.image || product.imageUrls?.[0] || "",
    });

    toast.success(`Added ${product.name} to cart.`, {
      autoClose: 5000,
    });
  };

  // Convert features into table rows
  const featureRows = (product.features || "")
    .split(",")
    .map((feature) => feature.split(":").map((str) => str.trim()));

  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-start gap-4">
        <div className="w-1/3">
          <ProductCarousel
            images={product.imageUrls || []}
            selectedVariantImage={selectedVariant?.image}
          />
        </div>
        <div className="w-2/3">
          <h1 className="text-3xl font-bold mb-2">
            {product.name || "Unknown Product"}
          </h1>
          <p className="mb-4">{product.description || "No description available."}</p>

          {product.specialprice && (
            <span className="bg-red-600 text-white px-2 py-1 text-sm font-bold rounded-lg shadow-lg animate-bounce">
              🔥 On Sale!
            </span>
          )}

          <div className="mt-4">
            {product.specialprice ? (
              <>
                <p className="text-lg text-gray-500 line-through">
                  ${product.price?.toFixed(2) ?? "0.00"}
                </p>
                <p className="text-2xl font-bold text-red-600">
                  ${product.specialprice?.toFixed(2) ?? "0.00"}
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold">
                ${product.price?.toFixed(2) ?? "0.00"}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <table className="w-full border-collapse border border-gray-200">
          <tbody>
            {featureRows.map(([key, value], index) => (
              <tr key={index} className="border-t">
                <td className="p-2 font-semibold bg-gray-100">{key}</td>
                <td className="p-2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
