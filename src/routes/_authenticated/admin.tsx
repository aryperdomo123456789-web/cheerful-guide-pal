import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Globe, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminSiteProvider } from "@/components/admin/admin-site-context";
import { AccountPanel } from "@/components/admin/account-panel";
import { AmbientesPanel } from "@/components/admin/ambientes-panel";
import { CategoriesPanel } from "@/components/admin/categories-panel";
import { LeadsPanel } from "@/components/admin/leads-panel";
import { ProductsPanel } from "@/components/admin/products-panel";
import { SettingsPanel } from "@/components/admin/settings-panel";
import { TestimonialsPanel } from "@/components/admin/testimonials-panel";
import { useAdminSession } from "@/hooks/use-admin-session";
import { sitesQuery } from "@/lib/site-data";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel do site — Marcenaria Raiz" },
      { name: "description", content: "Gestão de produtos, categorias, depoimentos e orçamentos." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel do site — Marcenaria Raiz" },
      { property: "og:description", content: "Área restrita de gestão do site." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { access, signOut } = useAdminSession();
  const { data: sites } = useQuery(sitesQuery);
  const [activeSiteId, setActiveSiteId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeSiteId && sites?.length) {
      setActiveSiteId((sites.find((site) => site.is_primary) ?? sites[0]).id);
    }
  }, [sites, activeSiteId]);

  const activeSite = useMemo(
    () => sites?.find((site) => site.id === activeSiteId) ?? null,
    [sites, activeSiteId],
  );

  if (access === "loading") {
    return <div className="p-10 text-muted-foreground">Carregando painel...</div>;
  }

  if (access === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-display text-3xl">Sem permissão</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Sua conta não tem acesso de administrador. Peça para um administrador liberar seu acesso.
          </p>
          <Button className="mt-6" variant="outline" onClick={() => void signOut()}>
            Sair
          </Button>
        </div>
      </div>
    );
  }

  const panelKey = activeSiteId ?? "none";

  return (
    <AdminSiteProvider siteId={activeSiteId}>
      <div className="min-h-screen bg-sand">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
            <div className="mr-auto min-w-0">
              <p className="truncate font-display text-lg sm:text-xl">Painel dos sites</p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Gerencie todas as marcas em um só lugar
              </p>
            </div>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Globe className="size-4 shrink-0 text-muted-foreground" />
              <Select value={activeSiteId ?? ""} onValueChange={setActiveSiteId}>
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue placeholder="Selecione o site" />
                </SelectTrigger>
                <SelectContent>
                  {(sites ?? []).map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                      {site.is_primary ? " (principal)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {activeSite ? (
              <Button asChild variant="outline" size="sm">
                {activeSite.is_primary ? (
                  <Link to="/">
                    <ExternalLink className="mr-2 size-4" /> Ver site
                  </Link>
                ) : (
                  <Link to="/s/$site" params={{ site: activeSite.slug }}>
                    <ExternalLink className="mr-2 size-4" /> Ver site
                  </Link>
                )}
              </Button>
            ) : null}

            <Button variant="ghost" size="sm" onClick={() => void signOut()}>
              <LogOut className="mr-2 size-4" /> Sair
            </Button>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <Tabs defaultValue="produtos">
            <TabsList className="-mx-4 flex h-auto w-[calc(100%+2rem)] flex-nowrap justify-start gap-1 overflow-x-auto rounded-none px-4 sm:mx-0 sm:w-full sm:flex-wrap sm:rounded-lg sm:px-1">
              <TabsTrigger className="shrink-0" value="produtos">Produtos</TabsTrigger>
              <TabsTrigger className="shrink-0" value="categorias">Categorias</TabsTrigger>
              <TabsTrigger className="shrink-0" value="ambientes">Ambientes</TabsTrigger>
              <TabsTrigger className="shrink-0" value="depoimentos">Depoimentos</TabsTrigger>
              <TabsTrigger className="shrink-0" value="orcamentos">Orçamentos</TabsTrigger>
              <TabsTrigger className="shrink-0" value="cupons">Cupom / Pop-up</TabsTrigger>
              <TabsTrigger className="shrink-0" value="config">Configurações</TabsTrigger>
              <TabsTrigger className="shrink-0" value="conta">Minha conta</TabsTrigger>
            </TabsList>

            <TabsContent value="produtos" className="mt-6">
              <ProductsPanel key={panelKey} />
            </TabsContent>
            <TabsContent value="categorias" className="mt-6">
              <CategoriesPanel key={panelKey} />
            </TabsContent>
            <TabsContent value="ambientes" className="mt-6">
              <AmbientesPanel key={panelKey} />
            </TabsContent>
            <TabsContent value="depoimentos" className="mt-6">
              <TestimonialsPanel key={panelKey} />
            </TabsContent>
            <TabsContent value="orcamentos" className="mt-6">
              <LeadsPanel key={panelKey} />
            </TabsContent>
            <TabsContent value="cupons" className="mt-6">
              <LeadsPanel key={`popup-${panelKey}`} source="popup" />
            </TabsContent>
            <TabsContent value="config" className="mt-6">
              <SettingsPanel key={panelKey} />
            </TabsContent>
            <TabsContent value="conta" className="mt-6">
              <AccountPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminSiteProvider>
  );
}
