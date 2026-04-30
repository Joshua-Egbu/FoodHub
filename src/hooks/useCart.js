// ============================================
// src/hooks/useCart.js
// ============================================
// Custom hook for easy access to CartContext.
// Same pattern as useAuth() in AuthContext.
//
// Usage in any component:
//   import useCart from '../hooks/useCart'
//   const { cartItems, addToCart, getCartCount } = useCart()
//
// This is cleaner than writing:
//   import { useContext } from 'react'
//   import CartContext from '../context/CartContext'
//   const { ... } = useContext(CartContext)
// ============================================

import { useContext } from "react";
import CartContext from "../context/CartContext";

const useCart = () => {
  const context = useContext(CartContext);

  // Safety check — if someone uses useCart outside
  // of CartProvider, throw a helpful error instead
  // of a confusing undefined crash
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};

export default useCart;
