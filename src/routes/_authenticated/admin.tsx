import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Globe, LogOut, Plus, Trash2, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { uploadProductImage } from "@/lib/upload";
import {
  ambientesQuery,
  categoriesQuery,
  formatPrice,
  productsQuery,
  settingsQuery,
  sitesQuery,
  slugify,
  testimonialsQuery,
  type Ambiente,
  type Category,
  type Lead,
  type Product,
  type SiteSettings,
  type Testimonial,
} from "@/lib/site-data";

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

const AdminSiteContext = createContext<string | null>(null);
const useAdminSite = () => useContext(AdminSiteContext);

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { data: sites } = useQuery(sitesQuery);
  const [activeSite, setActiveSite] = useState<string | null>(null);

  useEffect(() => {
    if (!activeSite && sites?.length) {
      setActiveSite((sites.find((s) => s.is_primary) ?? sites[0]).id);
    }
  }, [sites, activeSite]);


  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      await supabase.rpc("claim_first_admin");
      const { data } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      setIsAdmin(Boolean(data));
    })();
  }, []);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (isAdmin === null) {
    return <div className="p-10 text-muted-foreground">Carregando painel...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-display text-3xl">Sem permissão</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Sua conta não tem acesso de administrador. Peça para um administrador liberar seu acesso.
          </p>
          <Button className="mt-6" variant="outline" onClick={signOut}>
            Sair
          </Button>
        </div>
      </div>
    );
  }

  const current = sites?.find((s) => s.id === activeSite) ?? null;

  return (
    <AdminSiteContext.Provider value={activeSite}>
      <div className="min-h-screen bg-sand">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4">
            <div className="mr-auto">
              <p className="font-display text-xl">Painel dos sites</p>
              <p className="text-xs text-muted-foreground">
                Gerencie todas as marcas em um só lugar
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="size-4 text-muted-foreground" />
              <Select value={activeSite ?? ""} onValueChange={(v) => setActiveSite(v)}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Selecione o site" />
                </SelectTrigger>
                <SelectContent>
                  {(sites ?? []).map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                      {s.is_primary ? " (principal)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {current?.is_primary ? (
              <Button asChild variant="outline" size="sm">
                <Link to="/">
                  <ExternalLink className="mr-2 size-4" /> Ver site
                </Link>
              </Button>
            ) : current ? (
              <Button asChild variant="outline" size="sm">
                <Link to="/s/$site" params={{ site: current.slug }}>
                  <ExternalLink className="mr-2 size-4" /> Ver site
                </Link>
              </Button>
            ) : null}

            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-2 size-4" /> Sair
            </Button>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <Tabs defaultValue="produtos">
            <TabsList className="flex h-auto flex-wrap justify-start">
              <TabsTrigger value="produtos">Produtos</TabsTrigger>
              <TabsTrigger value="categorias">Categorias</TabsTrigger>
              <TabsTrigger value="ambientes">Ambientes</TabsTrigger>
              <TabsTrigger value="depoimentos">Depoimentos</TabsTrigger>
              <TabsTrigger value="orcamentos">Orçamentos</TabsTrigger>
              <TabsTrigger value="config">Configurações</TabsTrigger>
              <TabsTrigger value="conta">Minha conta</TabsTrigger>
            </TabsList>

            <TabsContent value="produtos" className="mt-6">
              <ProductsAdmin key={activeSite ?? "none"} />
            </TabsContent>
            <TabsContent value="categorias" className="mt-6">
              <CategoriesAdmin key={activeSite ?? "none"} />
            </TabsContent>
            <TabsContent value="ambientes" className="mt-6">
              <AmbientesAdmin key={activeSite ?? "none"} />
            </TabsContent>
            <TabsContent value="depoimentos" className="mt-6">
              <TestimonialsAdmin key={activeSite ?? "none"} />
            </TabsContent>
            <TabsContent value="orcamentos" className="mt-6">
              <LeadsAdmin key={activeSite ?? "none"} />
            </TabsContent>
            <TabsContent value="config" className="mt-6">
              <SettingsAdmin key={activeSite ?? "none"} />
            </TabsContent>
            <TabsContent value="conta" className="mt-6">
              <AccountAdmin />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminSiteContext.Provider>
  );
}

