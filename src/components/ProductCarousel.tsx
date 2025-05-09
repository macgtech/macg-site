"use client";

import { useState, useEffect } from "react";

interface ProductCarouselProps {
  images: string[];
  selectedVariantImage?: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ images, selectedVariantImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (selectedVariantImage) {
      const newIndex = images.indexOf(selectedVariantImage);
      if (newIndex !== -1) {
        setCurrentIndex(newIndex);
        setPause(true);
        setTimeout(() => setPause(false), 10000); // Pause for 10 seconds
      }
    }
  }, [selectedVariantImage, images]);

  useEffect(() => {
    if (!isHovered && !pause) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000); // Slowed down
      return () => clearInterval(interval);
    }
  }, [isHovered, pause, images.length]);

  return (
    <div
      className="relative flex justify-center items-center bg-gray-200 p-2 rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() =>
          setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
        }
        className="absolute left-2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-900"
      >
        &lt;
      </button>
      <div className="w-full max-w-md">
 
          <img
            src={images[currentIndex] || "/placeholder-image.png"}
            alt={`Product Image ${currentIndex + 1}`}
            className="w-full h-auto rounded-md"
          />
        
      </div>
      <button
        onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)}
        className="absolute right-2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-900"
      >
        &gt;
      </button>
    </div>
  );
};

export default ProductCarousel;
