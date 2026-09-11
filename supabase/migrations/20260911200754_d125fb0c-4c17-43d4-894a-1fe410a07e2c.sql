REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE public.produtos FROM anon, authenticated;
REVOKE ALL ON SEQUENCE public.produtos_id_seq FROM anon, authenticated;
GRANT SELECT ON TABLE public.produtos TO anon, authenticated;
GRANT ALL ON TABLE public.produtos TO service_role;
GRANT ALL ON SEQUENCE public.produtos_id_seq TO service_role;