// src/store/cart.tsx
import React, { createContext, useContext, useMemo, useState } from "react";

export type CartItem = {
  id: string;           // e.g., "tshirt1.jpg"
  title: string;
  price: number;        // displayed price (INR)
  image: string;        // filename from /src/assets
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  totalDisplay: number; // sum(display price * qty)
  count: number;        // total units
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const api = useMemo<CartCtx>(() => {
    return {
      items,
      add: (item, qty = 1) =>
        setItems((prev) => {
          const i = prev.findIndex((p) => p.id === item.id);
          if (i >= 0) {
            const next = [...prev];
            next[i] = { ...next[i], qty: next[i].qty + qty };
            return next;
          }
          return [...prev, { ...item, qty }];
        }),
      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      clear: () => setItems([]),
      totalDisplay: items.reduce((s, p) => s + p.price * p.qty, 0),
      count: items.reduce((s, p) => s + p.qty, 0),
    };
  }, [items]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
