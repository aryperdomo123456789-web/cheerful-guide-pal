import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel, ToggleField } from "@/components/admin/admin-ui";
import { useAdminSiteId } from "@/components/admin/admin-site-context";
import { useAdminTable } from "@/hooks/use-admin-table";
import { ambientesQuery, slugify } from "@/lib/site-data";

export function AmbientesPanel() {
  const siteId = useAdminSiteId();
  const { data: ambientes } = useQuery(ambientesQuery(siteId));
  const table = useAdminTable("ambientes");
  const [name, setName] = useState("");

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
        site_id: siteId,
        sort_order: (ambientes?.length ?? 0) + 1,
      },
      "Ambiente criado",
    );
    if (created) setName("");
  };

  return (
    <Panel title="Ambientes">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Ex.: Varanda" value={name} onChange={(e) => setName(e.target.value)} />
        <Button
          onClick={() => void add()}
          disabled={table.isSaving}
          className="bg-ember text-ember-foreground hover:bg-ember/90"
        >
          <Plus className="mr-2 size-4" /> Adicionar
        </Button>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {(ambientes ?? []).map((ambiente) => (
          <div
            key={ambiente.id}
            className="flex flex-wrap items-center gap-3 rounded-md border border-border p-3"
          >
            <Input
              defaultValue={ambiente.name}
              onBlur={(e) => {
                if (e.target.value !== ambiente.name) {
                  void table.update(ambiente.id, { name: e.target.value });
                }
              }}
            />
            <ToggleField
              label="Ativo"
              checked={ambiente.is_active}
              onChange={(value) => void table.update(ambiente.id, { is_active: value })}
            />
            <Button
              variant="ghost"
              size="sm"
              aria-label="Remover ambiente"
              onClick={() => void table.remove(ambiente.id, "Ambiente removido")}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}
