"use client";

import { useParams } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";

const ProductDetailsPage = () => {
  const params = useParams();
  const productId = params?.id;

  console.log("Product ID from params:", productId);

  if (!productId) {
    return <div>Invalid product ID.</div>;
  }

  return <ProductDetails productId={productId} />;
};

export default ProductDetailsPage;
