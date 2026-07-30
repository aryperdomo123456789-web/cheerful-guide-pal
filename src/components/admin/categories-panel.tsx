import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel, ToggleField } from "@/components/admin/admin-ui";
import { useAdminSiteId } from "@/components/admin/admin-site-context";
import { useAdminTable } from "@/hooks/use-admin-table";
import { categoriesQuery, slugify } from "@/lib/site-data";

export function CategoriesPanel() {
  const siteId = useAdminSiteId();
  const { data: categories } = useQuery(categoriesQuery(siteId));
  const table = useAdminTable("categories");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const add = async () => {
    if (!siteId) return;
    if (!name.trim()) {
      toast.error("Informe o nome");
      return;
    }
    const created = await table.insert(
      {
        name: name.trim(),
        slug: slugify(name),
        description: description.trim(),
        site_id: siteId,
        sort_order: (categories?.length ?? 0) + 1,
      },
      "Categoria criada",
    );
    if (created) {
      setName("");
      setDescription("");
    }
  };

  return (
    <Panel title="Categorias">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]">
        <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          onClick={() => void add()}
          disabled={table.isSaving}
          className="bg-ember text-ember-foreground hover:bg-ember/90"
        >
          <Plus className="mr-2 size-4" /> Adicionar
        </Button>
      </div>

      <div className="mt-6 grid gap-3">
        {(categories ?? []).map((category) => (
          <div
            key={category.id}
            className="flex flex-col gap-3 rounded-md border border-border p-3 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <Input
              className="w-full sm:w-44"
              defaultValue={category.name}
              onBlur={(e) => {
                if (e.target.value !== category.name) {
                  void table.update(category.id, { name: e.target.value });
                }
              }}
            />
            <Input
              className="w-full min-w-0 flex-1 sm:min-w-48"
              defaultValue={category.description}
              onBlur={(e) => {
                if (e.target.value !== category.description) {
                  void table.update(category.id, { description: e.target.value });
                }
              }}
            />
            <ToggleField
              label="Ativa"
              checked={category.is_active}
              onChange={(value) => void table.update(category.id, { is_active: value })}
            />
            <Button
              variant="ghost"
              size="sm"
              aria-label="Remover categoria"
              onClick={() => void table.remove(category.id, "Categoria removida")}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}
