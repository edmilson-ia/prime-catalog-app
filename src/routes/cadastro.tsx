import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { DEFAULT_WHATSAPP_NUMBER, useWhatsappNumber } from "@/lib/settings";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Cadastro de cliente — Prime Alimentos" },
      {
        name: "description",
        content:
          "Cadastre seu estabelecimento na Prime Alimentos e receba condições especiais na distribuição de bebidas e alimentos no Rio de Janeiro.",
      },
      { property: "og:title", content: "Cadastro de cliente — Prime Alimentos" },
      {
        property: "og:description",
        content: "Envie seus dados pelo WhatsApp e comece a comprar no atacado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cadastro,
});

function Cadastro() {
  const { data: whatsappNumber = DEFAULT_WHATSAPP_NUMBER } = useWhatsappNumber();
  const [form, setForm] = useState({
    nome: "",
    estabelecimento: "",
    telefone: "",
    endereco: "",
  });

  const message = `Olá, Prime Alimentos! Quero me cadastrar:\n\nNome: ${form.nome}\nEstabelecimento: ${form.estabelecimento}\nTelefone: ${form.telefone}\nEndereço: ${form.endereco}`;

  const fields: { key: keyof typeof form; label: string; placeholder: string }[] = [
    { key: "nome", label: "Nome completo", placeholder: "Seu nome" },
    {
      key: "estabelecimento",
      label: "Estabelecimento",
      placeholder: "Bar, mercado, restaurante...",
    },
    { key: "telefone", label: "Telefone / WhatsApp", placeholder: "(21) 90000-0000" },
    { key: "endereco", label: "Endereço", placeholder: "Rua, número, bairro" },
  ];

  return (
    <div>
      <AppHeader title="Cadastro" />

      <section className="space-y-4 px-4 py-5">
        <div>
          <h1 className="text-xl font-bold text-ink">Cadastre-se</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Preencha seus dados e envie para o nosso atendimento.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
          {fields.map((field) => (
            <label key={field.key} className="block">
              <span className="text-[11px] font-bold text-ink">{field.label}</span>
              <input
                value={form[field.key]}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, [field.key]: event.target.value }))
                }
                placeholder={field.placeholder}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
          ))}

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center rounded-full bg-gold px-4 py-3 text-sm font-bold text-ink transition-colors hover:bg-gold-hover"
          >
            Fazer cadastro
          </a>
        </div>
      </section>
    </div>
  );
}
