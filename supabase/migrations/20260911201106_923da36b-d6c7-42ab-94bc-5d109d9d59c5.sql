CREATE POLICY "Only service role can read stock sync configuration"
ON public.estoque_sync_config
FOR SELECT
TO service_role
USING (true);