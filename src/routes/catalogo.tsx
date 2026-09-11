import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/data/catalog";
import { normalizeProductName, useProductStock } from "@/lib/stock";

type CatalogSearch = { cat?: string | undefined };

export const Route = createFileRoute("/catalogo")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    cat: typeof search["cat"] === "string" ? (search["cat"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Catálogo — Prime Alimentos" },
      {
        name: "description",
        content:
          "Veja o catálogo completo da Prime Alimentos: cervejas, refrigerantes, whisky, vinhos, doces, carnes, descartáveis e mais, com preços atualizados.",
      },
      { property: "og:title", content: "Catálogo completo — Prime Alimentos" },
      {
        property: "og:description",
        content:
          "Busque produtos por nome, filtre por categoria e monte seu pedido direto no WhatsApp.",
      },
    ],
  }),
  component: Catalogo,
});

function Catalogo() {
  const { cat } = Route.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { data: stockByName = {} } = useProductStock();

  const activeCat = cat ?? "todos";
  const term = query.trim().toLowerCase();

  const searchResults = useMemo(
    () =>
      term.length > 0
        ? products.filter((p) => p.name.toLowerCase().includes(term))
        : [],
    [term],
  );

  const groups = useMemo(() => {
    const visible =
      activeCat === "todos"
        ? categories
        : categories.filter((c) => c.slug === activeCat);
    return visible
      .map((category) => ({
        category,
        items: products.filter((p) => p.category === category.slug),
      }))
      .filter((group) => group.items.length > 0);
  }, [activeCat]);

  return (
    <div>
      <AppHeader title="Catálogo" />

      <div className="sticky top-16 z-10 space-y-3 bg-background/95 px-4 pt-3 pb-2 backdrop-blur">
        <div className="flex items-center gap-2 rounded-full bg-card px-3.5 py-2.5 shadow-[var(--shadow-card)]">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar produto por nome..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {[{ slug: "todos", name: "Todos", icon: "ShoppingBasket" }, ...categories].map(
            (category) => {
              const isActive = term.length === 0 && category.slug === activeCat;
              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => {
                    setQuery("");
                    navigate({
                      to: "/catalogo",
                      search:
                        category.slug === "todos"
                          ? {}
                          : { cat: category.slug },
                    });
                  }}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-ink"
                  }`}
                >
                  <CategoryIcon name={category.icon} className="size-3.5" />
                  {category.name}
                </button>
              );
            },
          )}
        </div>
      </div>

      {term.length > 0 ? (
        <section className="space-y-2.5 px-4 pt-2 pb-6">
          <p className="text-[11px] font-semibold text-muted-foreground">
            {searchResults.length} resultado(s) para "{query.trim()}"
          </p>
          {searchResults.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum produto encontrado.
            </p>
          ) : (
            searchResults.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                stock={stockByName[normalizeProductName(product.name)]}
              />
            ))
          )}
        </section>
      ) : (
        <div className="px-4 pt-2 pb-6">
          {groups.map((group) => (
            <section key={group.category.slug} className="space-y-2.5 pb-5">
              <div className="flex items-center gap-2 pt-1">
                <span
                  className="grid size-7 shrink-0 place-items-center rounded-lg text-primary-foreground"
                  style={{ backgroundColor: group.category.color }}
                >
                  <CategoryIcon name={group.category.icon} className="size-4" />
                </span>
                <h2 className="text-sm font-bold text-ink">
                  {group.category.name}
                </h2>
                <span className="text-[11px] font-semibold text-muted-foreground">
                  {group.items.length} itens
                </span>
              </div>
              {group.items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  stock={stockByName[normalizeProductName(product.name)]}
                />
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

