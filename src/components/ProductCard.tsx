import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { categoryBySlug, formatBRL, type Product } from "@/data/catalog";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { qtyOf, add, increment, decrement } = useCart();
  const qty = qtyOf(product.id);
  const category = categoryBySlug(product.category);
  const [imageOk, setImageOk] = useState(Boolean(product.image));
  const [zoom, setZoom] = useState(false);

  const hasImage = imageOk && product.image;

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
        <h3 className="text-sm leading-snug font-semibold text-ink">
          {product.name}
        </h3>
        {product.description ? (
          <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
            {product.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="font-display text-base font-bold text-ink">
            {formatBRL(product.price)}
          </span>

          {qty === 0 ? (
            <button
              type="button"
              onClick={() => add(product)}
              className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-brand-hover"
            >
              Adicionar
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-full bg-secondary p-1">
              <button
                type="button"
                aria-label="Remover uma unidade"
                onClick={() => decrement(product.id)}
                className="grid size-6 place-items-center rounded-full bg-card text-ink"
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
                className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground"
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
