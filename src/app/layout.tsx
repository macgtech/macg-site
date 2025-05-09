import "@/app/globals.css";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import Navigation from "@/components/Navigation";
import FloatingLoginButton from "@/components/FloatingLoginButton"; // ✅ Ensure this is here
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Load Google Maps API */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <CartProvider>
          <ProductsProvider>
            <Navigation />
            <ToastContainer position="top-right" autoClose={3000} />
            {children}
            <FloatingLoginButton /> {/* ✅ Ensure this is placed correctly */}
          </ProductsProvider>
        </CartProvider>
      </body>
    </html>
  );
}