function Panel({ children, title, action }: { children: React.ReactNode; title: string; action?: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ---------------- PRODUTOS ---------------- */

const emptyProduct = {
  name: "",
  slug: "",
  short_description: "",
  description: "",
  wood_type: "Madeira maciça",
  dimensions: "",
  price: "",
  sale_price: "",
  images: [] as string[],
  category_id: "",
  ambiente_id: "",
  is_featured: false,
  is_active: true,
  sort_order: 0,
};

function ProductsAdmin() {
  const qc = useQueryClient();
  const siteId = useAdminSite();
  const { data: products } = useQuery(productsQuery(siteId));
  const { data: categories } = useQuery(categoriesQuery(siteId));
  const { data: ambientes } = useQuery(ambientesQuery(siteId));
  const [form, setForm] = useState({ ...emptyProduct });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const reset = () => {
    setForm({ ...emptyProduct });
    setEditingId(null);
  };

  const edit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      slug: p.slug,
      short_description: p.short_description,
      description: p.description,
      wood_type: p.wood_type,
      dimensions: p.dimensions,
      price: p.price != null ? String(p.price) : "",
      sale_price: p.sale_price != null ? String(p.sale_price) : "",
      images: p.images ?? [],
      category_id: p.category_id ?? "",
      ambiente_id: p.ambiente_id ?? "",
      is_featured: p.is_featured,
      is_active: p.is_active,
      sort_order: p.sort_order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    if (!siteId) return;
    if (!form.name.trim()) {
      toast.error("Informe o nome do produto");
      return;
    }
    const payload = {
      name: form.name.trim(),
      slug: (form.slug.trim() || slugify(form.name)).slice(0, 120),
      short_description: form.short_description.trim(),
      description: form.description.trim(),
      wood_type: form.wood_type.trim(),
      dimensions: form.dimensions.trim(),
      price: form.price ? Number(form.price) : null,
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      images: form.images,
      category_id: form.category_id || null,
      ambiente_id: form.ambiente_id || null,
      is_featured: form.is_featured,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
      site_id: siteId,
    };

    const { error } = editingId
      ? await supabase.from("products").update(payload).eq("id", editingId)
      : await supabase.from("products").insert(payload);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Produto atualizado" : "Produto criado");
    reset();
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Produto removido");
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadProductImage(file));
      }
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
      toast.success("Imagem enviada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha no envio");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Panel
        title={editingId ? "Editar produto" : "Novo produto"}
        action={
          editingId ? (
            <Button variant="ghost" size="sm" onClick={reset}>
              Cancelar edição
            </Button>
          ) : null
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Endereço (slug)" hint="deixe vazio para gerar automaticamente">
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </Field>
          <Field label="Tipo de madeira">
            <Input value={form.wood_type} onChange={(e) => setForm({ ...form, wood_type: e.target.value })} />
          </Field>
          <Field label="Medidas">
            <Input
              value={form.dimensions}
              onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              placeholder="200 x 90 x 78 cm"
            />
          </Field>
          <Field label="Preço (R$)">
            <Input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </Field>
          <Field label="Preço promocional (R$)">
            <Input
              type="number"
              value={form.sale_price}
              onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
            />
          </Field>
          <Field label="Categoria">
            <Select
              value={form.category_id || "none"}
              onValueChange={(v) => setForm({ ...form, category_id: v === "none" ? "" : v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem categoria</SelectItem>
                {(categories ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Ambiente">
            <Select
              value={form.ambiente_id || "none"}
              onValueChange={(v) => setForm({ ...form, ambiente_id: v === "none" ? "" : v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem ambiente</SelectItem>
                {(ambientes ?? []).map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="mt-4 grid gap-4">
          <Field label="Descrição curta">
            <Input
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            />
          </Field>
          <Field label="Descrição completa">
            <Textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Label>Fotos</Label>
          <div className="mt-2 flex flex-wrap gap-3">
            {form.images.map((img, i) => (
              <div key={img + i} className="relative size-24 overflow-hidden rounded-md border border-border">
                <img src={img} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, x) => x !== i) }))}
                  className="absolute right-1 top-1 rounded bg-destructive p-1 text-destructive-foreground"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
            <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-xs text-muted-foreground hover:bg-muted">
              <Upload className="size-4" />
              {uploading ? "enviando..." : "enviar"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onUpload(e.target.files)}
              />
            </label>
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              placeholder="ou cole a URL de uma imagem e tecle Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const value = e.currentTarget.value.trim();
                  if (value) {
                    setForm((f) => ({ ...f, images: [...f.images, value] }));
                    e.currentTarget.value = "";
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-6">
          <ToggleField
            label="Destaque na home"
            checked={form.is_featured}
            onChange={(v) => setForm({ ...form, is_featured: v })}
          />
          <ToggleField
            label="Visível no site"
            checked={form.is_active}
            onChange={(v) => setForm({ ...form, is_active: v })}
          />
          <div className="flex items-center gap-2">
            <Label className="text-sm">Ordem</Label>
            <Input
              type="number"
              className="w-20"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            />
          </div>
          <Button onClick={save} className="ml-auto bg-ember text-ember-foreground hover:bg-ember/90">
            {editingId ? "Salvar alterações" : "Criar produto"}
          </Button>
        </div>
      </Panel>

      <Panel title={`Produtos cadastrados (${products?.length ?? 0})`}>
        <div className="grid gap-3">
          {(products ?? []).map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-4 rounded-md border border-border p-3"
            >
              <img
                src={p.images?.[0] ?? "/produtos/oficina.jpg"}
                alt=""
                className="size-14 rounded object-cover"
              />
              <div className="min-w-40 flex-1">
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(p.sale_price ?? p.price)} · {p.dimensions || "sob medida"}
                </p>
              </div>
              {p.is_featured ? <Badge className="bg-ember text-ember-foreground">destaque</Badge> : null}
              {!p.is_active ? <Badge variant="secondary">oculto</Badge> : null}
              <Button variant="outline" size="sm" onClick={() => edit(p)}>
                Editar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => remove(p.id)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ---------------- CATEGORIAS ---------------- */

function CategoriesAdmin() {
  const qc = useQueryClient();
  const siteId = useAdminSite();
  const { data: categories } = useQuery(categoriesQuery(siteId));
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const add = async () => {
    if (!siteId) return;
    if (!name.trim()) return toast.error("Informe o nome");
    const { error } = await supabase.from("categories").insert({
      name: name.trim(),
      slug: slugify(name),
      description: description.trim(),
      site_id: siteId,
      sort_order: (categories?.length ?? 0) + 1,
    });
    if (error) return toast.error(error.message);
    setName("");
    setDescription("");
    toast.success("Categoria criada");
    qc.invalidateQueries({ queryKey: ["categories"] });
  };

  const update = async (id: string, patch: Partial<Category>) => {
    const { error } = await supabase.from("categories").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["categories"] });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Categoria removida");
    qc.invalidateQueries({ queryKey: ["categories"] });
  };

  return (
    <Panel title="Categorias">
      <div className="grid gap-3 sm:grid-cols-[1fr_2fr_auto]">
        <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button onClick={add} className="bg-ember text-ember-foreground hover:bg-ember/90">
          <Plus className="mr-2 size-4" /> Adicionar
        </Button>
      </div>

      <div className="mt-6 grid gap-3">
        {(categories ?? []).map((c) => (
          <div key={c.id} className="flex flex-wrap items-center gap-3 rounded-md border border-border p-3">
            <Input
              className="w-44"
              defaultValue={c.name}
              onBlur={(e) => e.target.value !== c.name && update(c.id, { name: e.target.value })}
            />
            <Input
              className="min-w-48 flex-1"
              defaultValue={c.description}
              onBlur={(e) => e.target.value !== c.description && update(c.id, { description: e.target.value })}
            />
            <ToggleField
              label="Ativa"
              checked={c.is_active}
              onChange={(v) => update(c.id, { is_active: v })}
            />
            <Button variant="ghost" size="sm" onClick={() => remove(c.id)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ---------------- AMBIENTES ---------------- */

function AmbientesAdmin() {
  const qc = useQueryClient();
  const siteId = useAdminSite();
  const { data: ambientes } = useQuery(ambientesQuery(siteId));
  const [name, setName] = useState("");

  const add = async () => {
    if (!siteId) return;
    if (!name.trim()) return toast.error("Informe o nome");
    const { error } = await supabase.from("ambientes").insert({
      name: name.trim(),
      slug: slugify(name),
      site_id: siteId,
      sort_order: (ambientes?.length ?? 0) + 1,
    });
    if (error) return toast.error(error.message);
    setName("");
    toast.success("Ambiente criado");
    qc.invalidateQueries({ queryKey: ["ambientes"] });
  };

  const update = async (id: string, patch: Partial<Ambiente>) => {
    const { error } = await supabase.from("ambientes").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["ambientes"] });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("ambientes").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["ambientes"] });
  };

  return (
    <Panel title="Ambientes">
      <div className="flex gap-3">
        <Input placeholder="Ex.: Varanda" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={add} className="bg-ember text-ember-foreground hover:bg-ember/90">
          <Plus className="mr-2 size-4" /> Adicionar
        </Button>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {(ambientes ?? []).map((a) => (
          <div key={a.id} className="flex items-center gap-3 rounded-md border border-border p-3">
            <Input
              defaultValue={a.name}
              onBlur={(e) => e.target.value !== a.name && update(a.id, { name: e.target.value })}
            />
            <ToggleField label="Ativo" checked={a.is_active} onChange={(v) => update(a.id, { is_active: v })} />
            <Button variant="ghost" size="sm" onClick={() => remove(a.id)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ---------------- DEPOIMENTOS ---------------- */

function TestimonialsAdmin() {
  const qc = useQueryClient();
  const siteId = useAdminSite();
  const { data: testimonials } = useQuery(testimonialsQuery(siteId));
  const [form, setForm] = useState({ author: "", city: "", content: "", rating: 5 });

  const add = async () => {
    if (!siteId) return;
    if (!form.author.trim() || !form.content.trim()) return toast.error("Preencha nome e depoimento");
    const { error } = await supabase.from("testimonials").insert({
      ...form,
      site_id: siteId,
      sort_order: (testimonials?.length ?? 0) + 1,
    });
    if (error) return toast.error(error.message);
    setForm({ author: "", city: "", content: "", rating: 5 });
    toast.success("Depoimento adicionado");
    qc.invalidateQueries({ queryKey: ["testimonials"] });
  };

  const update = async (id: string, patch: Partial<Testimonial>) => {
    const { error } = await supabase.from("testimonials").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["testimonials"] });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["testimonials"] });
  };

  return (
    <div className="space-y-6">
      <Panel title="Novo depoimento">
        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            placeholder="Nome do cliente"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
          <Input
            placeholder="Cidade - UF"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <Select value={String(form.rating)} onValueChange={(v) => setForm({ ...form, rating: Number(v) })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 4, 3, 2, 1].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} estrela(s)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Textarea
          className="mt-3"
          rows={3}
          placeholder="Depoimento"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <Button onClick={add} className="mt-3 bg-ember text-ember-foreground hover:bg-ember/90">
          <Plus className="mr-2 size-4" /> Adicionar
        </Button>
      </Panel>

      <Panel title="Depoimentos publicados">
        <div className="grid gap-3">
          {(testimonials ?? []).map((t) => (
            <div key={t.id} className="rounded-md border border-border p-3">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-medium">
                  {t.author} <span className="text-xs text-muted-foreground">{t.city}</span>
                </p>
                <Badge variant="secondary">{t.rating}★</Badge>
                <ToggleField
                  label="Visível"
                  checked={t.is_active}
                  onChange={(v) => update(t.id, { is_active: v })}
                />
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => remove(t.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.content}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ---------------- ORÇAMENTOS ---------------- */

function LeadsAdmin() {
  const qc = useQueryClient();
  const siteId = useAdminSite();
  const { data: leads } = useQuery({
    queryKey: ["leads", siteId ?? null],
    enabled: Boolean(siteId),
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("site_id", siteId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });


  const update = async (id: string, status: string) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["leads"] });
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["leads"] });
  };

  return (
    <Panel title={`Orçamentos recebidos (${leads?.length ?? 0})`}>
      {!leads?.length ? (
        <p className="text-sm text-muted-foreground">Nenhum pedido recebido ainda.</p>
      ) : (
        <div className="grid gap-3">
          {leads.map((l) => (
            <div key={l.id} className="rounded-md border border-border p-4">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-medium">{l.name}</p>
                <span className="text-sm text-muted-foreground">{l.phone}</span>
                {l.email ? <span className="text-sm text-muted-foreground">{l.email}</span> : null}
                {l.city ? <Badge variant="secondary">{l.city}</Badge> : null}
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(l.created_at).toLocaleString("pt-BR")}
                </span>
              </div>
              {l.product_name ? (
                <p className="mt-2 text-sm">
                  <strong>Peça:</strong> {l.product_name}
                </p>
              ) : null}
              {l.message ? <p className="mt-1 text-sm text-muted-foreground">{l.message}</p> : null}
              <div className="mt-3 flex items-center gap-3">
                <Select value={l.status} onValueChange={(v) => update(l.id, v)}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="novo">Novo</SelectItem>
                    <SelectItem value="em-contato">Em contato</SelectItem>
                    <SelectItem value="orcado">Orçado</SelectItem>
                    <SelectItem value="fechado">Fechado</SelectItem>
                    <SelectItem value="perdido">Perdido</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" onClick={() => remove(l.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ---------------- CONFIGURAÇÕES ---------------- */

function SettingsAdmin() {
  const qc = useQueryClient();
  const siteId = useAdminSite();
  const { data: settings } = useQuery(settingsQuery(siteId));
  const [form, setForm] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  if (!form) return <Panel title="Configurações do site">Carregando...</Panel>;

  const save = async () => {
    const { id, ...patch } = form;
    const { error } = await supabase.from("site_settings").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Configurações salvas");
    qc.invalidateQueries({ queryKey: ["site_settings"] });
  };

  const set = (key: keyof SiteSettings, value: string | number | boolean) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  return (
    <Panel
      title="Configurações do site"
      action={
        <Button onClick={save} className="bg-ember text-ember-foreground hover:bg-ember/90">
          Salvar
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome da marca">
          <Input value={form.brand_name} onChange={(e) => set("brand_name", e.target.value)} />
        </Field>
        <Field label="Slogan">
          <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <Field label="Telefone">
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="WhatsApp (com DDI/DDD)" hint="ex.: 5511999999999">
          <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
        </Field>
        <Field label="E-mail">
          <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Endereço">
          <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <Field label="Horário de atendimento">
          <Input value={form.opening_hours} onChange={(e) => set("opening_hours", e.target.value)} />
        </Field>
        <Field label="Instagram (URL)">
          <Input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} />
        </Field>
        <Field label="Facebook (URL)">
          <Input value={form.facebook} onChange={(e) => set("facebook", e.target.value)} />
        </Field>
        <Field label="Anos de oficina">
          <Input
            type="number"
            value={form.years_experience}
            onChange={(e) => set("years_experience", Number(e.target.value))}
          />
        </Field>
        <Field label="Peças entregues">
          <Input
            type="number"
            value={form.projects_done}
            onChange={(e) => set("projects_done", Number(e.target.value))}
          />
        </Field>
        <Field label="Botão principal do banner">
          <Input value={form.hero_cta} onChange={(e) => set("hero_cta", e.target.value)} />
        </Field>
      </div>

      <div className="mt-4 grid gap-4">
        <Field label="Título do banner">
          <Input value={form.hero_title} onChange={(e) => set("hero_title", e.target.value)} />
        </Field>
        <Field label="Subtítulo do banner">
          <Textarea rows={2} value={form.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} />
        </Field>
        <Field label="Texto 'A Marcenaria'">
          <Textarea rows={5} value={form.about_text} onChange={(e) => set("about_text", e.target.value)} />
        </Field>
      </div>

      <div className="mt-5">
        <ToggleField
          label="Mostrar preços no site"
          checked={form.show_prices}
          onChange={(v) => set("show_prices", v)}
        />
      </div>
    </Panel>
  );
}

/* ---------------- HELPERS ---------------- */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-sm">
        {label}
        {hint ? <span className="ml-2 text-xs font-normal text-muted-foreground">{hint}</span> : null}
      </Label>
      {children}
    </div>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <Switch checked={checked} onCheckedChange={onChange} />
      {label}
    </label>
  );
}

function AccountAdmin() {
  const [email, setEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentEmail(data.user?.email ?? "");
      setEmail(data.user?.email ?? "");
    });
  }, []);

  const changeEmail = async () => {
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("E-mail inválido");
      return;
    }
    setSavingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: value });
    setSavingEmail(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("E-mail atualizado. Confirme pelo link enviado, se solicitado.");
  };

  const changePassword = async () => {
    if (password.length < 6) {
      toast.error("A senha precisa ter ao menos 6 caracteres");
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não conferem");
      return;
    }
    setSavingPass(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPass(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setPassword("");
    setConfirm("");
    toast.success("Senha alterada com sucesso");
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Panel title="E-mail de acesso">
        <div className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Conta atual: <span className="font-medium text-foreground">{currentEmail || "—"}</span>
          </p>
          <div className="grid gap-2">
            <Label htmlFor="acc-email">Novo e-mail</Label>
            <Input
              id="acc-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button onClick={() => void changeEmail()} disabled={savingEmail}>
            {savingEmail ? "Salvando..." : "Atualizar e-mail"}
          </Button>
        </div>
      </Panel>

      <Panel title="Senha de acesso">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="acc-pass">Nova senha</Label>
            <Input
              id="acc-pass"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="acc-pass2">Confirmar nova senha</Label>
            <Input
              id="acc-pass2"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <Button onClick={() => void changePassword()} disabled={savingPass}>
            {savingPass ? "Salvando..." : "Alterar senha"}
          </Button>
        </div>
      </Panel>
    </div>
  );
}
