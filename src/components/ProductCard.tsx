import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { categoryBySlug, formatBRL, type Product } from "@/data/catalog";
import { useCart } from "@/lib/cart";
import type { ProductStock } from "@/lib/stock";

export function ProductCard({
  product,
  stock,
}: {
  product: Product;
  stock?: ProductStock | undefined;
}) {
  const { qtyOf, add, increment, decrement } = useCart();
  const qty = qtyOf(product.id);
  const category = categoryBySlug(product.category);
  const [imageOk, setImageOk] = useState(Boolean(product.image));
  const [zoom, setZoom] = useState(false);

  const hasImage = imageOk && product.image;
  const outOfStock = stock !== undefined && (stock.quantity ?? 0) <= 0;
  const promotionalPrice = stock?.promotionalPrice;
  const hasPromotion =
    promotionalPrice !== null &&
    promotionalPrice !== undefined &&
    promotionalPrice > 0 &&
    promotionalPrice !== product.price;
  const unitPrice = hasPromotion ? promotionalPrice : product.price;

  return (
    <article className="flex gap-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
        {hasImage ? (
          <button
            type="button"
            onClick={() => setZoom(true)}
            aria-label={`Ampliar imagem de ${product.name}`}
            className="size-full"
          >
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="size-full object-contain"
              onError={() => setImageOk(false)}
            />
          </button>
        ) : (
          <div
            className="flex size-full items-center justify-center text-primary-foreground"
            style={{ backgroundColor: category?.color }}
          >
            <CategoryIcon name={category?.icon ?? "Package"} className="size-8" />
          </div>
        )}
      </div>

      {zoom && hasImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-6"
          onClick={() => setZoom(false)}
          role="presentation"
        >
          <div className="relative w-full max-w-[340px] rounded-2xl bg-card p-3">
            <button
              type="button"
              aria-label="Fechar imagem"
              onClick={() => setZoom(false)}
              className="absolute -top-3 -right-3 grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"
            >
              <X className="size-4" />
            </button>
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[60vh] w-full object-contain"
            />
            <p className="mt-2 text-center text-xs font-semibold text-ink">
              {product.name}
            </p>
          </div>
        </div>
      ) : null}


      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start gap-1.5">
          <h3 className="min-w-0 flex-1 text-sm leading-snug font-semibold text-ink">
            {product.name}
          </h3>
          {outOfStock ? (
            <span className="shrink-0 rounded-md bg-destructive px-1.5 py-1 text-[9px] leading-none font-bold text-destructive-foreground">
              FORA DE ESTOQUE
            </span>
          ) : null}
          {hasPromotion ? (
            <span className="shrink-0 rounded-md bg-gold px-1.5 py-1 text-[9px] leading-none font-bold text-ink">
              PROMOÇÃO
            </span>
          ) : null}
        </div>
        {product.description ? (
          <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
            {product.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="flex flex-wrap items-baseline gap-1.5">
            {hasPromotion ? (
              <span className="text-[11px] text-muted-foreground line-through">
                {formatBRL(product.price)}
              </span>
            ) : null}
            <span className={`font-display text-base font-bold ${hasPromotion ? "text-gold-hover" : "text-ink"}`}>
              {formatBRL(unitPrice)}
            </span>
          </span>

          {qty === 0 ? (
            <button
              type="button"
              onClick={() => add(product, unitPrice)}
              disabled={outOfStock}
              className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-destructive disabled:opacity-60"
            >
              Adicionar
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-full bg-secondary p-1">
              <button
                type="button"
                aria-label="Remover uma unidade"
                onClick={() => decrement(product.id)}
                disabled={outOfStock}
                className="grid size-6 place-items-center rounded-full bg-card text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="min-w-5 text-center text-xs font-bold text-ink">
                {qty}
              </span>
              <button
                type="button"
                aria-label="Adicionar uma unidade"
                onClick={() => increment(product.id)}
                disabled={outOfStock}
                className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground disabled:cursor-not-allowed disabled:bg-destructive disabled:opacity-40"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
