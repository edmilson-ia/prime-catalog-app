CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TABLE public.estoque_sync_config (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  token text NOT NULL DEFAULT encode(extensions.gen_random_bytes(32), 'hex')
);

GRANT SELECT ON TABLE public.estoque_sync_config TO service_role;
ALTER TABLE public.estoque_sync_config ENABLE ROW LEVEL SECURITY;

INSERT INTO public.estoque_sync_config (singleton) VALUES (true);

CREATE OR REPLACE FUNCTION public.sync_product_stock(_rows jsonb)
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  WITH incoming_raw AS (
    SELECT
      ordinality,
      btrim(row_data->>'name') AS original_name,
      nullif(row_data->>'quantity', '')::integer AS quantity,
      regexp_replace(upper(btrim(row_data->>'name')), '\s+', ' ', 'g') AS normalized_name
    FROM jsonb_array_elements(_rows) WITH ORDINALITY AS source(row_data, ordinality)
    WHERE nullif(btrim(row_data->>'name'), '') IS NOT NULL
  ),
  incoming AS (
    SELECT DISTINCT ON (normalized_name)
      original_name,
      quantity,
      normalized_name
    FROM incoming_raw
    ORDER BY normalized_name, ordinality DESC
  ),
  updated_rows AS (
    UPDATE public.produtos AS product
    SET
      quantidade_estoque = incoming.quantity,
      estoque_atualizado_em = now()
    FROM incoming
    WHERE regexp_replace(upper(btrim(product."PRODUTO")), '\s+', ' ', 'g') = incoming.normalized_name
    RETURNING product.id
  ),
  missing_rows AS (
    SELECT incoming.original_name
    FROM incoming
    WHERE NOT EXISTS (
      SELECT 1
      FROM public.produtos AS product
      WHERE regexp_replace(upper(btrim(product."PRODUTO")), '\s+', ' ', 'g') = incoming.normalized_name
    )
  )
  SELECT jsonb_build_object(
    'updated', (SELECT count(*) FROM updated_rows),
    'notFound', COALESCE((SELECT jsonb_agg(original_name ORDER BY original_name) FROM missing_rows), '[]'::jsonb)
  );
$$;

REVOKE ALL ON FUNCTION public.sync_product_stock(jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_product_stock(jsonb) TO service_role;