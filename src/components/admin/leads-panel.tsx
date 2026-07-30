import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState, Panel } from "@/components/admin/admin-ui";
import { useAdminSiteId } from "@/components/admin/admin-site-context";
import { useAdminTable } from "@/hooks/use-admin-table";
import { LEAD_STATUSES, leadsQuery, type LeadSource } from "@/lib/leads";

export function LeadsPanel({ source = "form" }: { source?: LeadSource }) {
  const siteId = useAdminSiteId();
  const { data: leads } = useQuery(leadsQuery(siteId, source));
  const table = useAdminTable("leads");

  const isPopup = source === "popup";
  const total = leads?.length ?? 0;

  return (
    <Panel
      title={isPopup ? `Cadastros do pop-up (${total})` : `Orçamentos recebidos (${total})`}
    >
      {!total ? (
        <EmptyState>
          {isPopup ? "Nenhum cadastro pelo pop-up ainda." : "Nenhum pedido recebido ainda."}
        </EmptyState>
      ) : (
        <div className="grid gap-3">
          {(leads ?? []).map((lead) => (
            <div key={lead.id} className="rounded-md border border-border p-3 sm:p-4">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-medium">{lead.name}</p>
                <span className="text-sm text-muted-foreground">{lead.phone}</span>
                {lead.email ? (
                  <span className="text-sm text-muted-foreground">{lead.email}</span>
                ) : null}
                {lead.city ? <Badge variant="secondary">{lead.city}</Badge> : null}
                <span className="text-xs text-muted-foreground sm:ml-auto">
                  {new Date(lead.created_at).toLocaleString("pt-BR")}
                </span>
              </div>
              {lead.product_name ? (
                <p className="mt-2 text-sm">
                  <strong>Peça:</strong> {lead.product_name}
                </p>
              ) : null}
              {lead.message ? (
                <p className="mt-1 text-sm text-muted-foreground">{lead.message}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Select
                  value={lead.status}
                  onValueChange={(status) => void table.update(lead.id, { status })}
                >
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Remover contato"
                  onClick={() => void table.remove(lead.id, "Contato removido")}
                >
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
