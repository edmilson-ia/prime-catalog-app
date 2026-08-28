import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatBRL, type Product } from "@/data/catalog";

export const WHATSAPP_NUMBER = "5521988012670";

export type CartLine = { product: Product; qty: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  qtyOf: (id: string) => number;
  add: (product: Product) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  whatsappUrl: () => string;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const add = useCallback((product: Product) => {
    setLines((prev) =>
      prev.some((l) => l.product.id === product.id)
        ? prev.map((l) =>
            l.product.id === product.id ? { ...l, qty: l.qty + 1 } : l,
          )
        : [...prev, { product, qty: 1 }],
    );
  }, []);

  const increment = useCallback((id: string) => {
    setLines((prev) =>
      prev.map((l) => (l.product.id === id ? { ...l, qty: l.qty + 1 } : l)),
    );
  }, []);

  const decrement = useCallback((id: string) => {
    setLines((prev) =>
      prev
        .map((l) => (l.product.id === id ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, l) => sum + l.qty, 0);
    const total = lines.reduce((sum, l) => sum + l.qty * l.product.price, 0);

    const whatsappUrl = () => {
      let message: string;
      if (lines.length === 0) {
        message = "Olá, Prime Alimentos! Gostaria de mais informações.";
      } else {
        const items = lines
          .map(
            (l) =>
              `• ${l.product.name}\n   ${l.qty} x ${formatBRL(l.product.price)} = ${formatBRL(l.qty * l.product.price)}`,
          )
          .join("\n");
        message = `Olá, Prime Alimentos! Gostaria de fazer o pedido:\n\n${items}\n\nTotal geral: ${formatBRL(total)}`;
      }
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    };

    return {
      lines,
      count,
      total,
      qtyOf: (id: string) => lines.find((l) => l.product.id === id)?.qty ?? 0,
      add,
      increment,
      decrement,
      clear: () => setLines([]),
      cartOpen,
      setCartOpen,
      whatsappUrl,
    };
  }, [lines, cartOpen, add, increment, decrement]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
