import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const credentials = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres").max(72),
});

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Acesso administrativo — Marcenaria Raiz" },
      { name: "description", content: "Área restrita para gestão do catálogo e dos orçamentos do site." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Acesso administrativo — Marcenaria Raiz" },
      { property: "og:description", content: "Área restrita da marcenaria." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const handle = async (mode: "in" | "up") => {
    const parsed = credentials.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          ...parsed.data,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
      }
      await supabase.rpc("claim_first_admin");
      toast.success("Bem-vindo!");
      navigate({ to: "/admin", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível entrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-5 sm:p-8">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center text-xs uppercase tracking-[0.25em] text-muted-foreground sm:min-h-0"
        >
          ← voltar ao site
        </Link>
        <h1 className="mt-4 font-display text-2xl sm:text-3xl">Área administrativa</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie produtos, categorias, depoimentos e orçamentos.
        </p>

        <Tabs defaultValue="in" className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="in">Entrar</TabsTrigger>
            <TabsTrigger value="up">Criar acesso</TabsTrigger>
          </TabsList>

          {(["in", "up"] as const).map((mode) => (
            <TabsContent key={mode} value={mode} className="mt-6">
              <form
                className="grid gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void handle(mode);
                }}
              >
                <div className="grid gap-2">
                  <Label htmlFor={`email-${mode}`}>E-mail</Label>
                  <Input
                    id={`email-${mode}`}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`pass-${mode}`}>Senha</Label>
                  <Input
                    id={`pass-${mode}`}
                    type="password"
                    autoComplete={mode === "in" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ember text-ember-foreground hover:bg-ember/90"
                >
                  {loading ? "Aguarde..." : mode === "in" ? "Entrar" : "Criar acesso"}
                </Button>
              </form>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
