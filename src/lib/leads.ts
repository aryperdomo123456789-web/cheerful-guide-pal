import { supabase } from "@/integrations/supabase/client";
import type { Lead } from "@/lib/site-types";

/** Marca usada em `product_name` para separar cadastros do pop-up dos orçamentos. */
export const POPUP_LEAD_TAG = "Popup - Cupom";

export type LeadSource = "form" | "popup";

export const LEAD_STATUSES = [
  { value: "novo", label: "Novo" },
  { value: "em-contato", label: "Em contato" },
  { value: "orcado", label: "Orçado" },
  { value: "fechado", label: "Fechado" },
  { value: "perdido", label: "Perdido" },
] as const;

const isPopupLead = (lead: Lead) => lead.product_name === POPUP_LEAD_TAG;

/** Orçamentos/cadastros de um site, já separados por origem. */
export const leadsQuery = (siteId: string | null | undefined, source: LeadSource) => ({
  queryKey: ["leads", siteId ?? null, source] as const,
  enabled: Boolean(siteId),
  queryFn: async (): Promise<Lead[]> => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("site_id", siteId!)
      .order("created_at", { ascending: false });
    if (error) throw error;
    const leads = (data ?? []) as Lead[];
    return leads.filter((lead) => (source === "popup" ? isPopupLead(lead) : !isPopupLead(lead)));
  },
});
