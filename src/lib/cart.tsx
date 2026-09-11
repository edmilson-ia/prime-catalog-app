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
import { DEFAULT_WHATSAPP_NUMBER, useWhatsappNumber } from "@/lib/settings";

const STORAGE_KEY = "prime-cart";
const ORDER_KEY = "prime-order-number";
const FIRST_ORDER = 1001;

/** @deprecated use useWhatsappNumber() — kept as a static fallback only */
export const WHATSAPP_NUMBER = DEFAULT_WHATSAPP_NUMBER;

async function notifyOrderWebhook(
  lines: { product: Product; qty: number; unitPrice: number }[],
  total: number,
) {
  if (lines.length === 0) return;
  try {
    const payload = {
      itens: lines.map((l) => ({
        produto: l.product.name,
        quantidade: l.qty,
        precoUnitario: l.unitPrice,
        subtotal: Math.round(l.unitPrice * l.qty * 100) / 100,
      })),
      totalItens: lines.reduce((sum, l) => sum + l.qty, 0),
      totalPedido: total,
      criadoEm: new Date().toISOString(),
    };
    await fetch("/api/public/pedido-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    /* silencioso: não deve afetar a experiência do cliente */
  }
}

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
  placeOrder: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { data: whatsappNumber = DEFAULT_WHATSAPP_NUMBER } = useWhatsappNumber();

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
    setLines((prev) => {
      const index = prev.findIndex((line) => line.product.id === id);
      // Bail out with the SAME array reference when nothing actually changes —
      // otherwise every render creates a new `lines` array, which retriggers any
      // effect keyed on `lines` (e.g. CartSheet's price-sync effect) forever.
      if (index === -1 || prev[index].unitPrice === unitPrice) return prev;
      const next = [...prev];
      next[index] = { ...next[index], unitPrice };
      return next;
    });
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
      return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    };

    const placeOrder = () => {
      void notifyOrderWebhook(pricedLines, total);
      window.open(whatsappUrl(), "_blank", "noopener,noreferrer");
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
      placeOrder,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pricedLines is derived
    // fresh from `lines` on every render; including it here would make this memo
    // recompute (and return a new `lines` array reference) on every render, which
    // creates an infinite update loop in consumers that key effects off `lines`.
  }, [lines, cartOpen, add, increment, decrement, updatePrice, whatsappNumber]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
