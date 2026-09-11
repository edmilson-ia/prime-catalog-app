import { useQuery } from "@tanstack/react-query";

const CONFIG_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1MhBdqLEUEtp4PywNGNF53DwQ9dABbLBoIW2DV2YM6Aw/gviz/tq?tqx=out:csv&sheet=CONFIG";

export const DEFAULT_WHATSAPP_NUMBER = "5521988012670";

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

async function fetchWhatsappNumber(): Promise<string> {
  try {
    const response = await fetch(CONFIG_CSV_URL);
    if (!response.ok) return DEFAULT_WHATSAPP_NUMBER;

    const rows = parseCsv(await response.text());
    const configRow = rows.find(
      (columns) => columns[0]?.trim().toUpperCase() === "WHATSAPP",
    );
    const digits = (configRow?.[1] ?? "").replace(/\D/g, "");

    return digits.length >= 12 ? digits : DEFAULT_WHATSAPP_NUMBER;
  } catch {
    return DEFAULT_WHATSAPP_NUMBER;
  }
}

export function useWhatsappNumber() {
  return useQuery({
    queryKey: ["config-whatsapp-number"],
    queryFn: fetchWhatsappNumber,
    refetchInterval: 5 * 60_000,
    staleTime: 4 * 60_000,
    retry: 1,
    placeholderData: DEFAULT_WHATSAPP_NUMBER,
  });
}
