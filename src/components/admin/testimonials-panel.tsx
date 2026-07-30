import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Panel, ToggleField } from "@/components/admin/admin-ui";
import { useAdminSiteId } from "@/components/admin/admin-site-context";
import { useAdminTable } from "@/hooks/use-admin-table";
import { testimonialsQuery } from "@/lib/site-data";

const EMPTY_TESTIMONIAL = { author: "", city: "", content: "", rating: 5 };
const RATINGS = [5, 4, 3, 2, 1];

export function TestimonialsPanel() {
  const siteId = useAdminSiteId();
  const { data: testimonials } = useQuery(testimonialsQuery(siteId));
  const table = useAdminTable("testimonials");
  const [form, setForm] = useState({ ...EMPTY_TESTIMONIAL });

  const add = async () => {
    if (!siteId) return;
    if (!form.author.trim() || !form.content.trim()) {
      toast.error("Preencha nome e depoimento");
      return;
    }
    const created = await table.insert(
      { ...form, site_id: siteId, sort_order: (testimonials?.length ?? 0) + 1 },
      "Depoimento adicionado",
    );
    if (created) setForm({ ...EMPTY_TESTIMONIAL });
  };

  return (
    <div className="space-y-6">
      <Panel title="Novo depoimento">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
          <Select
            value={String(form.rating)}
            onValueChange={(value) => setForm({ ...form, rating: Number(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RATINGS.map((rating) => (
                <SelectItem key={rating} value={String(rating)}>
                  {rating} estrela(s)
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
        <Button
          onClick={() => void add()}
          disabled={table.isSaving}
          className="mt-3 bg-ember text-ember-foreground hover:bg-ember/90"
        >
          <Plus className="mr-2 size-4" /> Adicionar
        </Button>
      </Panel>

      <Panel title="Depoimentos publicados">
        <div className="grid gap-3">
          {(testimonials ?? []).map((testimonial) => (
            <div key={testimonial.id} className="rounded-md border border-border p-3">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-medium">
                  {testimonial.author}{" "}
                  <span className="text-xs text-muted-foreground">{testimonial.city}</span>
                </p>
                <Badge variant="secondary">{testimonial.rating}★</Badge>
                <ToggleField
                  label="Visível"
                  checked={testimonial.is_active}
                  onChange={(value) => void table.update(testimonial.id, { is_active: value })}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Remover depoimento"
                  className="ml-auto"
                  onClick={() => void table.remove(testimonial.id, "Depoimento removido")}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
