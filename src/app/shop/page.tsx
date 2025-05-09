"use client";

import { useState, useEffect } from "react";
import { fetchProducts } from "@/utils/api";
import ProductsList from "@/components/ProductsList";
import SidebarFilters from "@/components/SidebarFilters";
import FloatingCartButton from "@/components/FloatingCartButton";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartUpdated, setCartUpdated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
    };
    fetchData();
  }, []);

  const handleFilterChange = (filters) => {
    const { category, subcategory, subSubcategory, specialCategory, searchQuery } = filters;

    const filtered = products.filter((product) => {
      return (
        (!category || product.category === category) &&
        (!subcategory || product.subcategory === subcategory) &&
        (!subSubcategory || product.subSubcategory === subSubcategory) &&
        (!specialCategory || product.specialCategory === specialCategory) &&
        (!searchQuery || (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    });

    setFilteredProducts(filtered);
  };

  const triggerCartUpdate = () => {
    setCartUpdated(true);
    setTimeout(() => setCartUpdated(false), 2000);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Filters */}
      <aside className="w-1/4 h-screen overflow-y-auto border-r border-gray-300 p-4">
        <SidebarFilters products={products} onFilterChange={handleFilterChange} />
      </aside>

      {/* Main Product Listing */}
      <main className="w-3/4 overflow-y-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-6">Products</h1>
        <ProductsList products={filteredProducts} onCartUpdate={triggerCartUpdate} />
      </main>

      {/* Floating Cart Button (Only on Products Page) */}
      <FloatingCartButton cartUpdated={cartUpdated} />
    </div>
  );
}
