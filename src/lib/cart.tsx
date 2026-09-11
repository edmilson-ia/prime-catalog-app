import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { formatBRL, type Product } from "@/data/catalog";

const STORAGE_KEY = "prime-cart";
const ORDER_KEY = "prime-order-number";
const FIRST_ORDER = 1001;

export const WHATSAPP_NUMBER = "5521988012670";

function nextOrderNumber() {
  try {
    const raw = window.localStorage.getItem(ORDER_KEY);
    const current = raw ? Number.parseInt(raw, 10) : NaN;
    const next = Number.isFinite(current) ? current + 1 : FIRST_ORDER;
    window.localStorage.setItem(ORDER_KEY, String(next));
    return next;
  } catch {
    return FIRST_ORDER;
  }
}


export type CartLine = { product: Product; qty: number; unitPrice: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  qtyOf: (id: string) => number;
  add: (product: Product, unitPrice?: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  updatePrice: (id: string, unitPrice: number) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  whatsappUrl: () => string;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, loaded]);


  const add = useCallback((product: Product, unitPrice = product.price) => {
    setLines((prev) =>
      prev.some((l) => l.product.id === product.id)
        ? prev.map((l) =>
            l.product.id === product.id ? { ...l, qty: l.qty + 1, unitPrice } : l,
          )
        : [...prev, { product, qty: 1, unitPrice }],
    );
  }, []);

  const pricedLines = lines.map((line) => ({
    ...line,
    unitPrice: Number.isFinite(line.unitPrice) ? line.unitPrice : line.product.price,
  }));

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

  const updatePrice = useCallback((id: string, unitPrice: number) => {
    setLines((prev) =>
      prev.map((line) =>
        line.product.id === id && line.unitPrice !== unitPrice
          ? { ...line, unitPrice }
          : line,
      ),
    );
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = pricedLines.reduce((sum, l) => sum + l.qty, 0);
    const total = pricedLines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);

    const whatsappUrl = () => {
      let message: string;
      if (pricedLines.length === 0) {
        message = "Olá, Prime Alimentos! Gostaria de mais informações.";
      } else {
        const items = pricedLines
          .map(
            (l) =>
              `• ${l.product.name}\n   ${l.qty} x ${formatBRL(l.unitPrice)} = ${formatBRL(l.qty * l.unitPrice)}`,
          )
          .join("\n");
        const order = nextOrderNumber();
        const totalItems = pricedLines.reduce((sum, l) => sum + l.qty, 0);
        message = `Olá, Prime Alimentos! Gostaria de fazer o pedido:\n\nPedido nº ${order}\n\n${items}\n\nQuantidade de itens: ${totalItems}\nTotal geral: ${formatBRL(total)}`;
      }
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    };

    return {
      lines: pricedLines,
      count,
      total,
      qtyOf: (id: string) => lines.find((l) => l.product.id === id)?.qty ?? 0,
      add,
      increment,
      decrement,
      updatePrice,
      clear: () => setLines([]),
      cartOpen,
      setCartOpen,
      whatsappUrl,
    };
  }, [lines, cartOpen, add, increment, decrement, updatePrice]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
