import { Link } from "@tanstack/react-router";
import {
  Building2,
  Home,
  MessageCircle,
  ShoppingBag,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { CartSheet } from "@/components/CartSheet";
import { WhatsappIcon } from "@/components/WhatsappIcon";
import { useCart } from "@/lib/cart";
import { normalizeProductName, useProductStock } from "@/lib/stock";

const tabs: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "Início", icon: Home },
  { to: "/catalogo", label: "Catálogo", icon: ShoppingBag },
  { to: "/contato", label: "Contato", icon: MessageCircle },
  { to: "/cadastro", label: "Cadastro", icon: UserPlus },
  { to: "/empresa", label: "Empresa", icon: Building2 },
];

export function PhoneShell({ children }: { children: ReactNode }) {
  const { count, whatsappUrl } = useCart();
  const { lines, setCartOpen } = useCart();
  const { data: stockByName = {} } = useProductStock();

  const openOrder = () => {
    const hasChangedPrice = lines.some((line) => {
      const current = stockByName[normalizeProductName(line.product.name)]?.promotionalPrice;
      return current !== null && current !== undefined && current > 0 && current !== line.unitPrice;
    });
    if (hasChangedPrice) {
      setCartOpen(true);
      return;
    }
    window.open(whatsappUrl(), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex h-dvh justify-center py-0 sm:py-6">
      <div className="relative flex h-full w-full max-w-[400px] flex-col overflow-hidden bg-background shadow-[var(--shadow-frame)] sm:rounded-[2.25rem] sm:border-4 sm:border-ink">
        <main className="flex-1 overflow-y-auto pb-28">{children}</main>

        <button
          type="button"
          onClick={openOrder}
          className="absolute right-4 bottom-20 z-30 flex items-center gap-2 rounded-full bg-primary py-3 pr-4 pl-3.5 text-sm font-bold text-primary-foreground shadow-[var(--shadow-card)] transition-colors hover:bg-brand-hover"
        >
          <WhatsappIcon className="size-4 text-gold" />
          Pedidos
          {count > 0 ? (
            <span className="grid min-w-5 place-items-center rounded-full bg-gold px-1.5 text-[11px] font-bold text-ink">
              {count}
            </span>
          ) : null}
        </button>

        <CartSheet />

        <nav className="absolute inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card pt-1.5 pb-2">
          {tabs.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              activeOptions={{ exact: tab.to === "/" }}
              className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-muted-foreground data-[status=active]:text-primary"
            >
              <tab.icon className="size-5" />
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
