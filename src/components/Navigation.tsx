"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Page titles based on route
  const pageTitles: { [key: string]: string } = {
    "/": "Home",
    "/shop": "Shop",
    "/cart": "Cart",
    "/orders": "My Orders",
    "/my-details": "My Details",
    "/checkout": "Checkout",
    "/login": "Login",
  };

  return (
    <>
      <nav className="bg-[#c93b3b] text-white py-5 px-4 fixed top-0 w-full z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center space-x-3">
            <img src="/MacGLogo.png" alt="MacG TechnoloG" className="h-12 w-auto" />
            <span className="text-2xl font-extrabold tracking-wide">MacG TechnoloG</span>
          </Link>

          {/* Centered Page Title (Desktop Only) */}
          <div className="hidden md:block text-xl font-semibold text-center flex-grow">
            {pageTitles[pathname] || ""}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white text-2xl focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          {/* Navigation Links */}
          <div className={`md:flex space-x-6 text-lg font-semibold ${menuOpen ? "block" : "hidden"}`}>
            <Link href="/shop" className="hover:underline">Products</Link>
            <Link href="/cart" className="hover:underline">Cart</Link>
            <Link href="/orders" className="hover:underline">My Orders</Link>
            <Link href="/my-details" className="hover:underline">My Details</Link>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent page content from being cut off */}
      <div className="pt-24"></div>
    </>
  );
};

export default Navigation;
