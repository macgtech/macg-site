
	// src/components/SidebarFilters.tsx

	"use client";

	import { useState, useEffect } from "react";

	interface Product {
	  category: string;
	  subcategory: string;
	  subSubcategory: string;
	  specialCategory: string;
	  name: string; // For the search function
	}

	interface SidebarFiltersProps {
	  products: Product[];
	  onFilterChange: (filters: {
	    category?: string;
	    subcategory?: string;
	    subSubcategory?: string;
	    specialCategory?: string;
	    searchQuery?: string;
	  }) => void;
	}

	const SidebarFilters: React.FC<SidebarFiltersProps> = ({
	  products,
	  onFilterChange,
	}) => {
	  const [searchQuery, setSearchQuery] = useState<string>("");
	  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
	    null
	  );
	  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState<
	    string | null
	  >(null);
	  const [selectedSpecialCategory, setSelectedSpecialCategory] = useState<
	    string | null
	  >(null);

	  // Extract unique filters
	  const categories = Array.from(
	    new Set(products.map((p) => p.category).filter(Boolean))
	  );

	  const subcategories = selectedCategory
	    ? Array.from(
	        new Set(
	          products
	            .filter((p) => p.category === selectedCategory)
	            .map((p) => p.subcategory)
	            .filter(Boolean)
	        )
	      )
	    : [];

	  const subSubcategories = selectedSubcategory
	    ? Array.from(
	        new Set(
	          products
	            .filter((p) => p.subcategory === selectedSubcategory)
	            .map((p) => p.subSubcategory)
	            .filter(Boolean)
	        )
	      )
	    : [];

	  const specialCategories = Array.from(
	    new Set(products.map((p) => p.specialCategory).filter(Boolean))
	  );

	  // Notify parent component of filter changes
	  useEffect(() => {
	    onFilterChange({
	      category: selectedCategory,
	      subcategory: selectedSubcategory,
	      subSubcategory: selectedSubSubcategory,
	      specialCategory: selectedSpecialCategory,
	      searchQuery,
	    });
	  }, [
	    searchQuery,
	    selectedCategory,
	    selectedSubcategory,
	    selectedSubSubcategory,
	    selectedSpecialCategory,
	  ]);

	  // Clear all filters
	  const handleClearFilters = () => {
	    setSearchQuery("");
	    setSelectedCategory(null);
	    setSelectedSubcategory(null);
	    setSelectedSubSubcategory(null);
	    setSelectedSpecialCategory(null);
	  };

	  return (
	    <div>
	      {/* Search Bar */}
	      <div className="mb-4">
	        <input
	          type="text"
	          placeholder="Search products..."
	          value={searchQuery}
	          onChange={(e) => setSearchQuery(e.target.value)}
	          className="w-full p-2 border rounded"
	        />
	      </div>

	      {/* Clear Filters Button */}
	      <div className="mb-4">
	        <button
	          onClick={handleClearFilters}
	          className="w-full p-2 bg-gray-200 hover:bg-gray-300 text-black rounded"
	        >
	          Clear Filters
	        </button>
	      </div>

	      {/* Category Filter */}
	      <div className="mb-4">
	        <h3 className="font-bold mb-2">Category</h3>
	        <ul>
	          {categories.map((category, index) => (
	            <li key={`${category}-${index}`} className="mb-1">
	              <button
	                className={`text-left ${
	                  selectedCategory === category ? "font-bold" : ""
	                }`}
	                onClick={() =>
	                  setSelectedCategory(
	                    category === selectedCategory ? null : category
	                  )
	                }
	              >
	                {category}
	              </button>
	            </li>
	          ))}
	        </ul>
	      </div>

	      {/* Subcategory Filter */}
	      {selectedCategory && (
	        <div className="mb-4">
	          <h3 className="font-bold mb-2">Subcategory</h3>
	          <ul>
	            {subcategories.map((subcategory, index) => (
	              <li key={`${subcategory}-${index}`} className="mb-1">
	                <button
	                  className={`text-left ${
	                    selectedSubcategory === subcategory ? "font-bold" : ""
	                  }`}
	                  onClick={() =>
	                    setSelectedSubcategory(
	                      subcategory === selectedSubcategory ? null : subcategory
	                    )
	                  }
	                >
	                  {subcategory}
	                </button>
	              </li>
	            ))}
	          </ul>
	        </div>
	      )}

	      {/* Sub-Subcategory Filter */}
	      {selectedSubcategory && (
	        <div className="mb-4">
	          <h3 className="font-bold mb-2">Sub-Subcategory</h3>
	          <ul>
	            {subSubcategories.map((subSubcategory, index) => (
	              <li key={`${subSubcategory}-${index}`} className="mb-1">
	                <button
	                  className={`text-left ${
	                    selectedSubSubcategory === subSubcategory
	                      ? "font-bold"
	                      : ""
	                  }`}
	                  onClick={() =>
	                    setSelectedSubSubcategory(
	                      subSubcategory === selectedSubSubcategory
	                        ? null
	                        : subSubcategory
	                    )
	                  }
	                >
	                  {subSubcategory}
	                </button>
	              </li>
	            ))}
	          </ul>
	        </div>
	      )}

	      {/* Special Category Filter */}
	      <div className="mb-4">
	        <h3 className="font-bold mb-2">Special Category</h3>
	        <select
	          value={selectedSpecialCategory || ""}
	          onChange={(e) =>
	            setSelectedSpecialCategory(e.target.value || null)
	          }
	          className="w-full p-2 border rounded"
	        >
	          <option value="">All</option>
	          {specialCategories.map((specialCategory, index) => (
	            <option key={`${specialCategory}-${index}`} value={specialCategory}>
	              {specialCategory}
	            </option>
	          ))}
	        </select>
	      </div>
	    </div>
	  );
	};

	export default SidebarFilters;


