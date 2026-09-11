import { useQuery } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type StockRow = {
  PRODUTO: string;
  quantidade_estoque: number | null;
  preco_promocional: number | null;
};

export type ProductStock = {
  quantity: number | null;
  promotionalPrice: number | null;
};

const STOCK_QUERY_KEY = ["catalog-stock"] as const;

export function normalizeProductName(name: string) {
  return name.trim().replace(/\s+/g, " ").toUpperCase();
}

async function fetchProductStock() {
  const client = supabase as unknown as SupabaseClient;
  const { data, error } = await client
    .from("produtos")
    .select('"PRODUTO", quantidade_estoque, preco_promocional');

  if (error) throw error;

  return (data as StockRow[]).reduce<Record<string, ProductStock>>((stock, row) => {
    stock[normalizeProductName(row.PRODUTO)] = {
      quantity: row.quantidade_estoque,
      promotionalPrice: row.preco_promocional,
    };
    return stock;
  }, {});
}

export function useProductStock() {
  return useQuery({
    queryKey: STOCK_QUERY_KEY,
    queryFn: fetchProductStock,
    refetchInterval: 45_000,
    refetchIntervalInBackground: true,
    staleTime: 30_000,
    retry: 2,
  });
}