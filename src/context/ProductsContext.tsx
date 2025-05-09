"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { fetchProducts } from "@/utils/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  specialprice?: number;
  imageUrls: string[];
}

interface ProductsContextProps {
  products: Product[];
  fetchProductById: (id: string) => Product | null;
}

const ProductsContext = createContext<ProductsContextProps | null>(null);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };

    loadProducts();
  }, []);

  const fetchProductById = (id: string) => {
    return products.find((product) => product.id === id) || null;
  };

  return (
    <ProductsContext.Provider value={{ products, fetchProductById }}>
      {children}
    </ProductsContext.Provider>
  );
};


