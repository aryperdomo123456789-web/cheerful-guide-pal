import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { getErrorMessage } from "@/lib/errors";

export type AdminTable =
  | "products"
  | "categories"
  | "ambientes"
  | "testimonials"
  | "leads"
  | "site_settings";

type WriteResult = { error: { message: string } | null };
type Filterable = { eq: (column: string, value: string) => PromiseLike<WriteResult> };

/**
 * Acesso mínimo e tipado às operações de escrita, sem espalhar casts pelo painel.
 * (Os tipos gerados do banco não aceitam nome de tabela como união genérica.)
 */
function writer(table: AdminTable) {
  return supabase.from(table) as unknown as {
    insert: (values: Record<string, unknown>) => PromiseLike<WriteResult>;
    update: (values: Record<string, unknown>) => Filterable;
    delete: () => Filterable;
  };
}

/**
 * CRUD padronizado do painel: um único lugar cuidando de toast de erro,
 * mensagem de sucesso, estado de "salvando" e invalidação do cache.
 */
export function useAdminTable(table: AdminTable) {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: [table] });
  }, [queryClient, table]);

  const run = useCallback(
    async (operation: () => PromiseLike<WriteResult>, successMessage?: string) => {
      setIsSaving(true);
      try {
        const { error } = await operation();
        if (error) {
          toast.error(getErrorMessage(error, "Não foi possível salvar."));
          return false;
        }
        if (successMessage) toast.success(successMessage);
        refresh();
        return true;
      } catch (error) {
        toast.error(getErrorMessage(error, "Não foi possível salvar."));
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [refresh],
  );

  const insert = useCallback(
    (values: Record<string, unknown>, successMessage?: string) =>
      run(() => writer(table).insert(values), successMessage),
    [run, table],
  );

  const update = useCallback(
    (id: string, values: Record<string, unknown>, successMessage?: string) =>
      run(() => writer(table).update(values).eq("id", id), successMessage),
    [run, table],
  );

  const remove = useCallback(
    (id: string, successMessage?: string) =>
      run(() => writer(table).delete().eq("id", id), successMessage),
    [run, table],
  );

  return { insert, update, remove, refresh, isSaving };
}
