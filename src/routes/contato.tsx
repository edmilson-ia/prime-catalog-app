import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Phone } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { WhatsappIcon } from "@/components/WhatsappIcon";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Prime Alimentos" },
      {
        name: "description",
        content:
          "Fale com a Prime Alimentos pelo WhatsApp (21) 98801-2670. Atendimento para distribuição de bebidas e alimentos no Rio de Janeiro.",
      },
      { property: "og:title", content: "Contato — Prime Alimentos" },
      {
        property: "og:description",
        content: "WhatsApp (21) 98801-2670 · Rio de Janeiro · Entrega no mesmo dia.",
      },
    ],
  }),
  component: Contato,
});

function Contato() {
  const { whatsappUrl } = useCart();

  return (
    <div>
      <AppHeader title="Contato" />

      <section className="space-y-3 px-4 py-5">
        <h1 className="text-xl font-bold text-ink">Fale com a gente</h1>
        <p className="text-sm text-muted-foreground">
          Atendimento rápido pelo WhatsApp para orçamentos, disponibilidade de
          estoque e pedidos.
        </p>

        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-2xl bg-primary p-4 text-primary-foreground"
        >
          <WhatsappIcon className="size-6 text-gold" />
          <div>
            <p className="text-sm font-bold">WhatsApp</p>
            <p className="text-xs opacity-90">+55 21 98801-2670</p>
          </div>
        </a>

        <div className="space-y-2.5 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
          <InfoRow icon={<Phone className="size-4 text-primary" />} title="Telefone">
            (21) 96407-9667
          </InfoRow>
          <InfoRow icon={<MapPin className="size-4 text-primary" />} title="Região">
            Rio de Janeiro e Baixada Fluminense
          </InfoRow>
          <InfoRow icon={<Clock className="size-4 text-primary" />} title="Horário">
            Seg a sex: 07:00 às 18:00
            <br />
            Sábado: 07:00 às 17:00
            <br />
            Domingo e feriado: 07:00 às 13:00
          </InfoRow>
        </div>

        <a
          href="https://maps.app.goo.gl/gB1GUBmU8LwwhMoK8?g_st=ic"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary">
            <MapPin className="size-5 text-primary" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-ink">Endereço do depósito</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              R. Gen. Corrêa e Castro, 298 · Jardim América, Rio de Janeiro
            </p>
            <p className="mt-1 text-xs font-bold text-primary">Abrir no Google Maps</p>
          </div>
        </a>

        <div className="rounded-2xl bg-secondary p-4">
          <p className="text-xs font-semibold text-ink">
            Pagamento via Pix e Dinheiro
          </p>
        </div>
      </section>
    </div>
  );
}

function InfoRow({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-bold text-ink">{title}</p>
        <p className="text-xs text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
