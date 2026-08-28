import { createFileRoute } from "@tanstack/react-router";
import { Banknote, Crown, MapPin, Truck } from "lucide-react";
import { logoUrl } from "@/lib/logo";
import { AppHeader } from "@/components/AppHeader";
import { products } from "@/data/catalog";

export const Route = createFileRoute("/empresa")({
  head: () => ({
    meta: [
      { title: "A empresa — Prime Alimentos" },
      {
        name: "description",
        content:
          "Conheça a Prime Alimentos, distribuidora de bebidas e alimentos do Rio de Janeiro com entrega no mesmo dia e mais de 300 itens em catálogo.",
      },
      { property: "og:title", content: "A empresa — Prime Alimentos" },
      {
        property: "og:description",
        content:
          "Distribuidora carioca de bebidas e alimentos, atendimento direto pelo WhatsApp.",
      },
    ],
  }),
  component: Empresa,
});

function Empresa() {
  return (
    <div>
      <AppHeader title="A empresa" />

      <section className="bg-hero-gradient px-5 py-7 text-center">
        <img
          src={logoUrl}
          alt="Logo Prime Alimentos"
          width={1024}
          height={1024}
          loading="lazy"
          className="mx-auto size-24 rounded-full bg-card object-contain p-1"
        />
        <h1 className="mt-3 text-xl font-bold text-primary-foreground">
          Prime Alimentos
        </h1>
        <p className="mt-1 text-xs font-semibold text-gold">
          Distribuidora de bebidas e alimentos · Rio de Janeiro
        </p>
      </section>

      <section className="space-y-3 px-4 py-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Somos uma distribuidora carioca focada em bares, mercados,
          restaurantes e eventos. Trabalhamos com {products.length} itens entre
          cervejas, refrigerantes, destilados, doces, carnes, descartáveis e
          cestas básicas, sempre com preço de atacado e atendimento direto.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Card icon={<Truck className="size-4 text-primary" />} title="Entrega no mesmo dia">
            Pedidos confirmados até o fim da tarde.
          </Card>
          <Card icon={<Banknote className="size-4 text-primary" />} title="Pix e Dinheiro">
            Pagamento simples na entrega.
          </Card>
          <Card icon={<MapPin className="size-4 text-primary" />} title="Rio de Janeiro">
            Capital e Baixada Fluminense.
          </Card>
          <Card icon={<Crown className="size-4 text-gold" />} title="Marcas premium">
            Do básico ao topo de linha.
          </Card>
        </div>
      </section>
    </div>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-card p-3.5 shadow-[var(--shadow-card)]">
      {icon}
      <p className="mt-2 text-xs font-bold text-ink">{title}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{children}</p>
    </div>
  );
}
