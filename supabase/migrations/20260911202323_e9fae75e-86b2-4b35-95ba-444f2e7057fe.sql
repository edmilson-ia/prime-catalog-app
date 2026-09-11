DROP POLICY "Admins can update promotional prices" ON public.produtos;

CREATE POLICY "Admins can update promotional prices"
ON public.produtos
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
  )
);

DROP FUNCTION public.has_role(uuid, public.app_role);