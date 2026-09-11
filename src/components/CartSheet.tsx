import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { formatBRL } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import { WhatsappIcon } from "@/components/WhatsappIcon";
import { normalizeProductName, useProductStock } from "@/lib/stock";
import { useEffect } from "react";

export function CartSheet() {
  const { lines, total, cartOpen, setCartOpen, increment, decrement, updatePrice, whatsappUrl } =
    useCart();
  const { data: stockByName = {} } = useProductStock();

  useEffect(() => {
    lines.forEach((line) => {
      const promotionalPrice =
        stockByName[normalizeProductName(line.product.name)]?.promotionalPrice;
      const currentPrice =
        promotionalPrice !== null &&
        promotionalPrice !== undefined &&
        promotionalPrice > 0 &&
        promotionalPrice !== line.product.price
          ? promotionalPrice
          : line.product.price;
      updatePrice(line.product.id, currentPrice);
    });
  }, [lines, stockByName, updatePrice]);

  if (!cartOpen) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Fechar carrinho"
        onClick={() => setCartOpen(false)}
        className="absolute inset-0 bg-ink/50"
      />

      <div className="relative max-h-[80%] overflow-hidden rounded-t-3xl bg-card">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="flex items-center gap-2 text-base font-bold text-ink">
            <ShoppingCart className="size-4" /> Seu pedido
          </h2>
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setCartOpen(false)}
            className="grid size-8 place-items-center rounded-full bg-secondary text-ink"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="max-h-[45vh] space-y-2 overflow-y-auto px-4 py-3">
          {lines.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Seu carrinho está vazio.
            </p>
          ) : (
            lines.map((line) => {
              const stock = stockByName[normalizeProductName(line.product.name)];
              const outOfStock = stock !== undefined && (stock.quantity ?? 0) <= 0;
              const promotionalPrice = stock?.promotionalPrice;
              const currentPrice =
                promotionalPrice !== null &&
                promotionalPrice !== undefined &&
                promotionalPrice > 0 &&
                promotionalPrice !== line.product.price
                  ? promotionalPrice
                  : line.product.price;

              return (
              <div
                key={line.product.id}
                className="flex items-center gap-3 rounded-xl bg-secondary/60 p-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-ink">
                    {line.product.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatBRL(currentPrice)} ·{" "}
                    <span className="font-semibold text-ink">
                      {formatBRL(currentPrice * line.qty)}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-card p-1">
                  <button
                    type="button"
                    aria-label="Remover uma unidade"
                    onClick={() => decrement(line.product.id)}
                    className="grid size-6 place-items-center rounded-full bg-secondary text-ink"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="min-w-5 text-center text-xs font-bold text-ink">
                    {line.qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Adicionar uma unidade"
                    onClick={() => increment(line.product.id)}
                    disabled={outOfStock}
                    className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground disabled:cursor-not-allowed disabled:bg-destructive disabled:opacity-40"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>
              );
            })
          )}
        </div>

        <footer className="space-y-3 border-t border-border px-4 pt-3 pb-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total geral</span>
            <span className="font-display text-xl font-bold text-ink">
              {formatBRL(total)}
            </span>
          </div>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-4 py-3 text-sm font-bold text-ink transition-colors hover:bg-gold-hover"
          >
            <WhatsappIcon className="size-4 text-whatsapp" />
            Finalizar pedido no WhatsApp
          </a>
        </footer>
      </div>
    </div>
  );
}
