// src/pages/_app.tsx
import "@/styles/globals.css"; // Import global styles
import type { AppProps } from "next/app";
import { CartProvider } from "@/context/CartContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

