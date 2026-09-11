import { createFileRoute } from "@tanstack/react-router";

const N8N_WEBHOOK_URL =
  process.env["N8N_WEBHOOK_URL"] ||
  "https://grappling-clarinet-shower.ngrok-free.dev/webhook/deposito_de_bebida";

type OrderItem = {
  produto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
};

type OrderPayload = {
  itens: OrderItem[];
  totalItens: number;
  totalPedido: number;
  criadoEm: string;
};

function isValidPayload(value: unknown): value is OrderPayload {
  if (!value || typeof value !== "object") return false;
  const payload = value as Record<string, unknown>;
  return (
    Array.isArray(payload["itens"]) &&
    typeof payload["totalItens"] === "number" &&
    typeof payload["totalPedido"] === "number" &&
    typeof payload["criadoEm"] === "string"
  );
}

export const Route = createFileRoute("/api/public/pedido-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "JSON inválido" }, { status: 400 });
        }

        if (!isValidPayload(payload)) {
          return Response.json({ error: "Formato de pedido inválido" }, { status: 400 });
        }

        try {
          await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(5000),
          });
        } catch (error) {
          console.error("Falha ao repassar pedido para o n8n", error);
        }

        return Response.json({ received: true });
      },
    },
  },
});
