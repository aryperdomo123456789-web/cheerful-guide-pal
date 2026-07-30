import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

type AdminAccess = "loading" | "granted" | "denied";

/**
 * Verifica o acesso de administrador e expõe o logout.
 * Isola a regra de permissão do restante da interface do painel.
 */
export function useAdminSession() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [access, setAccess] = useState<AdminAccess>("loading");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        if (!cancelled) setAccess("denied");
        return;
      }
      await supabase.rpc("claim_first_admin");
      const { data } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      if (!cancelled) setAccess(data ? "granted" : "denied");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signOut = useCallback(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }, [navigate, queryClient]);

  return { access, signOut };
}
