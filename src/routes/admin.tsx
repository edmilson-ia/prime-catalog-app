import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogIn, LogOut, Save, Search, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products, formatBRL } from "@/data/catalog";
import { supabase } from "@/integrations/supabase/client";
import { normalizeProductName, useProductStock } from "@/lib/stock";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração — Prime Alimentos" },
      { name: "description", content: "Acesso restrito para administrar preços promocionais da Prime Alimentos." },
      { property: "og:title", content: "Administração — Prime Alimentos" },
      { property: "og:description", content: "Área restrita de preços promocionais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const checkAccess = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setAuthorized(false);
      setChecking(false);
      return;
    }
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();
    setAuthorized(Boolean(role));
    setChecking(false);
  };

  useEffect(() => {
    void checkAccess();
  }, []);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError("E-mail ou senha inválidos.");
      return;
    }
    setChecking(true);
    await checkAccess();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthorized(false);
    setPassword("");
    await navigate({ to: "/admin", replace: true });
  };

  if (checking) {
    return <div className="grid min-h-[70vh] place-items-center text-sm text-muted-foreground">Verificando acesso…</div>;
  }

  if (!authorized) {
    return (
      <div className="flex min-h-[75vh] items-center px-5">
        <form onSubmit={signIn} className="w-full space-y-4 rounded-2xl bg-card p-5 shadow-[var(--shadow-card)]">
          <div>
            <p className="text-xs font-bold text-gold-hover">ACESSO RESTRITO</p>
            <h1 className="mt-1 text-xl font-bold text-ink">Painel administrativo</h1>
          </div>
          <label className="block space-y-1.5 text-xs font-semibold text-ink">
            E-mail
            <Input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="block space-y-1.5 text-xs font-semibold text-ink">
            Senha
            <Input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error ? <p className="text-xs font-semibold text-destructive">{error}</p> : null}
          <Button type="submit" className="w-full"><LogIn /> Entrar</Button>
        </form>
      </div>
    );
  }

  return <PromotionManager query={query} setQuery={setQuery} signOut={signOut} />;
}

function PromotionManager({ query, setQuery, signOut }: { query: string; setQuery: (value: string) => void; signOut: () => Promise<void> }) {
  const { data: productData = {}, refetch } = useProductStock();
  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? products.filter((product) => product.name.toLowerCase().includes(term)) : products;
  }, [query]);

  return (
    <div className="pb-6">
      <header className="sticky top-0 z-10 border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div><p className="text-[10px] font-bold text-gold-hover">ADMINISTRAÇÃO</p><h1 className="text-lg font-bold text-ink">Preços promocionais</h1></div>
          <Button type="button" variant="outline" size="icon" onClick={() => void signOut()} aria-label="Sair"><LogOut /></Button>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-md border border-input bg-background px-3">
          <Search className="size-4 text-muted-foreground" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar produto" className="h-9 w-full bg-transparent text-sm outline-none" />
        </div>
      </header>
      <div className="space-y-2.5 p-4">
        {visibleProducts.map((product) => (
          <PromotionRow key={product.id} product={product} value={productData[normalizeProductName(product.name)]?.promotionalPrice ?? null} onSaved={refetch} />
        ))}
      </div>
    </div>
  );
}

function PromotionRow({ product, value, onSaved }: { product: (typeof products)[number]; value: number | null; onSaved: () => Promise<unknown> }) {
  const [input, setInput] = useState(value?.toFixed(2).replace(".", ",") ?? "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => setInput(value?.toFixed(2).replace(".", ",") ?? ""), [value]);

  const save = async (nextValue: number | null) => {
    setSaving(true);
    setStatus("");
    const { error } = await supabase.from("produtos").update({ preco_promocional: nextValue }).eq("PRODUTO", product.name);
    setSaving(false);
    if (error) {
      setStatus("Não foi possível salvar.");
      return;
    }
    setStatus(nextValue === null ? "Promoção removida." : "Preço salvo.");
    await onSaved();
  };

  const parsed = Number(input.replace(",", "."));

  return (
    <article className="rounded-xl bg-card p-3 shadow-[var(--shadow-card)]">
      <p className="text-xs font-bold text-ink">{product.name}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">Preço normal: {formatBRL(product.price)}</p>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex h-9 min-w-0 flex-1 items-center rounded-md border border-input px-2.5"><span className="mr-1 text-xs text-muted-foreground">R$</span><input inputMode="decimal" value={input} onChange={(event) => setInput(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></div>
        <Button type="button" size="icon" disabled={saving || !Number.isFinite(parsed) || parsed <= 0} onClick={() => void save(parsed)} aria-label={`Salvar promoção de ${product.name}`}><Save /></Button>
        <Button type="button" size="icon" variant="outline" disabled={saving || value === null} onClick={() => void save(null)} aria-label={`Remover promoção de ${product.name}`}><Trash2 /></Button>
      </div>
      {status ? <p className="mt-1.5 text-[10px] font-semibold text-muted-foreground">{status}</p> : null}
    </article>
  );
}