"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CART_STORAGE_KEY,
  cartSubtotal,
  normalizeCartItem,
  type CartAddInput,
  type CartItem,
} from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number | null;
  ready: boolean;
  addItem: (input: CartAddInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) =>
      normalizeCartItem({
        ...item,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((input: CartAddInput) => {
    const next = normalizeCartItem(input);
    setItems((prev) => {
      const existing = prev.find((item) => item.id === next.id);
      if (!existing) return [...prev, next];
      return prev.map((item) =>
        item.id === next.id
          ? {
              ...item,
              quantity: item.quantity + next.quantity,
              unitPrice: next.unitPrice ?? item.unitPrice,
              imageUrl: next.imageUrl || item.imageUrl,
            }
          : item
      );
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const qty = Math.max(1, Math.floor(quantity));
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: cartSubtotal(items),
      ready,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, ready, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
