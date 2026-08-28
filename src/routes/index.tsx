import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Banknote, ChevronRight } from "lucide-react";
import { logoUrl } from "@/lib/logo";
import { AppHeader } from "@/components/AppHeader";
import { CategoryIcon } from "@/components/CategoryIcon";
import {
  categories,
  featuredCategories,
  products,
} from "@/data/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prime Alimentos — Distribuidora de Bebidas e Alimentos no RJ" },
      {
        name: "description",
        content:
          "Catálogo digital da Prime Alimentos: cervejas, refrigerantes, destilados, doces e carnes com entrega no mesmo dia no Rio de Janeiro. Pedidos pelo WhatsApp.",
      },
      { property: "og:title", content: "Prime Alimentos — Distribuidora no Rio de Janeiro" },
      {
        property: "og:description",
        content:
          "Mais de 300 itens em bebidas e alimentos. Faça seu pedido pelo WhatsApp com pagamento via Pix e dinheiro.",
      },
    ],
  }),
  component: Inicio,
});

function Inicio() {
  const featured = featuredCategories
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div>
      <AppHeader title="Rio de Janeiro" />

      <section className="bg-hero-gradient px-5 pt-7 pb-8 text-center">
        <img
          src={logoUrl}
          alt="Logo Prime Alimentos"
          width={1024}
          height={1024}
          className="mx-auto size-28 rounded-full bg-card object-contain p-1"
        />
        <p className="mt-3 text-xs font-semibold text-gold">
          Rio de Janeiro · Entrega no mesmo dia
        </p>
        <h1 className="mt-2 text-2xl font-bold text-primary-foreground">
          Bebidas e alimentos no atacado
        </h1>

        <Link
          to="/catalogo"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-4 py-3.5 text-sm font-bold text-ink transition-colors hover:bg-gold-hover"
        >
          Ver catálogo completo · {products.length} itens
          <ArrowRight className="size-4" />
        </Link>

        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-card/15 px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">
          <Banknote className="size-3.5 text-gold" />
          Pagamento via Pix e Dinheiro
        </div>
      </section>

      <section className="px-4 py-5">
        <h2 className="text-base font-bold text-ink">Categorias em destaque</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {featured.map((category) => (
            <Link
              key={category.slug}
              to="/catalogo"
              search={{ cat: category.slug }}
              className="flex items-center gap-2.5 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)]"
            >
              <span
                className="grid size-9 shrink-0 place-items-center rounded-xl text-primary-foreground"
                style={{ backgroundColor: category.color }}
              >
                <CategoryIcon name={category.icon} className="size-5" />
              </span>
              <span className="min-w-0 flex-1 text-xs leading-tight font-semibold text-ink">
                {category.name}
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
