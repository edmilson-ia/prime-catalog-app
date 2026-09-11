CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

ALTER TABLE public.produtos
ADD COLUMN preco_promocional numeric NULL;

REVOKE UPDATE ON public.produtos FROM authenticated;
GRANT UPDATE (preco_promocional) ON public.produtos TO authenticated;

CREATE POLICY "Admins can update promotional prices"
ON public.produtos
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.prevent_protected_product_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id
    OR NEW."PRODUTO" IS DISTINCT FROM OLD."PRODUTO"
    OR NEW.quantidade_estoque IS DISTINCT FROM OLD.quantidade_estoque
    OR NEW.estoque_atualizado_em IS DISTINCT FROM OLD.estoque_atualizado_em THEN
    RAISE EXCEPTION 'Only promotional price may be changed through the authenticated API';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_product_fields_from_admin_updates
BEFORE UPDATE ON public.produtos
FOR EACH ROW
WHEN (current_user <> 'service_role')
EXECUTE FUNCTION public.prevent_protected_product_changes();