import { ShoppingCart } from "lucide-react";
import { logoUrl } from "@/lib/logo";
import { useCart } from "@/lib/cart";

export function AppHeader({ title }: { title: string }) {
  const { count, setCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 bg-ink px-4 py-3">
      <img
        src={logoUrl}
        alt="Prime Alimentos"
        width={40}
        height={40}
        className="size-10 rounded-full bg-card object-contain p-0.5"
      />
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm leading-tight font-bold text-primary-foreground">
          Prime Alimentos
        </p>
        <p className="truncate text-[11px] text-gold">{title}</p>
      </div>
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="relative grid size-10 place-items-center rounded-full bg-primary text-primary-foreground"
        aria-label={`Abrir carrinho com ${count} itens`}
      >
        <ShoppingCart className="size-5" />
        {count > 0 ? (
          <span className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
            {count}
          </span>
        ) : null}
      </button>
    </header>
  );
}
