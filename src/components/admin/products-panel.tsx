import { useQuery } from "@tanstack/react-query";
import { Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, Panel, ToggleField } from "@/components/admin/admin-ui";
import { useAdminSiteId } from "@/components/admin/admin-site-context";
import { useAdminTable } from "@/hooks/use-admin-table";
import { useImageUpload } from "@/hooks/use-image-upload";
import {
  ambientesQuery,
  categoriesQuery,
  formatPrice,
  productsQuery,
  slugify,
} from "@/lib/site-data";
import type { Product } from "@/lib/site-types";

type ProductForm = {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  wood_type: string;
  dimensions: string;
  price: string;
  sale_price: string;
  images: string[];
  category_id: string;
  ambiente_id: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
};

const EMPTY_PRODUCT: ProductForm = {
  name: "",
  slug: "",
  short_description: "",
  description: "",
  wood_type: "Madeira maciça",
  dimensions: "",
  price: "",
  sale_price: "",
  images: [],
  category_id: "",
  ambiente_id: "",
  is_featured: false,
  is_active: true,
  sort_order: 0,
};

const toForm = (product: Product): ProductForm => ({
  name: product.name,
  slug: product.slug,
  short_description: product.short_description,
  description: product.description,
  wood_type: product.wood_type,
  dimensions: product.dimensions,
  price: product.price != null ? String(product.price) : "",
  sale_price: product.sale_price != null ? String(product.sale_price) : "",
  images: product.images ?? [],
  category_id: product.category_id ?? "",
  ambiente_id: product.ambiente_id ?? "",
  is_featured: product.is_featured,
  is_active: product.is_active,
  sort_order: product.sort_order,
});

const toPayload = (form: ProductForm, siteId: string) => ({
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
});

export function ProductsPanel() {
  const siteId = useAdminSiteId();
  const { data: products } = useQuery(productsQuery(siteId));
  const { data: categories } = useQuery(categoriesQuery(siteId));
  const { data: ambientes } = useQuery(ambientesQuery(siteId));
  const table = useAdminTable("products");
  const { uploadMany, isUploading } = useImageUpload();

  const [form, setForm] = useState<ProductForm>({ ...EMPTY_PRODUCT });
  const [editingId, setEditingId] = useState<string | null>(null);

  const patch = (values: Partial<ProductForm>) => setForm((current) => ({ ...current, ...values }));

  const reset = () => {
    setForm({ ...EMPTY_PRODUCT });
    setEditingId(null);
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setForm(toForm(product));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    if (!siteId) return;
    if (!form.name.trim()) {
      toast.error("Informe o nome do produto");
      return;
    }
    const payload = toPayload(form, siteId);
    const ok = editingId
      ? await table.update(editingId, payload, "Produto atualizado")
      : await table.insert(payload, "Produto criado");
    if (ok) reset();
  };

  const addImages = async (files: FileList | null) => {
    const urls = await uploadMany(files);
    if (urls.length) patch({ images: [...form.images, ...urls] });
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
            <Input value={form.name} onChange={(e) => patch({ name: e.target.value })} />
          </Field>
          <Field label="Endereço (slug)" hint="deixe vazio para gerar automaticamente">
            <Input value={form.slug} onChange={(e) => patch({ slug: e.target.value })} />
          </Field>
          <Field label="Tipo de madeira">
            <Input value={form.wood_type} onChange={(e) => patch({ wood_type: e.target.value })} />
          </Field>
          <Field label="Medidas">
            <Input
              value={form.dimensions}
              onChange={(e) => patch({ dimensions: e.target.value })}
              placeholder="200 x 90 x 78 cm"
            />
          </Field>
          <Field label="Preço (R$)">
            <Input
              type="number"
              value={form.price}
              onChange={(e) => patch({ price: e.target.value })}
            />
          </Field>
          <Field label="Preço promocional (R$)">
            <Input
              type="number"
              value={form.sale_price}
              onChange={(e) => patch({ sale_price: e.target.value })}
            />
          </Field>
          <Field label="Categoria">
            <Select
              value={form.category_id || "none"}
              onValueChange={(v) => patch({ category_id: v === "none" ? "" : v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem categoria</SelectItem>
                {(categories ?? []).map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Ambiente">
            <Select
              value={form.ambiente_id || "none"}
              onValueChange={(v) => patch({ ambiente_id: v === "none" ? "" : v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem ambiente</SelectItem>
                {(ambientes ?? []).map((ambiente) => (
                  <SelectItem key={ambiente.id} value={ambiente.id}>
                    {ambiente.name}
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
              onChange={(e) => patch({ short_description: e.target.value })}
            />
          </Field>
          <Field label="Descrição completa">
            <Textarea
              rows={4}
              value={form.description}
              onChange={(e) => patch({ description: e.target.value })}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Label>Fotos</Label>
          <div className="mt-2 flex flex-wrap gap-3">
            {form.images.map((image, index) => (
              <div
                key={image + index}
                className="relative size-24 overflow-hidden rounded-md border border-border"
              >
                <img src={image} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  aria-label="Remover foto"
                  onClick={() =>
                    patch({ images: form.images.filter((_, position) => position !== index) })
                  }
                  className="absolute right-1 top-1 rounded bg-destructive p-1 text-destructive-foreground"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
            <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-xs text-muted-foreground hover:bg-muted">
              <Upload className="size-4" />
              {isUploading ? "enviando..." : "enviar"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => void addImages(e.target.files)}
              />
            </label>
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              placeholder="ou cole a URL de uma imagem e tecle Enter"
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                const value = e.currentTarget.value.trim();
                if (!value) return;
                patch({ images: [...form.images, value] });
                e.currentTarget.value = "";
              }}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-6">
          <ToggleField
            label="Destaque na home"
            checked={form.is_featured}
            onChange={(v) => patch({ is_featured: v })}
          />
          <ToggleField
            label="Visível no site"
            checked={form.is_active}
            onChange={(v) => patch({ is_active: v })}
          />
          <div className="flex items-center gap-2">
            <Label className="text-sm">Ordem</Label>
            <Input
              type="number"
              className="w-20"
              value={form.sort_order}
              onChange={(e) => patch({ sort_order: Number(e.target.value) })}
            />
          </div>
          <Button
            onClick={() => void save()}
            disabled={table.isSaving}
            className="w-full bg-ember text-ember-foreground hover:bg-ember/90 sm:ml-auto sm:w-auto"
          >
            {table.isSaving ? "Salvando..." : editingId ? "Salvar alterações" : "Criar produto"}
          </Button>
        </div>
      </Panel>

      <Panel title={`Produtos cadastrados (${products?.length ?? 0})`}>
        <div className="grid gap-3">
          {(products ?? []).map((product) => (
            <div
              key={product.id}
              className="flex flex-wrap items-center gap-3 rounded-md border border-border p-3 sm:gap-4"
            >
              <img
                src={product.images?.[0] ?? "/produtos/oficina.jpg"}
                alt=""
                className="size-12 shrink-0 rounded object-cover sm:size-14"
              />
              <div className="min-w-[10rem] flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(product.sale_price ?? product.price)} ·{" "}
                  {product.dimensions || "sob medida"}
                </p>
              </div>
              {product.is_featured ? (
                <Badge className="bg-ember text-ember-foreground">destaque</Badge>
              ) : null}
              {!product.is_active ? <Badge variant="secondary">oculto</Badge> : null}
              <Button variant="outline" size="sm" onClick={() => startEditing(product)}>
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Remover produto"
                onClick={() => void table.remove(product.id, "Produto removido")}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
