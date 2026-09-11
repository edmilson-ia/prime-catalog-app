import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "node:crypto";

const STOCK_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1MhBdqLEUEtp4PywNGNF53DwQ9dABbLBoIW2DV2YM6Aw/gviz/tq?tqx=out:csv&sheet=ESTOQUE";

type StockRow = {
  name: string;
  quantity: string;
};

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (quoted) {
      if (character === '"' && csv[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  return rows;
}

function normalizeHeader(value: string): string {
  return value.trim().toUpperCase();
}

function parseStockRows(csv: string): StockRow[] {
  const rows = parseCsv(csv);
  const headers = rows[0]?.map(normalizeHeader);
  if (!headers) throw new Error("A planilha de estoque está vazia.");

  const productIndex = headers.indexOf("PRODUTO");
  const quantityIndex = headers.indexOf("QUANTIDADE");
  if (productIndex < 0 || quantityIndex < 0) {
    throw new Error("As colunas PRODUTO e QUANTIDADE não foram encontradas.");
  }

  return rows.slice(1).flatMap((columns) => {
    const name = columns[productIndex]?.trim() ?? "";
    if (!name) return [];

    const rawQuantity = columns[quantityIndex]?.trim() ?? "";
    const normalizedQuantity = rawQuantity
      .replace(/\s/g, "")
      .replace(/\.(?=\d{3}(?:\D|$))/g, "")
      .replace(",", ".");
    const parsedQuantity = Number(normalizedQuantity);
    const quantity =
      rawQuantity !== "" && Number.isFinite(parsedQuantity)
        ? String(Math.trunc(parsedQuantity))
        : "";

    return [{ name, quantity }];
  });
}

function tokensMatch(received: string, expected: string): boolean {
  const receivedBytes = Buffer.from(received);
  const expectedBytes = Buffer.from(expected);
  return (
    receivedBytes.length === expectedBytes.length &&
    timingSafeEqual(receivedBytes, expectedBytes)
  );
}

export const Route = createFileRoute("/api/public/sync-estoque")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const receivedToken = new URL(request.url).searchParams.get("token") ?? "";
        if (!receivedToken) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );
        const { data: config, error: configError } = await supabaseAdmin
          .from("estoque_sync_config")
          .select("token")
          .eq("singleton", true)
          .maybeSingle();

        if (configError || !config || !tokensMatch(receivedToken, config.token)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
          const response = await fetch(STOCK_CSV_URL, {
            headers: { accept: "text/csv" },
          });
          if (!response.ok) {
            throw new Error(`A planilha respondeu com status ${response.status}.`);
          }

          const rows = parseStockRows(await response.text());
          const { data, error } = await supabaseAdmin.rpc(
            "sync_product_stock",
            { _rows: rows },
          );
          if (error) throw error;

          return Response.json(data);
        } catch (error) {
          console.error("Stock sync failed", error);
          const message =
            error instanceof Error ? error.message : "Falha ao sincronizar estoque.";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});